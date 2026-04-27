import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { COMPANIES, COMPANY_BY_ID, SECTOR_BY_ID, neighborsOf } from "@/lib/data/graph";
import { SECTORS } from "@/lib/data/sectors";
import { getCuratedEnrichment, upsertCuratedEnrichment } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { kind, id } = await req.json() as { kind: "company" | "sector"; id: string };

  // For company briefs, return cached if we have it.
  if (kind === "company") {
    const e = getCuratedEnrichment(id);
    if (e?.brief) return Response.json({ text: e.brief, cached: true });
  }

  let prompt = "";
  if (kind === "company") {
    const c = COMPANY_BY_ID[id];
    if (!c) return Response.json({ error: "unknown company" }, { status: 404 });
    const sec = SECTOR_BY_ID[c.sector];
    const { upstream, downstream } = neighborsOf(c.id);
    prompt = `Write a 3-paragraph Stratechery/SemiAnalysis-style brief on ${c.name} as an AI infrastructure investment.

Context (curated):
- Sector: ${sec?.name} (${sec?.layer})
- Tier: ${c.tier}
- HQ: ${c.hq}
- Blurb: ${c.blurb}
${c.longDesc ? `- Long: ${c.longDesc}` : ""}
- Products: ${c.products.join(", ")}
- Upstream suppliers: ${upstream.map(u => u.name).join(", ") || "—"}
- Downstream customers: ${downstream.map(d => d.name).join(", ") || "—"}
${c.moat ? `- Moat: ${c.moat}` : ""}
${c.risk ? `- Risk: ${c.risk}` : ""}

Structure:
P1: What they actually do in the AI stack (specific, no generalities).
P2: Where they sit in the supply chain — who they need, who needs them.
P3: The bull/bear case in two sentences each.

Tone: Sharp, analytical, opinionated where warranted. ~200 words total. No headers, no bullet points, just clean prose.`;
  } else if (kind === "sector") {
    const s = SECTORS.find(x => x.id === id);
    if (!s) return Response.json({ error: "unknown sector" }, { status: 404 });
    const sectorCos = COMPANIES.filter(c => c.sector === s.id);
    prompt = `Write a 3-paragraph Stratechery-style essay on the ${s.name} layer of AI infrastructure.

Context:
- Layer: ${s.layer}
- Description: ${s.desc}
- Companies in this layer: ${sectorCos.map(c => c.name).join(", ")}

Structure:
P1: Why this layer matters in the AI buildout (the strategic stakes).
P2: How power is distributed — who has leverage, who's commoditized.
P3: The 12-month outlook — what to watch, what could re-rate.

Tone: Sharp, analytical, no fluff. ~250 words total. Pure prose, no headers or bullets.`;
  } else {
    return Response.json({ error: "bad kind" }, { status: 400 });
  }

  const { text } = await generateText({
    model: anthropic(process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5"),
    prompt,
    maxTokens: 700,
  });

  // Persist company briefs so subsequent loads don't re-pay for them.
  if (kind === "company") {
    try { upsertCuratedEnrichment({ curated_id: id, brief: text }); } catch {}
  }

  return Response.json({ text, cached: false });
}
