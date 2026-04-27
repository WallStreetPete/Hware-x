import Exa from "exa-js";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { query, mode = "search" } = await req.json();
  if (!query || typeof query !== "string") {
    return Response.json({ error: "missing query" }, { status: 400 });
  }
  const exa = new Exa(process.env.EXA_API_KEY!);

  try {
    if (mode === "answer") {
      const res = await exa.answer(query, { text: true });
      return Response.json(res);
    }
    const res = await exa.searchAndContents(query, {
      type: "auto",
      numResults: 8,
      text: { maxCharacters: 1500 },
      summary: { query: "what does this say about AI infrastructure, semiconductors, data centers, or compute supply chain?" },
    });
    return Response.json(res);
  } catch (err: any) {
    return Response.json({ error: err?.message || "exa error" }, { status: 500 });
  }
}
