import { getCuratedEnrichment } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getCuratedEnrichment(id);
  if (!e) return Response.json({ enrichment: null });
  return Response.json({ enrichment: e });
}
