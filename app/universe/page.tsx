import UniverseGraph from "@/components/UniverseGraph";
import { dbStats } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function UniversePage() {
  const stats = dbStats();
  return (
    <div className="relative">
      <section className="hairline-b px-6 pt-6 pb-4">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-accent glow-text">// UNIVERSE · INDUSTRY-CLUSTER VIEW</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                The <span className="text-accent">Full S&P Universe</span>
              </h1>
              <p className="mt-1 text-sm text-ink-dim max-w-2xl">
                {stats.total.toLocaleString()} companies grouped by primary industry. Click an industry to expand into its companies; click a company for the sidebar.
              </p>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <Stat label="ENTITIES" value={stats.total.toLocaleString()} />
              <Stat label="SOURCE" value="S&P CapIQ" />
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-[11px] font-mono">
            <Link href="/" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition">← CURATED VIEW</Link>
            <Link href="/explore" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition">FULL TABLE →</Link>
          </div>
        </div>
      </section>
      <UniverseGraph />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-right">
      <div className="text-[9px] tracking-[0.3em] text-ink-mute">{label}</div>
      <div className="text-xl text-accent glow-text">{value}</div>
    </div>
  );
}
