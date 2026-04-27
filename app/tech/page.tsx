import Link from "next/link";
import { TECHNOLOGIES } from "@/lib/data/technologies";
import { SECTOR_BY_ID } from "@/lib/data/graph";

export default function TechIndex() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /TECH</div>
      <h1 className="mt-2 text-3xl font-semibold">Technology Primers</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-2xl">Deep dives into how each layer of the AI stack actually works — process steps, materials, market structure, and who builds what.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {TECHNOLOGIES.map(t => {
          const sec = t.domain !== "cross" ? SECTOR_BY_ID[t.domain] : null;
          return (
            <Link key={t.id} href={`/tech/${t.id}`}
                  className="group hairline bg-bg-1 hover:bg-bg-2 p-5 bracket transition">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: sec?.color || "#ff2a2a" }}>
                  ▸ {sec?.name.toUpperCase() || "CROSS-LAYER"}
                </div>
                {t.metrics && <div className="font-mono text-[10px] text-ink-mute">{t.metrics.length} METRICS</div>}
              </div>
              <h2 className="mt-2 text-lg font-semibold group-hover:text-accent transition-colors">{t.name}</h2>
              <p className="mt-2 text-xs text-ink-dim leading-relaxed">{t.oneLiner}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
