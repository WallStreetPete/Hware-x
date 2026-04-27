/**
 * One-time fix: pre-existing rows have revenue_usd / ebitda_usd in thousands of USD,
 * but the rest of the system (and the now-fixed ingest) expects millions. Divide by 1000.
 *
 * Idempotent — uses a marker row in `meta` so re-running is a no-op.
 */
import { db } from "@/lib/db";

db().exec(`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT)`);

const MARKER = "revenue_units_normalized_v1";
const existing = db().prepare("SELECT value FROM meta WHERE key = ?").get(MARKER) as { value: string } | undefined;
if (existing) {
  console.log(`✓ already normalized at ${existing.value} — nothing to do`);
  process.exit(0);
}

const before = db().prepare(`
  SELECT COUNT(*) AS n,
         AVG(revenue_usd) AS avg_rev,
         MAX(revenue_usd) AS max_rev
  FROM companies WHERE revenue_usd > 0
`).get() as any;

console.log(`before: ${before.n} rows · avg revenue = ${before.avg_rev?.toFixed(0)} · max = ${before.max_rev?.toFixed(0)}`);

const tx = db().transaction(() => {
  db().exec(`UPDATE companies SET revenue_usd = revenue_usd / 1000.0 WHERE revenue_usd IS NOT NULL`);
  db().exec(`UPDATE companies SET ebitda_usd  = ebitda_usd  / 1000.0 WHERE ebitda_usd  IS NOT NULL`);
  db().prepare(`INSERT INTO meta (key, value, updated_at) VALUES (?, datetime('now'), datetime('now'))`).run(MARKER);
});
tx();

const after = db().prepare(`
  SELECT AVG(revenue_usd) AS avg_rev, MAX(revenue_usd) AS max_rev
  FROM companies WHERE revenue_usd > 0
`).get() as any;

console.log(`after:  avg revenue = ${after.avg_rev?.toFixed(0)} · max = ${after.max_rev?.toFixed(0)}`);

const sample = db().prepare(`
  SELECT name, revenue_usd FROM companies
  WHERE name LIKE 'NVIDIA%' OR name LIKE 'Apple Inc.%' OR name LIKE 'Intel Corporation%' OR name LIKE 'Altera%'
`).all() as any[];
console.log(`spot-check (now in $M):`);
sample.forEach(r => console.log(`  ${r.name.slice(0, 40)} → $${r.revenue_usd?.toFixed(0)}M`));
