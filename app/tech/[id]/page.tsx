import Link from "next/link";
import { notFound } from "next/navigation";
import { TECHNOLOGIES, TECH_BY_ID } from "@/lib/data/technologies";
import { COMPANY_BY_ID, SECTOR_BY_ID } from "@/lib/data/graph";
import VideoGrid from "@/components/VideoGrid";
import { videosForTech } from "@/lib/data/videos";
import Logo from "@/components/Logo";

export function generateStaticParams() {
  return TECHNOLOGIES.map(t => ({ id: t.id }));
}

export default async function TechPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = TECH_BY_ID[id];
  if (!t) return notFound();
  const sec = t.domain !== "cross" ? SECTOR_BY_ID[t.domain] : null;
  const videos = videosForTech(t.id);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <Link href="/tech" className="font-mono text-[10px] tracking-[0.3em] text-ink-mute hover:text-accent">← /TECH</Link>

      <header className="mt-3">
        <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: sec?.color || "#ff2a2a" }}>
          ▸ {sec?.name.toUpperCase() || "CROSS-LAYER"}
        </div>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">{t.name}</h1>
        <p className="mt-2 text-base text-accent/90 font-medium italic">{t.oneLiner}</p>
      </header>

      <section className="mt-8 hairline bg-bg-1 p-5 bracket">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">// WHAT IS IT</div>
        <p className="text-sm text-ink leading-relaxed">{t.whatIsIt}</p>
      </section>

      {t.howItsMade && (
        <section className="mt-6 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// PROCESS · HOW IT'S MADE</div>
          <ol className="space-y-2">
            {t.howItsMade.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-[11px] text-accent w-6 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink-dim leading-relaxed">{s.replace(/^\d+\.\s*/, "")}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.keyMaterials && (
          <section className="hairline bg-bg-1 p-5">
            <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// KEY MATERIALS</div>
            <ul className="space-y-1.5 text-sm">
              {t.keyMaterials.map(m => (
                <li key={m} className="flex items-start gap-2"><span className="text-accent mt-1.5">▸</span><span className="text-ink-dim">{m}</span></li>
              ))}
            </ul>
          </section>
        )}
        {t.variants && (
          <section className="hairline bg-bg-1 p-5">
            <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// VARIANTS</div>
            <ul className="space-y-2 text-sm">
              {t.variants.map(v => (
                <li key={v.name} className="border-l-2 border-accent/40 pl-3">
                  <div className="font-semibold text-ink">{v.name}</div>
                  <div className="text-xs text-ink-dim mt-0.5">{v.note}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {t.metrics && (
        <section className="mt-6 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// METRICS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.metrics.map(m => (
              <div key={m.label}>
                <div className="font-mono text-[9px] tracking-[0.2em] text-ink-mute">{m.label.toUpperCase()}</div>
                <div className="mt-1 text-lg text-accent glow-text">{m.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {t.marketSnapshot && (
        <section className="mt-6 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">// MARKET SNAPSHOT</div>
          <p className="text-sm text-ink-dim leading-relaxed">{t.marketSnapshot}</p>
        </section>
      )}

      {t.topPlayers && t.topPlayers.length > 0 && (
        <section className="mt-6">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// KEY PLAYERS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {t.topPlayers.map(pid => {
              const co = COMPANY_BY_ID[pid];
              if (!co) return null;
              return (
                <Link key={pid} href={`/companies/${pid}`}
                      className="flex items-center gap-2 hairline bg-bg-1 px-3 py-2 hover:bg-bg-2 transition group">
                  <Logo companyId={pid} size={20} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate group-hover:text-accent">{co.name}</div>
                    <div className="font-mono text-[10px] text-ink-mute">{co.ticker || "private"}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <div className="mt-6">
          <VideoGrid videos={videos} label="VIDEOS · DEEP DIVES" />
        </div>
      )}
    </div>
  );
}
