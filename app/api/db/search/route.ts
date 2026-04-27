import { searchCompanies } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const industry = searchParams.get("industry") || undefined;
  const status = searchParams.get("status") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 500);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    const out = searchCompanies({ q, industry, status, limit, offset });
    return Response.json(out);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
