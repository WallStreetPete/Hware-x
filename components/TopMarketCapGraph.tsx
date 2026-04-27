"use client";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider,
  Handle, Position, type Node, useNodesState, useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CompanySidebar from "./CompanySidebar";
import { Search, Loader2 } from "lucide-react";

type Row = {
  id: number; sp_id: string; name: string; ticker: string | null; country: string | null;
  primary_industry: string | null; market_cap_usd: number | null; revenue_usd: number | null;
  website: string | null; logo_at: string | null;
};
type Mode = "global" | "us-public" | "us-all";

const INDUSTRY_COLOR: Record<string, string> = {
  "Semiconductors":                                "#ff2a2a",
  "Semiconductor Materials and Equipment":         "#ff5050",
  "Electronic Components":                         "#ff7a4d",
  "Electronic Equipment and Instruments":          "#ff9a6a",
  "Communications Equipment":                      "#ffaa7a",
  "Technology Hardware, Storage and Peripherals":  "#ff6b6b",
  "Electronic Manufacturing Services":             "#cc4040",
  "Technology Distributors":                       "#a04040",
  "Communications Equipment Distribution":         "#883030",
  "Semiconductor Equipment and Product Distribution": "#7a3030",
};

function fmtMcap(m: number | null) {
  if (m == null) return "—";
  if (m >= 1_000_000) return `$${(m/1_000_000).toFixed(2)}T`;
  if (m >= 1000) return `$${(m/1000).toFixed(1)}B`;
  return `$${m.toFixed(0)}M`;
}

const NODE_W = 120;
const NODE_H = 120;

