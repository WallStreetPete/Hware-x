"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { COMPANY_BY_ID, SECTOR_BY_ID, neighborsOf } from "@/lib/data/graph";
import { DOMAINS } from "@/lib/data/domains";
import Logo from "./Logo";
import { X, ExternalLink, Sparkles, Loader2, GripVertical } from "lucide-react";
import { fmtUSD } from "@/lib/utils";

type SidebarTarget =
  | { kind: "curated"; id: string }
  | { kind: "sp";      spId: string }
  | null;

type SpRow = {
  id: number;
  sp_id: string | null;
  name: string;
  ticker: string | null;
  website: string | null;
  status: string | null;
  industry: string | null;
  primary_industry: string | null;
  sector_l1: string | null;
  sector_l2: string | null;
  description: string | null;
  country: string | null;
  geography: string | null;
  address: string | null;
  market_cap_usd: number | null;
  revenue_usd: number | null;
  ebitda_usd: number | null;
  ebitda_margin: number | null;
};

function fmtMcapBig(m: number | null): string {
  if (m == null) return "—";
  if (m >= 1_000_000) return `$${(m/1_000_000).toFixed(2)}T`;
  if (m >= 1000) return `$${(m/1000).toFixed(2)}B`;
  return `$${m.toFixed(0)}M`;
}

