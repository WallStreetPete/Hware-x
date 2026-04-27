import GodsEyeGraph from "@/components/GodsEyeGraph";
import { COMPANIES, SECTORS, ALL_EDGES } from "@/lib/data/graph";
import { ASSETS } from "@/lib/data/geo";
import { db, productCounts, dbStats, curatedEnrichmentCount } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  const enrichedRows = db().prepare("SELECT curated_id FROM curated_enrichments").all() as { curated_id: string }[];
  const enrichedIds = enrichedRows.map(r => r.curated_id);
  const sp = dbStats();
  const productTotal = (productCounts() as any[]).reduce((a, b) => a + b.c, 0);
  const enrichedTotal = curatedEnrichmentCount() + COMPANIES.filter(c => !!c.longDesc).length;
  return (
    <div className="relative">
      {/* Hero strip */}
      <section className="hairline-b px-6 pt-6 pb-4">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-accent glow-text">// PRIMARY VIEW · /SYS/INFRA/MAP</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                The AI Infrastructure <span className="text-accent">God's-Eye</span>
              </h1>
              <p className="mt-1 text-sm text-ink-dim max-w-2xl">
                Every layer of picks-and-shovels powering AI — from quartz sand and EUV photons up through hyperscaler capex and frontier model training. Click any node to trace its supply chain.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
              <Stat label="CURATED" value={COMPANIES.length} />
              <Link href="/explore"><Stat label="S&P UNIVERSE" value={sp.total.toLocaleString()} clickable /></Link>
              <Link href="/map"><Stat label="GEO ASSETS" value={ASSETS.length} clickable /></Link>
              <Link href="/catalog/enriched"><Stat label="PRODUCTS" value={productTotal} clickable /></Link>
              <Link href="/agent"><Stat label="AI-ENRICHED" value={`${enrichedTotal}★`} clickable /></Link>
              <Stat label="LAYERS" value={7} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-[11px] font-mono">
            <Link href="/sectors" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition-colors">SECTOR INDEX →</Link>
            <Link href="/catalog" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition-colors">CATALOGS →</Link>
            <Link href="/tech" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition-colors">TECH PRIMERS →</Link>
            <Link href="/search" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition-colors">EXA DEEP SEARCH →</Link>
            <Link href="/chat" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition-colors">ASK CLAUDE →</Link>
          </div>
        </div>
      </section>

      <GodsEyeGraph enrichedIds={enrichedIds} />
    </div>
  );
}

function Stat({ label, value, clickable }: { label: string; value: number | string; clickable?: boolean }) {
  return (
    <div className={`text-right ${clickable ? "cursor-pointer hover:opacity-80 transition" : ""}`}>
      <div className="text-[9px] tracking-[0.3em] text-ink-mute">{label}</div>
      <div className="text-xl text-accent glow-text">{value}</div>
    </div>
  );
}
