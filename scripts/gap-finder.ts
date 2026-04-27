/**
 * Gap-finder: one iteration of autonomous enrichment.
 *
 * 1. Reads agent-state.json for the cursor.
 * 2. Picks the next category from the queue.
 * 3. Searches Exa for product pages in that category.
 * 4. Asks Claude to extract a structured product list.
 * 5. Writes products to db_products (idempotent).
 * 6. Advances the cursor + appends a CHANGELOG entry + records run in agent_runs.
 *
 * Stays under per-iteration budget caps (see scripts/budget.ts).
 * Run:  npx tsx scripts/gap-finder.ts
 */

import fs from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
loadEnv();

import Anthropic from "@anthropic-ai/sdk";
import Exa from "exa-js";
import { insertProduct, logAgentRun, productCounts, db, upsertCuratedEnrichment, curatedEnrichmentCount } from "../lib/db";
import { COMPANIES } from "../lib/data/companies";
import { reset, tick, snapshot, BudgetExceededError } from "./budget";

const STATE_PATH = path.join(process.cwd(), "data", "agent-state.json");
const CHANGELOG = path.join(process.cwd(), "CHANGELOG.md");

type State = {
  iterationCount: number;
  lastIteration: string | null;
  cursor: { phase: string; categoryQueue: string[]; categoryIndex?: number };
  tokenSpend: { totalCallsExa: number; totalCallsFirecrawl: number; totalCallsAnthropic: number; lastIterAt: string | null };
  notes: string[];
};

function readState(): State {
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}
function writeState(s: State) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

// Multiple query variants per category — rotated per iteration so we discover variety.
const QUERIES_BY_CAT: Record<string, string[]> = {
  gpu:     [
    "datacenter GPU AI accelerator product specs FP8 HBM 2024 2025",
    "edge AI accelerator inference NPU specs TOPS",
    "consumer workstation GPU 2025 specs VRAM",
    "Chinese AI accelerator Huawei Biren Cambricon specs",
    "wafer-scale Cerebras Groq SambaNova LPU specs",
  ],
  cpu:     [
    "server CPU specs cores TDP datacenter Xeon EPYC Grace 2024 2025",
    "Arm Neoverse server CPU AWS Graviton Microsoft Cobalt specs",
    "consumer desktop CPU 2025 Ryzen Core Ultra specs",
    "mobile laptop CPU Snapdragon X Apple M4 specs",
    "Chinese server CPU Huawei Kunpeng Loongson specs",
  ],
  memory:  [
    "DDR5 HBM3E HBM4 memory module datacenter specs capacity bandwidth",
    "enterprise SSD QLC TLC NVMe capacity TB specs",
    "GDDR7 graphics memory specs bandwidth",
    "LPDDR5X mobile memory specs bandwidth",
    "CXL memory expansion DRAM specs",
  ],
  switch:  [
    "datacenter ethernet switch 800G 1.6T product specs Tomahawk Quantum",
    "InfiniBand NDR XDR switch specs ports",
    "white-box network switch ODM Edgecore Celestica specs",
    "campus enterprise switch specs PoE",
    "Cisco Arista Juniper datacenter switch 2025 specs",
  ],
  storage: [
    "enterprise NVMe SSD QLC TLC capacity TB datacenter AI training",
    "all-flash array enterprise storage Pure NetApp Dell specs",
    "object storage S3 compatible enterprise specs",
    "HDD HAMR Seagate WD nearline capacity specs",
    "tape archive library LTO enterprise specs",
  ],
  cooling: [
    "data center liquid cooling CDU cold plate immersion product specs kW",
    "rear door heat exchanger datacenter specs kW",
    "two-phase immersion cooling fluid datacenter specs",
    "industrial chiller datacenter heat rejection specs MW",
    "in-row air cooling datacenter CRAH specs",
  ],
  energy:  [
    "renewable energy PPA hyperscaler data center 2025 GW capacity",
    "small modular reactor SMR vendors specs MW",
    "battery energy storage system BESS hyperscaler specs MWh",
    "natural gas turbine GE Siemens datacenter specs MW",
    "nuclear plant capacity hyperscaler PPA 2025 specs",
  ],
  fiber:   [
    "optical fiber cable transceiver 800G 1.6T datacenter product specs",
    "submarine cable system specs Tbps capacity 2025",
    "DCI long-haul DWDM coherent transceiver specs",
    "hollow core fiber low-latency datacenter specs",
    "co-packaged optics CPO switch specs",
  ],
};

