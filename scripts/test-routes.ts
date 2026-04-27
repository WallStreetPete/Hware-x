/**
 * Smoke test: hit every important route + API endpoint and assert HTTP 200.
 * Run from cli:    npx tsx scripts/test-routes.ts
 * Or under loop:   the gap-finder calls this first; if anything is red, fix that first.
 */

import { COMPANIES } from "../lib/data/companies";
import { SECTORS } from "../lib/data/sectors";
import { TECHNOLOGIES } from "../lib/data/technologies";

const BASE = process.env.HX_BASE || "http://localhost:3030";

type Result = { url: string; status: number; ok: boolean; ms: number; note?: string };

async function hit(url: string, opts: RequestInit = {}): Promise<Result> {
  const t0 = Date.now();
  try {
    const r = await fetch(BASE + url, opts);
    return { url, status: r.status, ok: r.ok, ms: Date.now() - t0 };
  } catch (e: any) {
    return { url, status: 0, ok: false, ms: Date.now() - t0, note: e.message };
  }
}

async function main() {
  const targets: string[] = [
    "/",
    "/universe",
    "/explore",
    "/explore?q=nvidia",
    "/explore?industry=Semiconductors",
    "/sectors",
    "/tech",
    "/catalog",
    "/catalog/silicon",
    "/catalog/energy",
    "/catalog/fiber",
    "/catalog/optical",
    "/catalog/datacenters",
    "/catalog/switches",
    "/catalog/storage",
    "/catalog/cooling",
    "/search",
    "/chat",
  ];
  // Curated detail pages — sample 6
  for (const c of COMPANIES.slice(0, 6)) targets.push(`/companies/${c.id}`);
  // Sectors — sample 4
  for (const s of SECTORS.slice(0, 4)) targets.push(`/sectors/${s.id}`);
  // Tech — sample 3
  for (const t of TECHNOLOGIES.slice(0, 3)) targets.push(`/tech/${t.id}`);
  // S&P explore
  targets.push("/explore/5466834");
  // API
  targets.push("/api/db/industries");
  targets.push("/api/db/cluster");
  targets.push("/api/db/cluster?industry=Semiconductors&limit=20");
  targets.push("/api/db/search?q=nvidia&limit=5");
  targets.push("/api/db/company/5466834");

  const results: Result[] = [];
  for (const u of targets) results.push(await hit(u));

  const fails = results.filter(r => !r.ok);
  const slowest = [...results].sort((a, b) => b.ms - a.ms).slice(0, 3);

  console.log(`\n${results.length} routes tested · ${results.length - fails.length} pass · ${fails.length} fail`);
  if (fails.length) {
    console.log("\n❌ FAILURES:");
    for (const f of fails) console.log(`  ${f.status}  ${f.url}  ${f.note ?? ""}`);
  }
  console.log("\n⏱  Slowest:");
  for (const s of slowest) console.log(`  ${s.ms}ms  ${s.url}`);

  if (fails.length) process.exit(1);
}

main();
