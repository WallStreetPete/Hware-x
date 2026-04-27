/**
 * Audit the curated COMPANIES list for missing fields.
 * Pure read-only diagnostic, no AI calls. Helps prioritize gap-finder targets.
 *
 * Usage: npx tsx scripts/audit-curated.ts
 */

import { COMPANIES } from "../lib/data/companies";
import { DOMAINS } from "../lib/data/domains";

type Field = "marketCapUSD" | "revenueUSD" | "longDesc" | "moat" | "risk" | "domain";

const buckets: Record<Field, string[]> = {
  marketCapUSD: [],
  revenueUSD: [],
  longDesc: [],
  moat: [],
  risk: [],
  domain: [],
};

for (const c of COMPANIES) {
  if (c.marketCapUSD == null) buckets.marketCapUSD.push(c.id);
  if (c.revenueUSD == null)   buckets.revenueUSD.push(c.id);
  if (!c.longDesc)            buckets.longDesc.push(c.id);
  if (!c.moat)                buckets.moat.push(c.id);
  if (!c.risk)                buckets.risk.push(c.id);
  if (!DOMAINS[c.id])         buckets.domain.push(c.id);
}

console.log(`\n${COMPANIES.length} curated companies\n`);
console.log("MISSING FIELDS (count / first 5 ids):\n");
for (const [field, ids] of Object.entries(buckets)) {
  const pct = ((ids.length / COMPANIES.length) * 100).toFixed(0);
  console.log(`  ${field.padEnd(15)} ${String(ids.length).padStart(4)} / ${COMPANIES.length}  (${pct}%)  →  ${ids.slice(0, 5).join(", ")}${ids.length > 5 ? ", …" : ""}`);
}

const fullyTagged = COMPANIES.filter(c =>
  c.marketCapUSD != null && c.longDesc && c.moat && c.risk && DOMAINS[c.id]
);
console.log(`\nFully-tagged: ${fullyTagged.length} / ${COMPANIES.length}`);
console.log(`First few fully-tagged: ${fullyTagged.slice(0, 5).map(c => c.name).join(", ")}`);