function pickQuery(category: string, iter: number): string {
  const variants = QUERIES_BY_CAT[category] || [category];
  return variants[iter % variants.length];
}

async function exaSearch(client: Exa, q: string) {
  tick("exa");
  return client.searchAndContents(q, {
    type: "auto",
    numResults: 6,
    text: { maxCharacters: 1500 },
  });
}

async function claudeExtract(client: Anthropic, category: string, snippets: string) {
  tick("anthropic");
  const r = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    max_tokens: 2000,
    tools: [{
      name: "submit_products",
      description: `Submit a list of real, currently-shipping products in the ${category} category found in the provided snippets.`,
      input_schema: {
        type: "object",
        properties: {
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                vendor_name: { type: "string" },
                name:        { type: "string" },
                released:    { type: "string", description: "Year or YYYY-MM. Empty string if unknown." },
                msrp_usd:    { type: "number", description: "MSRP in USD if known, else 0." },
                specs:       { type: "object", description: "Category-specific specs as key/value strings or numbers." }
              },
              required: ["vendor_name", "name"]
            }
          }
        },
        required: ["products"]
      }
    }],
    tool_choice: { type: "tool", name: "submit_products" },
    messages: [{
      role: "user",
      content: `Extract real, named, currently-shipping ${category} products from these snippets. Skip rumors. 3–15 products. Include vendor specs in the specs object (process, memory, bandwidth, tdpW, perfFP8, perfFP4 for GPUs; analogous for other categories).\n\n${snippets}`
    }],
  });

  const toolUse = r.content.find(b => b.type === "tool_use") as any;
  if (!toolUse) throw new Error("no tool_use block");
  return toolUse.input as { products: any[] };
}

function appendChangelog(line: string) {
  const existing = fs.readFileSync(CHANGELOG, "utf8");
  const today = new Date().toISOString().slice(0, 10);
  const block = `\n## ${today} — Agent loop iteration\n\n- ${line}\n`;
  // Insert after the first H1 / metadata block (after the first horizontal rule)
  const insertAt = existing.indexOf("---") + 4;
  fs.writeFileSync(CHANGELOG, existing.slice(0, insertAt) + block + existing.slice(insertAt));
}

// ─────────────── Curated-enrichment mode ───────────────
async function enrichOneCuratedCompany(anthropic: Anthropic): Promise<{ companyId: string; result: string }> {
  // Find next curated company missing all three enrichment fields not yet in DB.
  const stmt = db().prepare("SELECT 1 FROM curated_enrichments WHERE curated_id = ?");
  const target = COMPANIES.find(c => !c.longDesc && !c.moat && !c.risk && !stmt.get(c.id));
  if (!target) return { companyId: "—", result: "no curated companies need enrichment" };

  tick("anthropic");
  const r = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    max_tokens: 1500,
    tools: [{
      name: "submit_enrichment",
      description: "Submit a Stratechery/SemiAnalysis-style longDesc, moat, and risk for the company.",
      input_schema: {
        type: "object",
        properties: {
          long_desc: { type: "string", description: "2-3 dense sentences explaining what this company actually does in the AI infra stack — specific, no fluff." },
          moat:      { type: "string", description: "1-2 sentences on the structural moat (lock-in, scale, IP, ecosystem)." },
          risk:      { type: "string", description: "1-2 sentences on the most serious risk (geopolitical, technology, customer concentration, regulatory)." },
        },
        required: ["long_desc", "moat", "risk"]
      }
    }],
    tool_choice: { type: "tool", name: "submit_enrichment" },
    messages: [{
      role: "user",
      content: `Company: ${target.name}${target.ticker ? ` [${target.ticker}]` : ""}
HQ: ${target.hq}
Sector: ${target.sector}
Tier: ${target.tier}
One-liner: ${target.blurb}
Products: ${target.products.join(", ")}

Write a tight analyst profile. Sharp prose, no marketing fluff. Submit via the tool.`
    }],
  });
  const t = r.content.find(b => b.type === "tool_use") as any;
  if (!t) throw new Error("no tool_use block in claude response");
  upsertCuratedEnrichment({
    curated_id: target.id,
    long_desc: t.input.long_desc,
    moat: t.input.moat,
    risk: t.input.risk,
  });
  return { companyId: target.id, result: `enriched ${target.name}` };
}

