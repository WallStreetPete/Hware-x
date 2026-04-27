import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  if (category) {
    const rows = db().prepare("SELECT * FROM db_products WHERE category = ? ORDER BY vendor_name, name").all(category);
    return Response.json({ category, rows });
  }
  const cats = db().prepare("SELECT category, COUNT(*) AS c FROM db_products GROUP BY category ORDER BY c DESC").all();
  return Response.json({ categories: cats });
}
