import { topByMarketCap, topUSAll } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "1000", 10), 5000);
  const mode = searchParams.get("mode") || ""; // "us-all" includes private US
  const usOnly = searchParams.get("us") === "1";

  let rows;
  if (mode === "us-all") {
    rows = topUSAll({ limit });
  } else {
    rows = topByMarketCap({ limit, usOnly });
  }
  return Response.json({ rows });
}
