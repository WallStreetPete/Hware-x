export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url) return Response.json({ error: "missing url" }, { status: 400 });
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return Response.json({ error: "FIRECRAWL_API_KEY not set" }, { status: 500 });

  const r = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  const data = await r.json();
  return Response.json(data);
}
