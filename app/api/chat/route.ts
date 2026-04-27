import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import { COMPANIES, SECTORS } from "@/lib/data/graph";
import { TECHNOLOGIES } from "@/lib/data/technologies";

export const runtime = "nodejs";
export const maxDuration = 60;

// Build a compact knowledge brief from internal data so Claude grounds answers in the curated dataset.
function buildKnowledgeBrief(): string {
  const sectorLines = SECTORS.map(s => `- ${s.name} (${s.layer}): ${s.short}`).join("\n");
  const companyLines = COMPANIES.map(c => `- ${c.name}${c.ticker ? ` [${c.ticker}]` : ""} · ${c.sector} · ${c.tier}: ${c.blurb}`).join("\n");
  const techLines = TECHNOLOGIES.map(t => `- ${t.name}: ${t.oneLiner}`).join("\n");

  return `# HWARE-X CURATED KNOWLEDGE BASE

## Sectors (${SECTORS.length})
${sectorLines}

## Companies (${COMPANIES.length})
${companyLines}

## Technology primers (${TECHNOLOGIES.length})
${techLines}
`;
}

const KB = buildKnowledgeBrief();

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: anthropic(process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5"),
    system: `You are HWARE-X, an AI infrastructure analyst. You explain the picks-and-shovels of AI: semis, fabs, HBM, packaging, fiber, optics, cooling, power, hyperscalers, neoclouds, and frontier labs.

TONE: Concise, analytical, slightly Stratechery/SemiAnalysis-flavored. Use tight prose. Prefer specific company names, technology names, and numbers where possible. No hedging fluff. One short paragraph per idea.

KNOWLEDGE: First lean on the curated dataset below. If something isn't covered, you may use general knowledge — just be clear when you're inferring vs citing curated data.

When useful, end an answer with 2–3 suggested follow-ups in the form: \`▸ next: <question>\`.

${KB}`,
    messages,
    maxTokens: 2000,
  });

  return result.toDataStreamResponse();
}