async function main() {
  reset();
  const state = readState();
  state.iterationCount += 1;
  state.lastIteration = new Date().toISOString();

  // ── Mode selection ──
  const argMode = (process.argv.find(a => a.startsWith("--mode=")) || "").split("=")[1];

  if (argMode === "curated") {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    let resultNote = "";
    let companyId = "";
    try {
      const r = await enrichOneCuratedCompany(anthropic);
      companyId = r.companyId; resultNote = r.result;
    } catch (e: any) {
      resultNote = `ERROR: ${e.message}`;
    }
    const snap = snapshot();
    state.tokenSpend.totalCallsAnthropic += snap.anthropic;
    state.tokenSpend.lastIterAt = new Date().toISOString();
    writeState(state);
    logAgentRun(`enrich:curated:${companyId}`, resultNote, snap.exa, snap.firecrawl, snap.anthropic);
    appendChangelog(`gap-finder enriched curated company **${companyId}** — ${resultNote}. Total enriched curated companies: ${curatedEnrichmentCount()}. Spend: 0/0/${snap.anthropic}.`);
    console.log(`[gap] curated mode done — ${resultNote}`);
    console.log(`[gap] curated enrichment count:`, curatedEnrichmentCount());
    return;
  }

  // CLI override: `--category=X` runs that category once without advancing the cursor.
  const argOverride = process.argv.find(a => a.startsWith("--category="));
  let category: string;
  if (argOverride) {
    category = argOverride.split("=")[1];
    console.log(`[gap] iteration #${state.iterationCount} · OVERRIDE category: ${category}`);
  } else {
    const queue = state.cursor.categoryQueue;
    if (!queue || queue.length === 0) { console.log("[gap] no categories in queue; nothing to do"); return; }
    const idx = (state.cursor.categoryIndex ?? 0) % queue.length;
    category = queue[idx];
    state.cursor.categoryIndex = (idx + 1) % queue.length;
    console.log(`[gap] iteration #${state.iterationCount} · category: ${category}`);
  }

  if (!process.env.EXA_API_KEY)        throw new Error("EXA_API_KEY missing");
  if (!process.env.ANTHROPIC_API_KEY)  throw new Error("ANTHROPIC_API_KEY missing");

  const exa = new Exa(process.env.EXA_API_KEY);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let inserted = 0;
  let resultNote = "";
  try {
    const q = pickQuery(category, state.iterationCount);
    console.log(`[gap]   query: ${q}`);
    const search = await exaSearch(exa, q);
    const snippets = (search.results || []).slice(0, 6).map((r: any) =>
      `### ${r.title}\nURL: ${r.url}\n${(r.text || "").slice(0, 900)}`
    ).join("\n\n---\n\n");

    if (!snippets) { resultNote = "no exa results"; }
    else {
      const extracted = await claudeExtract(anthropic, category, snippets);
      const products = extracted.products || [];
      for (const p of products) {
        if (!p.vendor_name || !p.name) continue;
        const sourceUrl = (search.results?.[0]?.url) || null;
        try {
          const r = insertProduct({
            vendor_name: p.vendor_name,
            category,
            name: p.name,
            released: p.released || null,
            specs_json: p.specs ? JSON.stringify(p.specs) : null,
            msrp_usd: typeof p.msrp_usd === "number" ? p.msrp_usd : null,
            source_url: sourceUrl,
            source: "exa+claude",
            confidence: 0.7,
          });
          if ((r as any).changes > 0) inserted += 1;
        } catch {}
      }
      resultNote = `${inserted} new products in '${category}' (${products.length} extracted)`;
    }
  } catch (e: any) {
    if (e instanceof BudgetExceededError) resultNote = `BUDGET STOP: ${e.message}`;
    else                                  resultNote = `ERROR: ${e.message}`;
  }

  const snap = snapshot();
  state.tokenSpend.totalCallsExa       += snap.exa;
  state.tokenSpend.totalCallsFirecrawl += snap.firecrawl;
  state.tokenSpend.totalCallsAnthropic += snap.anthropic;
  state.tokenSpend.lastIterAt = new Date().toISOString();

  writeState(state);
  logAgentRun(`enrich:${category}`, resultNote, snap.exa, snap.firecrawl, snap.anthropic);

  const counts = productCounts() as any[];
  const totalProducts = counts.reduce((a, b) => a + b.c, 0);
  appendChangelog(`gap-finder ran for **${category}** — ${resultNote}. ` +
    `Total enriched products in DB: ${totalProducts}. Spend (exa/fc/claude): ${snap.exa}/${snap.firecrawl}/${snap.anthropic}.`);

  console.log(`[gap] done — ${resultNote}`);
  console.log(`[gap] DB product counts:`, counts);
  console.log(`[gap] this iteration spend:`, snap);
}

main().catch(e => { console.error(e); process.exit(1); });
