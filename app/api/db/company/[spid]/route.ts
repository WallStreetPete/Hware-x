import { getCompanyBySpId } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ spid: string }> }) {
  const { spid } = await params;
  const co = getCompanyBySpId(spid);
  if (!co) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json(co);
}