function CompanyLogo({ spId, hasLogo, name }: { spId: string; hasLogo: boolean; name: string }) {
  const [errored, setErrored] = useState(false);
  if (!hasLogo || errored) {
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-bg-2 text-ink font-mono font-bold text-lg">
        {(name[0] || "?").toUpperCase()}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${spId}.png`}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      style={{ width: 48, height: 48, objectFit: "contain" }}
      className="rounded-sm bg-white p-0.5"
      onError={() => setErrored(true)}
    />
  );
}

function CompanyNode({ data }: { data: { spId: string; name: string; ticker: string | null; country: string | null; mcap: number | null; revenue: number | null; color: string; hasLogo: boolean; selected?: boolean; faded?: boolean } }) {
  const ticker = data.ticker?.split(":")[1] || data.ticker || "";
  const isPrivate = data.mcap == null && data.revenue != null;
  const sizeLabel = data.mcap != null
    ? fmtMcap(data.mcap)
    : isPrivate
    ? `${fmtMcap(data.revenue)} rev`
    : "—";
  return (
    <div
      className={`group relative flex flex-col items-center justify-between rounded-sm border bg-bg-1 transition-all overflow-hidden ${
        data.faded ? "opacity-30" : "hover:bg-bg-2 hover:shadow-glow-sm"
      } ${data.selected ? "ring-2 ring-accent shadow-glow" : ""}`}
      style={{ width: NODE_W, height: NODE_H, borderColor: data.color, borderTopWidth: 3, padding: 6 }}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <CompanyLogo spId={data.spId} hasLogo={data.hasLogo} name={data.name} />
      <div className="w-full text-center leading-tight">
        <div className="font-mono text-[9px] text-ink truncate" title={data.name}>{data.name}</div>
        <div className="font-mono text-[8px] text-ink-mute truncate">
          {ticker
            ? <span className="text-accent">{ticker}</span>
            : isPrivate ? <span className="text-ink-mute">PRIVATE</span> : null}
          {(ticker || isPrivate) && data.country ? " · " : ""}
          {data.country || ""}
        </div>
        <div className="font-mono text-[9px] text-accent">{sizeLabel}</div>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

function IndustryHeaderNode({ data }: { data: { name: string; count: number; color: string } }) {
  return (
    <div
      className="font-mono text-[11px] tracking-[0.3em] text-accent px-3 py-2 rounded-sm bg-bg-1 border flex items-center justify-between"
      style={{ borderColor: data.color, width: 4 * NODE_W + 3 * 16 }}
    >
      <span className="truncate">{data.name.toUpperCase()}</span>
      <span className="ml-2 text-ink-mute">{data.count}</span>
    </div>
  );
}

const nodeTypes = { co: CompanyNode, header: IndustryHeaderNode };

function sizeOf(r: Row): number {
  // Unified size proxy used both for sorting within group and totaling per industry.
  // Uses real market cap when present; falls back to 3× revenue for private companies.
  return r.market_cap_usd ?? (r.revenue_usd ? r.revenue_usd * 3 : 0);
}

function buildLayout(rows: Row[]) {
  // Group by industry, sort each group by size proxy desc
  const groups: Record<string, Row[]> = {};
  for (const r of rows) {
    const k = r.primary_industry || "Other";
    (groups[k] = groups[k] || []).push(r);
  }
  for (const k in groups) groups[k].sort((a, b) => sizeOf(b) - sizeOf(a));

  // Sort industries by aggregate size so largest column is leftmost
  const industries = Object.keys(groups).sort((a, b) =>
    groups[b].reduce((s, x) => s + sizeOf(x), 0) - groups[a].reduce((s, x) => s + sizeOf(x), 0)
  );

  const GAP = 16;
  const COLS_PER_INDUSTRY = 4;
  const HEADER_H = 60;
  const INDUSTRY_GAP_X = 80;
  const BLOCK_W = COLS_PER_INDUSTRY * NODE_W + (COLS_PER_INDUSTRY - 1) * GAP;
  const nodes: Node[] = [];

  let cursorX = 60;
  industries.forEach((ind) => {
    const color = INDUSTRY_COLOR[ind] || "#777";
    const x0 = cursorX;
    nodes.push({
      id: `h:${ind}`,
      type: "header",
      position: { x: x0, y: 0 },
      data: { name: ind, count: groups[ind].length, color },
      draggable: true,
      selectable: false,
    });
    groups[ind].forEach((r, j) => {
      const col = j % COLS_PER_INDUSTRY;
      const row = Math.floor(j / COLS_PER_INDUSTRY);
      nodes.push({
        id: `co:${r.sp_id}`,
        type: "co",
        position: {
          x: x0 + col * (NODE_W + GAP),
          y: HEADER_H + row * (NODE_H + GAP),
        },
        data: {
          spId: r.sp_id,
          name: r.name.replace(/\s*\([A-Z:.]+\)\s*$/, ""),
          ticker: r.ticker,
          country: r.country,
          mcap: r.market_cap_usd,
          revenue: r.revenue_usd,
          hasLogo: !!r.logo_at,
          color,
        },
        draggable: true,
      });
    });
    cursorX += BLOCK_W + INDUSTRY_GAP_X;
  });

  return nodes;
}

function GraphInner({ mode, limit }: { mode: Mode; limit: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const [selectedSp, setSelectedSp] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({ limit: String(limit) });
    if (mode === "us-public") qs.set("us", "1");
    else if (mode === "us-all") qs.set("mode", "us-all");
    fetch(`/api/db/top?${qs}`)
      .then(r => r.json())
      .then(d => { setRows(d.rows || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [mode, limit]);

  useEffect(() => {
    if (rows.length === 0) return;
    setNodes(buildLayout(rows));
  }, [rows, setNodes]);

  // Search filter
  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.ticker && r.ticker.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search, rows]);

  function onNodeClick(_: any, node: Node) {
    if (node.type !== "co") return;
    const sp = node.id.slice("co:".length);
    setSelectedSp(sp);
  }

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 0.7 }}
        minZoom={0.05}
        maxZoom={2.5}
        nodesDraggable
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--line)" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap position="bottom-left" maskColor="var(--bg)"
          nodeColor={(n: Node) => (n.data?.color as string) || "var(--accent)"} nodeStrokeWidth={0} pannable zoomable />
      </ReactFlow>

      {/* Loading + Search panel */}
      <div className="absolute left-4 top-16 z-30 hairline bg-bg-2/95 backdrop-blur p-3 font-mono text-[10px] space-y-2 w-[270px]">
        {loading ? (
          <div className="flex items-center gap-2 text-accent">
            <Loader2 className="h-3 w-3 animate-spin" /> loading top {limit.toLocaleString()}…
          </div>
        ) : (
          <>
            <div className="text-accent tracking-[0.3em]">// SEARCH</div>
            <div className="relative">
              <div className="hairline bg-bg-1 flex items-center gap-1.5 px-2 py-1.5">
                <Search className="h-3 w-3 text-ink-mute" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="company name or ticker…"
                  className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-ink-mute"
                />
              </div>
              {matches.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 hairline bg-bg-1 max-h-64 overflow-y-auto z-50 shadow-glow-sm">
                  {matches.map(m => (
                    <button key={m.sp_id} onClick={() => { setSelectedSp(m.sp_id); setSearch(""); }}
                            className="block w-full text-left px-2 py-1.5 hover:bg-bg-2 hover:text-accent transition">
                      <div className="text-ink truncate">{m.name.replace(/\s*\([A-Z:.]+\)\s*$/, "")}</div>
                      <div className="text-ink-mute">
                        {m.ticker?.split(":")[1] || (m.market_cap_usd == null ? "PRIVATE" : "")} · {m.country} · {m.market_cap_usd != null ? fmtMcap(m.market_cap_usd) : `${fmtMcap(m.revenue_usd)} rev`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-ink-mute pt-2 border-t border-line">
              {(() => {
                const pub = rows.filter(r => r.market_cap_usd != null).length;
                const priv = rows.length - pub;
                const aggMcap = rows.reduce((s, r) => s + (r.market_cap_usd || 0), 0);
                return priv > 0
                  ? <>{rows.length.toLocaleString()} cos · {pub} pub + {priv} priv · ~${(aggMcap / 1_000_000).toFixed(2)}T pub mcap</>
                  : <>{rows.length.toLocaleString()} cos · ~${(aggMcap / 1_000_000).toFixed(1)}T agg</>;
              })()}
            </div>
            <div className="text-ink-mute">click any node → sidebar</div>
          </>
        )}
      </div>

      <CompanySidebar
        target={selectedSp ? { kind: "sp", spId: selectedSp } : null}
        onClose={() => setSelectedSp(null)}
      />
    </div>
  );
}

export default function TopMarketCapGraph({ mode = "global", limit = 1000 }: { mode?: Mode; limit?: number }) {
  return (
    <ReactFlowProvider>
      <GraphInner mode={mode} limit={limit} />
    </ReactFlowProvider>
  );
}
