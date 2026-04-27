"use client";
import Link from "next/link";
import { COMPUTE_RATINGS } from "@/lib/data/ratings";
import { COMPANY_BY_ID } from "@/lib/data/graph";

function Bar({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="font-mono text-[9px] tracking-[0.15em] text-ink-mute w-20">{label}</div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}
                className={`h-2 w-3 ${i < v ? "bg-accent shadow-glow-sm" : "bg-bg-3"}`} />
        ))}
      </div>
      <div className="font-mono text-[10px] text-accent">{v.toFixed(1)}</div>
    </div>
  );
}

export default function RatingsPanel({ filter }: { filter: "hyperscalers" | "neoclouds" | "all" }) {
  const rows = COMPUTE_RATINGS.filter(r => {
    const co = COMPANY_BY_ID[r.companyId];
    if (!co) return false;
    if (filter === "all") return true;
    return co.sector === filter;
  });

  return (
    <div className="hairline bg-bg-1 bracket">
      <div className="px-4 py-3 hairline-b flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// COMPUTE PROVIDER RATINGS · CLUSTERMAX-STYLE</div>
        <div className="font-mono text-[9px] text-ink-mute">2026-Q1 · curated</div>
      </div>
      <div className="divide-y divide-line">
        {rows.map(r => {
          const co = COMPANY_BY_ID[r.companyId];
          if (!co) return null;
          return (
            <div key={r.companyId} className="grid grid-cols-12 gap-4 px-4 py-4">
              <div className="col-span-3">
                <Link href={`/companies/${co.id}`} className="text-sm font-semibold hover:text-accent">{co.name}</Link>
                <div className="font-mono text-[10px] text-ink-mute">{co.ticker || "private"}</div>
                <div className="mt-2 font-mono text-[10px] text-accent">{r.gpuFleet}</div>
                <div className="font-mono text-[10px] text-ink-mute">{r.capacity}</div>
              </div>
              <div className="col-span-4 space-y-1">
                <Bar v={r.reliability} label="RELIABILITY" />
                <Bar v={r.perfPerDollar} label="PERF / $" />
                <Bar v={r.software} label="SOFTWARE" />
                <Bar v={r.scale} label="SCALE" />
              </div>
              <div className="col-span-5 text-xs text-ink-dim leading-relaxed">{r.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
