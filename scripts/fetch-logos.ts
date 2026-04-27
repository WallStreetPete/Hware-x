/**
 * fetch-logos.ts — download a logo for every top-N company in the DB.
 *
 * Sources (tried in order, first 200 wins):
 *   1. https://logo.clearbit.com/<domain>          (best quality when it works)
 *   2. https://icons.duckduckgo.com/ip3/<domain>.ico (very reliable, smaller)
 *   3. https://www.google.com/s2/favicons?domain=<domain>&sz=128
 *
 * Saves to public/logos/<sp_id>.png (extension is a lie — we serve the raw bytes).
 * Sets companies.logo_at = now() on success so the API can flag which logos are real.
 *
 * Usage:
 *   npx tsx scripts/fetch-logos.ts            # top 1000
 *   npx tsx scripts/fetch-logos.ts --limit=2000
 *   npx tsx scripts/fetch-logos.ts --force    # re-fetch even if logo_at set
 */
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";

const args = new Map(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, "").split("=");
  return [k, v ?? "true"];
}));

const LIMIT = parseInt(args.get("limit") || "1000", 10);
const FORCE = args.get("force") === "true";
const CONCURRENCY = 12;
const TIMEOUT_MS = 8000;

const PUBLIC_DIR = path.resolve(process.cwd(), "public", "logos");
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

function domainOf(url: string | null): string | null {
  if (!url) return null;
  let s = url.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0].split("?")[0];
  return s || null;
}

async function tryFetch(url: string): Promise<Buffer | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HWARE-X/1.0)" },
    });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    // reject empty / 1px placeholder responses but keep real micro-favicons
    if (buf.byteLength < 90) return null;
    return buf;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HWARE-X/1.0)" },
    });
    if (!r.ok) return null;
    const text = await r.text();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function parseIconHref(html: string, base: string): string[] {
  const out: string[] = [];
  // <link rel="icon|shortcut icon|apple-touch-icon" href="...">
  const re = /<link[^>]+rel=["'](?:[^"']*\b(?:icon|shortcut icon|apple-touch-icon)\b[^"']*)["'][^>]*>/gi;
  const hrefRe = /href=["']([^"']+)["']/i;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[0].match(hrefRe);
    if (href) {
      try { out.push(new URL(href[1], base).toString()); } catch {}
    }
  }
  return out;
}

async function fetchLogo(domain: string): Promise<Buffer | null> {
  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://${domain}/favicon.ico`,
    `https://www.${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `http://${domain}/favicon.ico`,
  ];
  for (const src of sources) {
    const buf = await tryFetch(src);
    if (buf) return buf;
  }
  // Last resort: fetch the homepage and look for <link rel="icon">
  for (const baseUrl of [`https://${domain}`, `https://www.${domain}`]) {
    const html = await fetchHtml(baseUrl);
    if (!html) continue;
    const hrefs = parseIconHref(html, baseUrl);
    for (const h of hrefs) {
      const buf = await tryFetch(h);
      if (buf) return buf;
    }
  }
  return null;
}

// Schema migration: add logo_at if missing
const cols = db().prepare("PRAGMA table_info(companies)").all() as { name: string }[];
if (!cols.find(c => c.name === "logo_at")) {
  console.log("→ adding companies.logo_at column");
  db().exec("ALTER TABLE companies ADD COLUMN logo_at TEXT");
}

// Pick the work set: any sized company (public OR private) with a website.
// Order by COALESCE(mcap, revenue*3) so the most-likely-to-be-shown logos get fetched first.
const where = FORCE
  ? "(market_cap_usd > 0 OR revenue_usd > 0) AND status = 'Operating' AND website IS NOT NULL"
  : "(market_cap_usd > 0 OR revenue_usd > 0) AND status = 'Operating' AND website IS NOT NULL AND logo_at IS NULL";

const rows = db().prepare(
  `SELECT sp_id, name, website FROM companies WHERE ${where} ORDER BY COALESCE(market_cap_usd, revenue_usd * 3) DESC LIMIT ?`
).all(LIMIT) as { sp_id: string; name: string; website: string }[];

console.log(`→ ${rows.length} companies to fetch (limit=${LIMIT}, force=${FORCE})`);

const setLogo = db().prepare("UPDATE companies SET logo_at = datetime('now') WHERE sp_id = ?");

let ok = 0, fail = 0, done = 0;
const start = Date.now();

async function worker(slice: typeof rows) {
  for (const r of slice) {
    const domain = domainOf(r.website);
    if (!domain) { fail++; done++; continue; }
    const buf = await fetchLogo(domain);
    done++;
    if (!buf) {
      fail++;
      if (done % 25 === 0) console.log(`  [${done}/${rows.length}] ok=${ok} fail=${fail} (last fail: ${r.name})`);
      continue;
    }
    fs.writeFileSync(path.join(PUBLIC_DIR, `${r.sp_id}.png`), buf);
    setLogo.run(r.sp_id);
    ok++;
    if (done % 25 === 0) console.log(`  [${done}/${rows.length}] ok=${ok} fail=${fail}`);
  }
}

async function main() {
  const chunks: typeof rows[] = Array.from({ length: CONCURRENCY }, () => []);
  rows.forEach((r, i) => chunks[i % CONCURRENCY].push(r));
  await Promise.all(chunks.map(worker));
  const dur = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✓ done in ${dur}s · ok=${ok} fail=${fail} · ${(ok / Math.max(1, rows.length) * 100).toFixed(1)}% success`);
}

main().catch(e => { console.error(e); process.exit(1); });
