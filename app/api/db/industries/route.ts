import { listIndustries } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Module-level cache (companies table only mutates on ingest, which restarts the server).
let _cache: { rows: any[]; at: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1h

export async function GET() {
  if (_cache && Date.now() - _cache.at < TTL_MS) {
    return Response.json({ industries: _cache.rows, cached: true });
  }
  const rows = listIndustries();
  _cache = { rows, at: Date.now() };
  return Response.json({ industries: rows, cached: false });
}
