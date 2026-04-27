import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY_BY_ID, COMPANIES, neighborsOf, SECTOR_BY_ID } from "@/lib/data/graph";
import { fmtUSD } from "@/lib/utils";
import CompanyAIBrief from "@/components/CompanyAIBrief";
import Logo from "@/components/Logo";
import { DOMAINS } from "@/lib/data/domains";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { COMPANY_BY_ID as COMP_MAP } from "@/lib/data/graph";
import { ASSETS } from "@/lib/data/geo";
import { MapPin } from "lucide-react";

export function generateStaticParams() {
  return COMPANIES.map(c => ({ id: c.id }));
}

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const co = COMPANY_BY_ID[id];
  if (!co) return notFound();
  const sec = SECTOR_BY_ID[co.sector];
  const { upstream, downstream } = neighborsOf(co.id);
  const competitors = (co.competitors || []).map(cid => COMPANY_BY_ID[cid]).filter(Boolean);
  const enrichedRows = db().prepare("SELECT curated_id FROM curated_enrichments").all() as { curated_id: string }[];
  const enrichedSet = new Set(enrichedRows.map(r => r.curated_id));
  const isEnriched = (id: string) => enrichedSet.has(id) || !!COMP_MAP[id]?.longDesc;
  const facilities = ASSETS.filter(a => a.operatorId === co.id);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink-mute">
        <Link href="/" className="hover:text-accent">/</Link>
        <span>›</span>
        <Link href={`/sectors/${sec?.id}`} className="hover:text-accent">{sec?.name.toUpperCase()}</Link>
      </div>

      {/* Header */}
      <header className="mt-3 hairline bracket bg-bg-1 p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Logo companyId={co.id} size={56} className="mt-2" />
            <div>
            <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: sec?.color }}>{sec?.name.toUpperCase()}</div>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight">{co.name}</h1>
            <div className="mt-1 font-mono text-xs text-ink-mute">
              {co.ticker || "private"} · {co.hq}{co.founded ? ` · est. ${co.founded}` : ""}
            </div>
            <p className="mt-3 max-w-2xl text-sm text-ink-dim leading-relaxed">{co.blurb}</p>
            {DOMAINS[co.id] && (
              <a href={`https://${DOMAINS[co.id]}`} target="_blank" rel="noreferrer"
                 className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                {DOMAINS[co.id]} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          </div>
          <div className="flex gap-6 font-mono text-sm">
            <Metric label="MARKET CAP" value={fmtUSD(co.marketCapUSD)} />
            <Metric label="REVENUE" value={fmtUSD(co.revenueUSD)} />
            <Metric label="TIER" value={co.tier.toUpperCase()} />
          </div>
        </div>
      </header>

      {/* Long desc */}
      {co.longDesc && (
        <section className="mt-6 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">// PROFILE</div>
          <p className="text-sm text-ink leading-relaxed">{co.longDesc}</p>
        </section>
      )}

      {/* AI live brief */}
      <CompanyAIBrief companyId={co.id} companyName={co.name} sectorName={sec?.name || ""} />

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="PRODUCTS / OFFERINGS">
          <ul className="space-y-1.5 text-sm">
            {co.products.map(p => (
              <li key={p} className="flex items-start gap-2">
                <span className="text-accent mt-1.5">▸</span>
                <span className="text-ink-dim">{p}</span>
              </li>
            ))}
          </ul>
        </Card>
        {co.moat && (
          <Card title="MOAT">
            <p className="text-sm text-ink-dim leading-relaxed">{co.moat}</p>
          </Card>
        )}
        {co.risk && (
          <Card title="RISK FACTORS">
            <p className="text-sm text-ink-dim leading-relaxed">{co.risk}</p>
          </Card>
        )}
      </div>

      {/* Supply chain */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title={`UPSTREAM · BUYS FROM (${upstream.length})`}>
          <NodeList items={upstream.map(c => ({ id: c.id, name: c.name, sub: SECTOR_BY_ID[c.sector]?.name }))} isEnriched={isEnriched} />
        </Card>
        <Card title={`DOWNSTREAM · SELLS TO (${downstream.length})`}>
          <NodeList items={downstream.map(c => ({ id: c.id, name: c.name, sub: SECTOR_BY_ID[c.sector]?.name }))} isEnriched={isEnriched} />
        </Card>
      </section>

      {facilities.length > 0 && (
        <section className="mt-6">
          <Card title={`FACILITIES · ${facilities.length} GEO-MAPPED`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {facilities.map(f => (
                <Link key={f.id} href="/map" className="hairline bg-bg-2 hover:bg-bg-3 px-3 py-2 transition group">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ink truncate group-hover:text-accent">{f.name}</div>
                      <div className="font-mono text-[10px] text-ink-mute">
                        {f.city ? `${f.city}, ` : ""}{f.country || "—"}
                        {f.capacity && ` · ${f.capacity}`}
                      </div>
                      {f.status && (
                        <div className="font-mono text-[9px] text-ink-mute mt-0.5">
                          {f.status === "operating" ? "● operating" : f.status === "under-construction" ? "◌ building" : "◇ " + f.status}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </section>
      )}

      {competitors.length > 0 && (
        <section className="mt-6">
          <Card title="DIRECT COMPETITORS">
            <NodeList items={competitors.map(c => ({ id: c.id, name: c.name, sub: SECTOR_BY_ID[c.sector]?.name }))} isEnriched={isEnriched} />
          </Card>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[9px] tracking-[0.3em] text-ink-mute">{label}</div>
      <div className="text-lg text-accent glow-text">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="hairline bg-bg-1 p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// {title}</div>
      {children}
    </div>
  );
}

function NodeList({ items, isEnriched }: { items: { id: string; name: string; sub?: string }[]; isEnriched?: (id: string) => boolean }) {
  if (items.length === 0) return <div className="text-xs text-ink-mute italic">no entries</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {items.map(i => (
        <Link key={i.id} href={`/companies/${i.id}`}
              className="group flex items-center justify-between hairline px-2.5 py-1.5 hover:bg-accent hover:text-bg transition-colors">
          <span className="text-xs flex items-center gap-1">
            {i.name}
            {isEnriched?.(i.id) && <span title="AI-enriched profile" className="text-accent group-hover:text-bg text-[10px]">★</span>}
          </span>
          <span className="font-mono text-[9px] text-ink-mute group-hover:text-bg">{i.sub}</span>
        </Link>
      ))}
    </div>
  );
}
