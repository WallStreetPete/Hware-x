"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Node,
  type Edge as RFEdge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { COMPANIES, ALL_EDGES, SECTORS, LAYER_ORDER, LAYER_LABEL } from "@/lib/data/graph";
import type { Sector } from "@/lib/types";
import Logo from "./Logo";
import Link from "next/link";
import { Eye, EyeOff, Search } from "lucide-react";
import CompanySidebar from "./CompanySidebar";
import { useReactFlow } from "reactflow";

// ─── Custom company node — every node gets a full red border for visual consistency.
function CompanyNode({ data }: { data: { id: string; label: string; ticker?: string; sector: Sector; tier: string; selected?: boolean; faded?: boolean; enriched?: boolean } }) {
  const tierShadow = data.tier === "core" || data.tier === "platform" ? "shadow-glow-sm" : "";
  return (
    <div
      className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-sm border border-accent bg-bg-1 transition-all ${tierShadow} ${
        data.faded ? "opacity-25" : "hover:bg-bg-2"
      } ${data.selected ? "ring-2 ring-accent shadow-glow" : ""}`}
      style={{ borderLeftColor: data.sector.color, borderLeftWidth: 3, minWidth: 170 }}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Logo companyId={data.id} size={18} />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[11px] text-ink truncate">{data.label}</div>
        {data.ticker && <div className="font-mono text-[9px] text-ink-mute">{data.ticker}</div>}
      </div>
      {data.enriched && (
        <span title="AI-enriched profile" className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent shadow-glow-sm" />
      )}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// ─── Sector header node (draggable lock-off, just labels) ───
function SectorLabelNode({ data }: { data: { name: string; color: string; count: number } }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.25em] flex items-center gap-2 px-2.5 py-1 rounded-sm bg-bg-2 border border-accent">
      <span style={{ color: data.color }}>▸</span>
      <span className="text-ink">{data.name.toUpperCase()}</span>
      <span className="text-ink-mute ml-auto">{data.count}</span>
    </div>
  );
}

function LayerHeaderNode({ data }: { data: { label: string } }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.4em] text-accent glow-text px-3 py-1.5 rounded-sm bg-bg-1 border border-accent">
      {data.label.toUpperCase()}
    </div>
  );
}

const nodeTypes = { company: CompanyNode, sectorLabel: SectorLabelNode, layerHeader: LayerHeaderNode };

// ─── Layout ──────────────────────────────────────────────────
function buildLayout(enrichedSet: Set<string> = new Set()) {
  const COL_W = 220;
  const ROW_H = 38;
  const SECTOR_GAP = 60;
  const LAYER_GAP = 80;

  const layerCols: Record<string, Sector[]> = {};
  for (const s of SECTORS) {
    layerCols[s.layer] = layerCols[s.layer] || [];
    layerCols[s.layer].push(s);
  }

  const nodes: Node[] = [];
  let xCursor = 80;

  for (const layer of LAYER_ORDER) {
    const sectorsInLayer = layerCols[layer] || [];

    // Layer header at the top of the column
    nodes.push({
      id: `layer-${layer}`,
      type: "layerHeader",
      position: { x: xCursor, y: -50 },
      data: { label: LAYER_LABEL[layer] },
      draggable: true,
      selectable: false,
    });

    let yCursor = 20;
    for (const sec of sectorsInLayer) {
      const cos = COMPANIES.filter(c => c.sector === sec.id);
      const colHeight = Math.max(cos.length * ROW_H, ROW_H);

      // Sector label node
      nodes.push({
        id: `sector-${sec.id}`,
        type: "sectorLabel",
        position: { x: xCursor, y: yCursor },
        data: { name: sec.name, color: sec.color, count: cos.length },
        draggable: true,
        selectable: false,
      });

      cos.forEach((co, i) => {
        nodes.push({
          id: co.id,
          type: "company",
          position: { x: xCursor, y: yCursor + 30 + i * ROW_H },
          data: {
            id: co.id,
            label: co.name,
            ticker: co.ticker,
            sector: sec,
            tier: co.tier,
            enriched: enrichedSet.has(co.id) || !!co.longDesc,
          },
          draggable: true,
        });
      });
      yCursor += colHeight + 30 + SECTOR_GAP;
    }
    xCursor += COL_W + LAYER_GAP;
  }

  return nodes;
}

function buildEdges(showAll: boolean, focus: string | null): RFEdge[] {
  if (!showAll && !focus) return [];

  const edges: RFEdge[] = ALL_EDGES.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    type: "default",
    animated: false,
    style: { stroke: "var(--accent)", strokeOpacity: 0.32, strokeWidth: 0.8 },
  }));

  if (focus) {
    return edges
      .filter(e => e.source === focus || e.target === focus)
      .map(e => ({
        ...e,
        animated: true,
        style: { stroke: "var(--accent-glow, #ff4d4d)", strokeWidth: 1.5, filter: "drop-shadow(0 0 6px rgba(255,77,77,0.5))" },
      }));
  }
  return edges;
}

function GraphInner({ enrichedIds = [] }: { enrichedIds?: string[] }) {
  const enrichedSet = useMemo(() => new Set(enrichedIds), [enrichedIds]);
  const initialNodes = useMemo(() => buildLayout(enrichedSet), [enrichedSet]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [focus, setFocus] = useState<string | null>(null);
  const [showAllEdges, setShowAllEdges] = useState(true);  // default ON — show supply-chain lines
  const [search, setSearch] = useState("");
  const rf = useReactFlow();

  // Search results dropdown
  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return COMPANIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.ticker && c.ticker.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search]);

  const jumpTo = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    setFocus(id);
    rf.setCenter(node.position.x + 90, node.position.y + 18, { zoom: 1.4, duration: 600 });
    setSearch("");
  }, [nodes, rf]);

  // Keep edges in sync with focus and showAll
  useEffect(() => {
    setEdges(buildEdges(showAllEdges, focus));
  }, [showAllEdges, focus, setEdges]);

  // Keep node faded/selected state in sync with focus
  useEffect(() => {
    setNodes(curr => {
      let related: Set<string> | null = null;
      if (focus) {
        related = new Set([focus]);
        for (const e of ALL_EDGES) {
          if (e.from === focus) related.add(e.to);
          if (e.to === focus) related.add(e.from);
        }
      }
      return curr.map(n => {
        if (n.type !== "company") return n;
        const faded = related ? !related.has(n.id) : false;
        const selected = focus === n.id;
        if (n.data.faded === faded && n.data.selected === selected) return n;
        return { ...n, data: { ...n.data, faded, selected } };
      });
    });
  }, [focus, setNodes]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.type !== "company") return;
    setFocus(prev => (prev === node.id ? null : node.id));
  }, []);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => setFocus(null)}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 0.85 }}
        minZoom={0.15}
        maxZoom={2.5}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        multiSelectionKeyCode={["Shift", "Meta", "Control"]}
        selectionKeyCode={"Shift"}
        deleteKeyCode={["Delete", "Backspace"]}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--line)" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          maskColor="var(--bg)"
          nodeColor={(n: Node) => {
            if (n.type === "company") return (n.data?.sector as Sector)?.color || "var(--accent)";
            if (n.type === "sectorLabel") return "var(--ink-mute)";
            return "transparent";
          }}
          nodeStrokeWidth={0}
          pannable
          zoomable
        />
      </ReactFlow>

      <CompanySidebar
        target={focus ? { kind: "curated", id: focus } : null}
        onClose={() => setFocus(null)}
      />

      {/* Controls panel */}
      <div className="absolute left-4 top-16 z-30 hairline bg-bg-2/95 backdrop-blur p-3 font-mono text-[10px] space-y-2 w-[260px]">
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
                <button
                  key={m.id}
                  onClick={() => jumpTo(m.id)}
                  className="block w-full text-left px-2 py-1.5 hover:bg-bg-2 hover:text-accent transition"
                >
                  <span className="text-ink">{m.name}</span>
                  {m.ticker && <span className="text-ink-mute ml-2">{m.ticker}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-accent tracking-[0.3em] pt-2">// VIEW</div>
        <button
          onClick={() => setShowAllEdges(v => !v)}
          className="flex items-center gap-2 w-full text-left hover:text-accent transition"
        >
          {showAllEdges ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showAllEdges ? "HIDE ALL EDGES" : "SHOW ALL EDGES"}
        </button>
        <div className="text-ink-mute pt-2 border-t border-line space-y-0.5">
          <div className="text-accent">tip:</div>
          <div>· click → sidebar</div>
          <div>· drag any node</div>
          <div>· shift-drag → multi-select</div>
          <div>· delete → remove selected</div>
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute right-4 bottom-4 z-30 hairline bg-bg-2/85 backdrop-blur p-3 font-mono text-[10px]">
        <div className="text-accent tracking-[0.3em] mb-2">// LEGEND</div>
        <div className="space-y-1 text-ink-dim">
          <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 border border-accent shadow-glow-sm" />core</div>
          <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 border border-accent" />platform</div>
          <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 border border-accent" />demand</div>
          <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 border border-line" />enabler</div>
          <div className="flex items-center gap-2 pt-1.5 mt-1.5 border-t border-line"><span className="inline-block h-2 w-2 rounded-full bg-accent shadow-glow-sm" />ai-enriched</div>
        </div>
      </div>
    </div>
  );
}

export default function GodsEyeGraph({ enrichedIds }: { enrichedIds?: string[] }) {
  return (
    <ReactFlowProvider>
      <GraphInner enrichedIds={enrichedIds} />
    </ReactFlowProvider>
  );
}
