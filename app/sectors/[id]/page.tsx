import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTOR_BY_ID, companiesBySector, SECTORS } from "@/lib/data/graph";
import { fmtUSD } from "@/lib/utils";
import { TECHNOLOGIES } from "@/lib/data/technologies";
import SectorEssay from "@/components/SectorEssay";
import RatingsPanel from "@/components/RatingsPanel";
import VideoGrid from "@/components/VideoGrid";
import { videosForSector } from "@/lib/data/videos";
import Logo from "@/components/Logo";
import { db, topSpByIndustries } from "@/lib/db";
import { SECTOR_TO_SP } from "@/lib/data/sector-sp-mapping";
import type { SectorId } from "@/lib/types";

export function generateStaticParams() {
  return SECTORS.map(s => ({ id: s.id }));
}

export default async function SectorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sec = SECTOR_BY_ID[id];
  if (!sec) return notFound();
  const cos = companiesBySector(id).sort((a, b) => (b.marketCapUSD || 0) - (a.marketCapUSD || 0));
  const techs = TECHNOLOGIES.filter(t => t.domain === id);
  const videos = videosForSector(id);
  const enrichedRows = db().prepare("SELECT curated_id FROM curated_enrichments").all() as { curated_id: string }[];
  const enrichedSet = new Set(enrichedRows.map(r => r.curated_id));
  // Build vendor → product-count map for the badge.
  const productRows = db().prepare("SELECT vendor_name, COUNT(*) AS c FROM db_products GROUP BY vendor_name").all() as { vendor_name: string; c: number }[];
  const productCount = new Map<string, number>();
  for (const r of productRows) productCount.set(r.vendor_name.toLowerCase(), r.c);
  // S&P "more from this sector" — top 100 by public-first then alphabetical, excluding curated duplicates.
  const spIndustries = SECTOR_TO_SP[sec.id as SectorId] || [];
  const curatedNames = new Set(cos.map(c => c.name.toLowerCase()));
  const moreFromSp = spIndustries.length > 0 ? topSpByIndustries(spIndustries, curatedNames, 100) : [];

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <Link href="/sectors" className="font-mono text-[10px] tracking-[0.3em] text-ink-mute hover:text-accent">← /SECTORS</Link>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: sec.color }}>▸ {sec.short.toUpperCase()}</div>
          <h1 className="mt-1 text-3xl font-semibold">{sec.name}</h1>
          <p className="mt-2 text-sm text-ink-dim max-w-3xl">{sec.desc}</p>
        </div>
        <div className="font-mono text-xs text-ink-mute">{cos.length} entities</div>
      </div>

      <div className="mt-8">
        <SectorEssay sectorId={sec.id} sectorName={sec.name} />
      </div>

      {videos.length > 0 && (
        <div className="mt-6">
          <VideoGrid videos={videos} label="VIDEOS · SECTOR DEEP-DIVES" />
        </div>
      )}

      {(sec.id === "hyperscalers" || sec.id === "neoclouds") && (
        <div className="mt-6">
          <RatingsPanel filter={sec.id as "hyperscalers" | "neoclouds"} />
        </div>
      )}

      {techs.length > 0 && (
        <section className="mt-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// RELATED TECH</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {techs.map(t => (
              <Link key={t.id} href={`/tech/${t.id}`} className="hairline bg-bg-1 p-4 hover:bg-bg-2 transition">
                <div className="text-sm font-semibold text-accent">{t.name}</div>
                <div className="text-xs text-ink-dim mt-1">{t.oneLiner}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// COMPANIES</div>
        <div className="hairline divide-y divide-line bg-bg-1">
          {cos.map(co => (
            <Link key={co.id} href={`/companies/${co.id}`}
                  className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-bg-2 transition group items-center">
              <div className="col-span-3 flex items-center gap-3">
                <Logo companyId={co.id} size={28} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold group-hover:text-accent truncate flex items-center gap-1.5">
                    {co.name}
                    {(enrichedSet.has(co.id) || !!co.longDesc) && (
                      <span title="AI-enriched profile" className="text-accent text-xs">★</span>
                    )}
                    {(() => {
                      const pc = productCount.get(co.name.toLowerCase()) || productCount.get((co.ticker || "").toLowerCase()) || 0;
                      if (pc === 0) return null;
                      return <span title={`${pc} products in catalog`} className="font-mono text-[9px] tracking-[0.1em] border border-accent/50 text-accent px-1 py-0.5 rounded-sm">{pc}P</span>;
                    })()}
                  </div>
                  <div className="font-mono text-[10px] text-ink-mute">{co.ticker || "private"} · {co.hq}</div>
                </div>
              </div>
              <div className="col-span-5 text-xs text-ink-dim">{co.blurb}</div>
              <div className="col-span-2 font-mono text-xs text-ink-dim">
                <div>cap: {fmtUSD(co.marketCapUSD)}</div>
                <div>rev: {fmtUSD(co.revenueUSD)}</div>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 border border-accent/40 text-accent">{co.tier.toUpperCase()}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {moreFromSp.length > 0 && (
        <section className="mt-10">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">
            // MORE FROM THIS SECTOR · TOP {moreFromSp.length} FROM S&P CAPIQ
            <span className="text-ink-mute ml-2">(public companies first, alphabetical fallback)</span>
          </div>
          <div className="hairline divide-y divide-line bg-bg-1 max-h-[600px] overflow-y-auto">
            {moreFromSp.map(r => (
              <Link key={r.id} href={`/explore/${r.sp_id}`}
                    className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-bg-2 transition group items-center">
                <div className="col-span-3 text-sm font-semibold group-hover:text-accent truncate">
                  {r.name}
                  {r.ticker && <span className="ml-2 font-mono text-[10px] text-accent">{r.ticker}</span>}
                </div>
                <div className="col-span-2 font-mono text-[10px] text-ink-mute truncate">{r.primary_industry}</div>
                <div className="col-span-6 text-xs text-ink-dim truncate">{r.description || "—"}</div>
                <div className="col-span-1 text-right">
                  {r.website && (
                    <span className="font-mono text-[10px] text-accent">↗</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
