import Link from "next/link";
import { financialsCoverage } from "@/lib/db";
import TopMarketCapGraph from "@/components/TopMarketCapGraph";

export const dynamic = "force-dynamic";

type Mode = "global" | "us-public" | "us-all";

export default async function TopPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const mode: Mode = sp.mode === "us-all" ? "us-all" : sp.us === "1" ? "us-public" : "global";
  const cov = financialsCoverage();

  const heading = mode === "us-all"
    ? { tag: "// /TOP · US ALL · PUBLIC + PRIVATE", h1: "Top US Companies (Public + Private)", limit: 2000, blurb: "Every U.S. semiconductor and hardware company in the S&P CapIQ universe with any sizing data — public market cap or private revenue. Ranked by market cap, falling back to revenue × 3 for unlisted names. Private companies show their revenue instead." }
    : mode === "us-public"
    ? { tag: "// /TOP · 1000 US PUBLIC BY MARKET CAP", h1: "Top US Public Companies by Market Cap", limit: 1000, blurb: "Every U.S.-listed name across semis, components, fab equipment, communications, hardware, EMS, and tech distribution. Grouped by industry. Click any node for the full sidebar." }
    : { tag: "// /TOP · 1000 GLOBAL BY MARKET CAP", h1: "Top 1,000 Global Companies by Market Cap", limit: 1000, blurb: "Every public name across semis, components, fab equipment, communications, hardware, EMS, and tech distribution. Grouped by industry. Click any node for the full sidebar." };

  return (
    <div className="relative">
      <section className="hairline-b px-6 pt-6 pb-4">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-accent glow-text">{heading.tag}</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {heading.h1.split(" ").slice(0, 2).join(" ")}{" "}
                <span className="text-accent">{heading.h1.split(" ").slice(2).join(" ")}</span>
              </h1>
              <p className="mt-1 text-sm text-ink-dim max-w-2xl">{heading.blurb}</p>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <Stat label="WITH MCAP" value={cov.with_marketcap.toLocaleString()} />
              <Stat label="WITH REVENUE" value={cov.with_revenue.toLocaleString()} />
              <Stat label="TOTAL S&P" value={cov.total.toLocaleString()} />
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-[11px] font-mono">
            <Link href="/" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition">← CURATED GOD'S-EYE</Link>
            <Link href="/top" className={`hairline px-3 py-1 ${mode === "global" ? "bg-accent text-bg" : "hover:bg-bg-2"}`}>GLOBAL</Link>
            <Link href="/top?us=1" className={`hairline px-3 py-1 ${mode === "us-public" ? "bg-accent text-bg" : "hover:bg-bg-2"}`}>US PUBLIC</Link>
            <Link href="/top?mode=us-all" className={`hairline px-3 py-1 ${mode === "us-all" ? "bg-accent text-bg" : "hover:bg-bg-2"}`}>US ALL (PUB + PRIV)</Link>
            <Link href="/universe" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition">UNIVERSE (54K) →</Link>
          </div>
        </div>
      </section>

      <TopMarketCapGraph mode={mode} limit={heading.limit} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[9px] tracking-[0.3em] text-ink-mute">{label}</div>
      <div className="text-xl text-accent glow-text">{value}</div>
    </div>
  );
}
