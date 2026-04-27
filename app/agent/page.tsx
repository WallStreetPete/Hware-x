import fs from "node:fs";
import path from "node:path";
import { db, productCounts, curatedEnrichmentCount } from "@/lib/db";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/data/companies";
import { Activity, DollarSign, Database, FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AgentPage() {
  const runs = (db().prepare(
    "SELECT id, started_at, finished_at, action, result, exa_calls, fc_calls, claude_calls FROM agent_runs ORDER BY id DESC LIMIT 100"
  ).all()) as any[];
  // Per-action roll-up across all runs (so user sees which categories the loop has fired most)
  const actionRollup = (db().prepare(
    "SELECT action, COUNT(*) AS c, SUM(exa_calls) AS exa, SUM(claude_calls) AS claude FROM agent_runs GROUP BY action ORDER BY c DESC LIMIT 16"
  ).all()) as any[];
  const totals = (db().prepare(
    "SELECT COUNT(*) AS runs, SUM(exa_calls) AS exa, SUM(fc_calls) AS fc, SUM(claude_calls) AS claude FROM agent_runs"
  ).get()) as any;
  const counts = productCounts() as any[];
  const totalProducts = counts.reduce((a, b) => a + b.c, 0);
  const enrichedCurated = curatedEnrichmentCount();
  const totalCurated = COMPANIES.length;
  const enrichmentPct = ((enrichedCurated / totalCurated) * 100).toFixed(1);
  const recentEnrichments = (db().prepare(
    "SELECT curated_id, updated_at FROM curated_enrichments ORDER BY updated_at DESC LIMIT 8"
  ).all()) as any[];

  let state: any = {};
  try { state = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "agent-state.json"), "utf8")); } catch {}

  // Estimate spend: $0.005 per Exa, $0.002 per Firecrawl, ~$0.015 per Claude call (sonnet-4.5 with ~2000 tokens)
  const spendUsd = (totals.exa || 0) * 0.005 + (totals.fc || 0) * 0.002 + (totals.claude || 0) * 0.015;
  const estSpend = spendUsd.toFixed(3);
  const insightUnits = totalProducts + enrichedCurated;
  const costPerInsight = insightUnits > 0 ? (spendUsd / insightUnits).toFixed(4) : "0";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /AGENT · LOOP DIAGNOSTICS</div>
      <h1 className="mt-2 text-3xl font-semibold">Autonomous Agent</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        The gap-finder loop runs every 15 minutes — reading <code className="font-mono text-accent">AGENT.md</code>, smoke-testing every route, then enriching one product category via Exa + Claude. Stays under per-iteration budget caps.
      </p>

      {/* Topline stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat icon={Activity} label="ITERATIONS" value={totals.runs ?? 0} />
        <Stat icon={Database} label="ENRICHED PRODUCTS" value={totalProducts} />
        <Stat icon={Sparkles} label="ENRICHED CURATED" value={`${enrichedCurated} / ${totalCurated}`} />
        <Stat icon={DollarSign} label="EST SPEND (USD)" value={`$${estSpend}`} />
        <Stat icon={DollarSign} label="$ / INSIGHT" value={`$${costPerInsight}`} />
        <Stat icon={FileText} label="AI CALLS" value={(totals.exa || 0) + (totals.claude || 0)} />
      </div>

      {/* Curated enrichment progress */}
      <section className="mt-6 hairline bg-bg-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// CURATED COMPANY ENRICHMENT · {enrichmentPct}% COVERAGE</div>
          <div className="font-mono text-[10px] text-ink-mute">{enrichedCurated} of {totalCurated}</div>
        </div>
        <div className="h-2 bg-bg-3 overflow-hidden">
          <div className="h-full bg-accent shadow-glow-sm transition-all" style={{ width: `${enrichmentPct}%` }} />
        </div>
        {recentEnrichments.length > 0 && (
          <div className="mt-3">
            <div className="font-mono text-[9px] text-ink-mute mb-1.5">RECENT</div>
            <div className="flex flex-wrap gap-1.5">
              {recentEnrichments.map((e: any) => {
                const co = COMPANY_BY_ID[e.curated_id];
                return (
                  <a key={e.curated_id} href={`/companies/${e.curated_id}`}
                     title={e.updated_at}
                     className="hairline bg-bg-2 hover:bg-accent hover:text-bg px-2 py-1 text-[11px] transition">
                    {co?.name || e.curated_id}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Per-category */}
      <section className="mt-6 hairline bg-bg-1 p-5">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// ENRICHED PRODUCT BREAKDOWN</div>
        {counts.length === 0 ? (
          <div className="text-sm text-ink-mute">no enriched products yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {counts.map(c => (
              <a key={c.category} href={`/catalog/enriched?category=${c.category}`}
                 className="hairline bg-bg-2 hover:bg-bg-3 p-3 text-center transition">
                <div className="text-2xl text-accent glow-text">{c.c}</div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-ink-mute mt-1">{c.category.toUpperCase()}</div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* State + cursor */}
      {state.cursor && (
        <section className="mt-6 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// CURSOR · NEXT ITERATION</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div><span className="text-ink-mute">phase:</span> <span className="text-ink">{state.cursor.phase}</span></div>
            <div><span className="text-ink-mute">iteration #:</span> <span className="text-ink">{state.iterationCount}</span></div>
            <div><span className="text-ink-mute">last run:</span> <span className="text-ink">{state.lastIteration?.slice(0, 19) || "—"}</span></div>
            <div><span className="text-ink-mute">next category:</span> <span className="text-accent">{state.cursor.categoryQueue?.[(state.cursor.categoryIndex ?? 0) % (state.cursor.categoryQueue?.length || 1)]}</span></div>
          </div>
          <div className="mt-3 font-mono text-[10px] text-ink-mute">queue: {state.cursor.categoryQueue?.join(" · ")}</div>
        </section>
      )}

      {/* Per-action roll-up */}
      <section className="mt-6 hairline bg-bg-1 p-4">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// ACTIONS BY FREQUENCY</div>
        <div className="flex flex-wrap gap-2">
          {actionRollup.map((a: any) => {
            const parts = (a.action || "").split(":");
            const isCurated = parts[1] === "curated";
            const label = isCurated ? "curated" : (parts[1] || "—");
            return (
              <div key={a.action} className={`hairline px-2 py-1 font-mono text-[10px] flex items-center gap-2 ${isCurated ? "border border-accent" : "bg-bg-2"}`}>
                <span className={isCurated ? "text-accent" : "text-ink"}>{label}</span>
                <span className="text-ink-mute">×{a.c}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent runs */}
      <section className="mt-6 hairline bg-bg-1">
        <div className="px-5 py-3 hairline-b">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// RECENT RUNS · LAST 100</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-bg-2">
              <tr className="hairline-b">
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">#</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">AGE</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">ACTION</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">RESULT</th>
                <th className="px-3 py-2 text-right font-mono text-[10px] tracking-[0.2em] text-ink-mute">EXA</th>
                <th className="px-3 py-2 text-right font-mono text-[10px] tracking-[0.2em] text-ink-mute">FC</th>
                <th className="px-3 py-2 text-right font-mono text-[10px] tracking-[0.2em] text-ink-mute">CLAUDE</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-ink-mute font-mono">no runs yet</td></tr>
              )}
              {(() => { const _now = Date.now(); return null; })()}
              {runs.map(r => {
                const ok = !/ERROR|BUDGET STOP/i.test(r.result || "");
                // Parse action like "enrich:cpu" or "enrich:curated:freeport"
                const parts = (r.action || "").split(":");
                const isCurated = parts[1] === "curated";
                const tag = isCurated ? "CURATED" : (parts[1] || "—").toUpperCase();
                const entityId = isCurated ? parts[2] : null;
                const co = entityId ? COMPANY_BY_ID[entityId] : null;
                // Relative time
                const t = r.finished_at ? new Date(r.finished_at + "Z").getTime() : null;
                const diff = t ? Math.max(0, Date.now() - t) : null;
                let rel = "—";
                if (diff != null) {
                  if (diff < 60_000) rel = `${Math.round(diff/1000)}s ago`;
                  else if (diff < 3600_000) rel = `${Math.round(diff/60_000)}m ago`;
                  else if (diff < 86400_000) rel = `${Math.round(diff/3600_000)}h ago`;
                  else rel = `${Math.round(diff/86400_000)}d ago`;
                }
                return (
                  <tr key={r.id} className="hairline-b hover:bg-bg-2 transition">
                    <td className="px-3 py-2 font-mono text-[10px] text-ink-mute">{r.id}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-ink-mute" title={r.finished_at}>{rel}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block font-mono text-[9px] tracking-[0.15em] px-1.5 py-0.5 ${
                        isCurated ? "border border-accent text-accent" : "bg-bg-2 text-ink-dim"
                      }`}>{tag}</span>
                      {co && (
                        <a href={`/companies/${co.id}`} className="ml-2 text-[11px] hover:text-accent">{co.name}</a>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span className={ok ? "text-ink" : "text-accent"}>{r.result}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-ink-mute">{r.exa_calls}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-ink-mute">{r.fc_calls}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-ink-mute">{r.claude_calls}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="hairline bg-bg-1 p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-accent" />
        <div className="font-mono text-[10px] tracking-[0.3em] text-ink-mute">{label}</div>
      </div>
      <div className="mt-2 text-2xl text-accent glow-text">{value}</div>
    </div>
  );
}
