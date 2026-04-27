import { db, type DbCompany } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Module-level cache for the industry summary (heaviest query — scans 54k rows).
// Companies table is append-only via the ingest script, so a long-lived cache is safe.
// Invalidated whenever the dev server restarts (i.e. after `scripts/ingest.ts` runs).
let _industriesCache: { rows: any[]; at: number } | null = null;
const INDUSTRIES_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Returns either:
 *  - Industry summary (when no `industry` query) — { industries: [{name, count, sectorL1, sectorL2}] }
 *  - Companies for a specific industry (when `industry=...&limit=N`)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const limit = Math.min(parseInt(searchParams.get("limit") || "120", 10), 500);

  if (!industry) {
    if (_industriesCache && Date.now() - _industriesCache.at < INDUSTRIES_TTL_MS) {
      return Response.json({ industries: _industriesCache.rows, cached: true });
    }
    const rows = db().prepare(`
      SELECT primary_industry AS name,
             sector_l2,
             COUNT(*) AS count
      FROM companies
      WHERE primary_industry IS NOT NULL
      GROUP BY primary_industry, sector_l2
      ORDER BY count DESC
    `).all();
    _industriesCache = { rows, at: Date.now() };
    return Response.json({ industries: rows, cached: false });
  }

  const rows = db().prepare(`
    SELECT id, sp_id, name, ticker, website, primary_industry, status
    FROM companies
    WHERE primary_industry = ?
    ORDER BY (CASE WHEN ticker IS NOT NULL THEN 0 ELSE 1 END), name
    LIMIT ?
  `).all(industry, limit) as Partial<DbCompany>[];
  const total = (db().prepare("SELECT COUNT(*) AS c FROM companies WHERE primary_industry = ?").get(industry) as any).c;
  return Response.json({ companies: rows, total });
}
