import Link from "next/link";
import { SECTORS, LAYER_ORDER, LAYER_LABEL, COMPANIES } from "@/lib/data/graph";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SectorsIndex() {
  const enrichedRows = db().prepare("SELECT curated_id FROM curated_enrichments").all() as { curated_id: string }[];
  const enrichedSet = new Set(enrichedRows.map(r => r.curated_id));
  const sectorEnriched: Record<string, { total: number; enriched: number }> = {};
  for (const c of COMPANIES) {
    const e = sectorEnriched[c.sector] = sectorEnriched[c.sector] || { total: 0, enriched: 0 };
    e.total += 1;
    if (enrichedSet.has(c.id) || !!c.longDesc) e.enriched += 1;
  }
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /SECTORS</div>
      <h1 className="mt-2 text-3xl font-semibold">Sector Index</h1>
      <p className="mt-1 text-sm text-ink-dim">All {SECTORS.length} sectors organized into {LAYER_ORDER.length} stacked layers of the AI infrastructure stack.</p>

      <div className="mt-10 space-y-12">
        {LAYER_ORDER.map(layer => {
          const inLayer = SECTORS.filter(s => s.layer === layer);
          return (
            <section key={layer}>
              <div className="flex items-center gap-3 mb-4">
                <div className="font-mono text-xs tracking-[0.3em] text-accent">{LAYER_LABEL[layer].toUpperCase()}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {inLayer.map(s => {
                  const e = sectorEnriched[s.id] || { total: 0, enriched: 0 };
                  const pct = e.total > 0 ? Math.round((e.enriched / e.total) * 100) : 0;
                  return (
                    <Link key={s.id} href={`/sectors/${s.id}`}
                          className="group hairline bg-bg-1 hover:bg-bg-2 p-4 bracket transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono text-[10px] tracking-[0.2em]" style={{ color: s.color }}>▸ {s.short.toUpperCase()}</div>
                          <div className="mt-1 text-base font-semibold group-hover:text-accent transition-colors">{s.name}</div>
                        </div>
                        <div className="text-right font-mono text-[10px] text-ink-mute">
                          <div>{e.total} CO</div>
                          <div className={pct > 0 ? "text-accent" : "text-ink-mute"}>{e.enriched}★ ({pct}%)</div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-ink-dim leading-relaxed">{s.desc}</p>
                      {e.total > 0 && (
                        <div className="mt-2 h-1 bg-bg-3 overflow-hidden">
                          <div className="h-full bg-accent shadow-glow-sm" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