export default function CompanySidebar({
  target,
  onClose,
}: {
  target: SidebarTarget;
  onClose: () => void;
}) {
  const [spData, setSpData] = useState<SpRow | null>(null);
  const [spLoading, setSpLoading] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [enrichment, setEnrichment] = useState<{ long_desc: string | null; moat: string | null; risk: string | null; brief: string | null } | null>(null);
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 440;
    return parseInt(localStorage.getItem("hx-sidebar-w") || "440", 10);
  });
  const asideRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ x: number; w: number } | null>(null);

  const onResizeMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = dragRef.current.x - e.clientX;
    const next = Math.max(320, Math.min(window.innerWidth - 100, dragRef.current.w + dx));
    setWidth(next);
  }, []);
  const stopResize = useCallback(() => {
    dragRef.current = null;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onResizeMove);
    window.removeEventListener("mouseup", stopResize);
    try { localStorage.setItem("hx-sidebar-w", String(width)); } catch {}
  }, [onResizeMove, width]);
  const startResize = useCallback((e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, w: width };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", stopResize);
  }, [width, onResizeMove, stopResize]);

  const curated = target?.kind === "curated" ? COMPANY_BY_ID[target.id] : null;
  const curatedSec = curated ? SECTOR_BY_ID[curated.sector] : null;
  const neighbors = curated ? neighborsOf(curated.id) : null;

  // Fetch DB-stored enrichment for curated companies
  useEffect(() => {
    setEnrichment(null);
    if (target?.kind === "curated") {
      fetch(`/api/db/enrichment/${target.id}`).then(r => r.json()).then(d => {
        setEnrichment(d.enrichment);
        if (d.enrichment?.brief) setBrief(d.enrichment.brief);
      });
    }
  }, [target]);

  useEffect(() => {
    setSpData(null); setBrief(null);
    if (target?.kind === "sp") {
      setSpLoading(true);
      fetch(`/api/db/company/${target.spId}`)
        .then(r => r.json()).then(d => { if (!d.error) setSpData(d); })
        .finally(() => setSpLoading(false));
    }
  }, [target]);

  // Esc closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (target) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target) return null;

  async function genBrief() {
    if (!curated) return;
    setBriefLoading(true);
    try {
      const r = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "company", id: curated.id }),
      });
      const d = await r.json();
      if (!d.error) setBrief(d.text);
    } finally { setBriefLoading(false); }
  }

  return (
    <>
      {/* Backdrop on mobile */}
      <div className="fixed inset-0 z-40 bg-bg/40 backdrop-blur-sm md:hidden" onClick={onClose} />

      <aside
        ref={asideRef}
        style={{ width: width }}
        className="fixed right-0 top-14 bottom-0 z-50 hairline-l bg-bg-1 overflow-y-auto shadow-glow"
      >
        {/* Drag-resize handle on left edge */}
        <div
          onMouseDown={startResize}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-accent transition group flex items-center justify-center z-20"
          title="drag to resize"
        >
          <GripVertical className="h-4 w-4 text-ink-mute group-hover:text-bg opacity-0 group-hover:opacity-100" />
        </div>
        <div className="sticky top-0 z-10 hairline-b bg-bg-1/95 backdrop-blur px-5 py-3 flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// COMPANY · DETAIL</div>
          <button onClick={onClose} className="text-ink-mute hover:text-accent transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ─── Curated company ─── */}
        {curated && (
          <div className="p-5">
            <div className="flex items-start gap-3">
              <Logo companyId={curated.id} size={48} />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: curatedSec?.color }}>{curatedSec?.name.toUpperCase()}</div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight truncate">{curated.name}</h2>
                <div className="font-mono text-[11px] text-ink-mute">{curated.ticker || "private"} · {curated.hq}</div>
              </div>
            </div>

            {DOMAINS[curated.id] && (
              <a href={`https://${DOMAINS[curated.id]}`} target="_blank" rel="noreferrer"
                 className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                {DOMAINS[curated.id]} <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <div className="mt-4 flex gap-2">
              <Link href={`/companies/${curated.id}`}
                    className="flex-1 text-center font-mono text-[10px] tracking-[0.2em] border border-accent text-accent py-2 hover:bg-accent hover:text-bg transition">
                FULL PAGE →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
              <Stat label="MKT CAP" value={fmtUSD(curated.marketCapUSD)} />
              <Stat label="REVENUE" value={fmtUSD(curated.revenueUSD)} />
              <Stat label="TIER" value={curated.tier.toUpperCase()} />
            </div>

            <Section title="OVERVIEW">
              <p className="text-sm text-ink-dim leading-relaxed">{curated.longDesc || enrichment?.long_desc || curated.blurb}</p>
              {enrichment?.long_desc && !curated.longDesc && (
                <div className="mt-2 font-mono text-[9px] text-accent">// AGENT-ENRICHED</div>
              )}
            </Section>

            {curated.products?.length > 0 && (
              <Section title="PRODUCTS">
                <ul className="space-y-1 text-sm">
                  {curated.products.map(p => (
                    <li key={p} className="flex gap-2"><span className="text-accent">▸</span><span className="text-ink-dim">{p}</span></li>
                  ))}
                </ul>
              </Section>
            )}

            {(curated.moat || enrichment?.moat) && (
              <Section title="MOAT">
                <p className="text-sm text-ink-dim leading-relaxed">{curated.moat || enrichment?.moat}</p>
              </Section>
            )}

            {(curated.risk || enrichment?.risk) && (
              <Section title="RISK">
                <p className="text-sm text-ink-dim leading-relaxed">{curated.risk || enrichment?.risk}</p>
              </Section>
            )}

            {neighbors && (neighbors.upstream.length > 0 || neighbors.downstream.length > 0) && (
              <Section title="SUPPLY CHAIN">
                {neighbors.upstream.length > 0 && (
                  <>
                    <div className="font-mono text-[9px] text-ink-mute mt-1 mb-1.5">UPSTREAM ({neighbors.upstream.length})</div>
                    <NeighborChips items={neighbors.upstream.map(c => ({ id: c.id, name: c.name }))} />
                  </>
                )}
                {neighbors.downstream.length > 0 && (
                  <>
                    <div className="font-mono text-[9px] text-ink-mute mt-3 mb-1.5">DOWNSTREAM ({neighbors.downstream.length})</div>
                    <NeighborChips items={neighbors.downstream.map(c => ({ id: c.id, name: c.name }))} />
                  </>
                )}
              </Section>
            )}

            <Section title="AI ANALYST BRIEF">
              {!brief && !briefLoading && (
                <button onClick={genBrief}
                        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] border border-accent/50 text-accent px-3 py-1.5 hover:bg-accent hover:text-bg transition">
                  <Sparkles className="h-3 w-3" /> GENERATE BRIEF
                </button>
              )}
              {briefLoading && <span className="flex items-center gap-2 text-xs text-accent"><Loader2 className="h-3 w-3 animate-spin" /> drafting…</span>}
              {brief && <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{brief}</p>}
            </Section>
          </div>
        )}

        {/* ─── S&P imported company ─── */}
        {target.kind === "sp" && (
          <div className="p-5">
            {spLoading && <div className="text-xs text-accent font-mono flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> loading…</div>}
            {!spLoading && spData && (
              <>
                <div className="font-mono text-[10px] tracking-[0.3em] text-accent">{spData.primary_industry?.toUpperCase()}</div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{spData.name}</h2>
                <div className="font-mono text-[11px] text-ink-mute">
                  {spData.ticker || "private"} · CapIQ {spData.sp_id}
                  {spData.status && ` · ${spData.status}`}
                </div>

                {spData.website && (
                  <a href={spData.website.startsWith("http") ? spData.website : `https://${spData.website}`}
                     target="_blank" rel="noreferrer"
                     className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                    {spData.website} <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <Link href={`/explore/${spData.sp_id}`}
                      className="mt-4 block text-center font-mono text-[10px] tracking-[0.2em] border border-accent text-accent py-2 hover:bg-accent hover:text-bg transition">
                  FULL PAGE →
                </Link>

                {(spData.market_cap_usd != null || spData.revenue_usd != null || spData.country) && (
                  <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
                    <Stat label="MKT CAP" value={fmtMcapBig(spData.market_cap_usd)} />
                    <Stat label="REVENUE" value={fmtMcapBig(spData.revenue_usd)} />
                    <Stat label="COUNTRY" value={spData.country || "—"} />
                  </div>
                )}

                {spData.description && (
                  <Section title="BUSINESS DESCRIPTION">
                    <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{spData.description}</p>
                  </Section>
                )}

                <Section title="CLASSIFICATION">
                  <Row k="Primary" v={spData.primary_industry} />
                  <Row k="Industry" v={spData.industry} />
                  <Row k="Sector L2" v={spData.sector_l2} />
                  <Row k="Sector L1" v={spData.sector_l1} />
                  <Row k="CapIQ ID" v={spData.sp_id} mono />
                </Section>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hairline bg-bg-2 px-2 py-1.5">
      <div className="text-[9px] tracking-[0.2em] text-ink-mute">{label}</div>
      <div className="text-sm text-accent">{value}</div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 hairline bg-bg-2 p-3">
      <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">// {title}</div>
      {children}
    </section>
  );
}
function Row({ k, v, mono }: { k: string; v: any; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2 text-xs py-0.5">
      <dt className="text-ink-mute">{k}</dt>
      <dd className={`text-ink text-right ${mono ? "font-mono text-[11px]" : ""}`}>{v ?? <span className="text-ink-mute">—</span>}</dd>
    </div>
  );
}
function NeighborChips({ items }: { items: { id: string; name: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(i => (
        <Link key={i.id} href={`/companies/${i.id}`}
              className="hairline bg-bg-1 px-2 py-1 text-[11px] hover:bg-accent hover:text-bg transition">
          {i.name}
        </Link>
      ))}
    </div>
  );
}
