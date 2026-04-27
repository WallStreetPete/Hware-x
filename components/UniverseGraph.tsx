"use client";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider,
  type Node, useNodesState, useEdgesState,
  Handle, Position,
} from "reactflow";
import "reactflow/dist/style.css";
import CompanySidebar from "./CompanySidebar";
import { Loader2 } from "lucide-react";

type IndustryRow = { name: string; sector_l2: string | null; count: number };
type SpRow       = { id: number; sp_id: string; name: string; ticker: string | null; website: string | null; primary_industry: string | null };

// ─── Industry cluster node
function IndustryClusterNode({ data }: { data: { name: string; count: number; expanded: boolean; loading: boolean } }) {
  return (
    <div className={`px-4 py-3 rounded-sm bg-bg-2 border border-accent ${data.expanded ? "ring-2 ring-accent shadow-glow" : "hover:bg-bg-3 shadow-glow-sm"} cursor-pointer transition-all min-w-[210px]`}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="font-mono text-[10px] tracking-[0.2em] text-accent">{data.expanded ? "▾" : "▸"} INDUSTRY</div>
      <div className="mt-1 text-sm font-semibold text-ink truncate">{data.name}</div>
      <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-ink-mute">
        {data.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        {data.count.toLocaleString()} companies
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

// ─── Company leaf node
function CompanyLeafNode({ data }: { data: { name: string; ticker: string | null; sp_id: string } }) {
  return (
    <div className="px-2 py-1.5 rounded-sm bg-bg-1 border border-accent hover:bg-bg-2 cursor-pointer transition min-w-[155px]">
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="font-mono text-[11px] text-ink truncate">{data.name}</div>
      {data.ticker && <div className="font-mono text-[9px] text-ink-mute">{data.ticker}</div>}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { industry: IndustryClusterNode, leaf: CompanyLeafNode };

function GraphInner() {
  const [industries, setIndustries] = useState<IndustryRow[]>([]);
  const [expanded, setExpanded] = useState<Record<string, SpRow[]>>({});
  const [loadingIndustry, setLoadingIndustry] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const [selectedSp, setSelectedSp] = useState<string | null>(null);

  // Initial load: industries
  useEffect(() => {
    fetch("/api/db/cluster").then(r => r.json()).then(d => {
      setIndustries(d.industries || []);
    });
  }, []);

  // Build node positions
  useEffect(() => {
    if (industries.length === 0) return;
    const COL_W = 320;
    const ROW_H = 110;
    const PER_COL = 6;

    const ns: Node[] = [];

    industries.forEach((ind, i) => {
      const col = Math.floor(i / PER_COL);
      const row = i % PER_COL;
      const x = col * COL_W;
      const y = row * ROW_H;

      ns.push({
        id: `ind:${ind.name}`,
        type: "industry",
        position: { x, y },
        data: { name: ind.name, count: ind.count, expanded: !!expanded[ind.name], loading: loadingIndustry === ind.name },
        draggable: true,
      });

      // expansion: lay out children to the right of cluster node
      const children = expanded[ind.name];
      if (children) {
        const CHILD_W = 170;
        const CHILD_H = 38;
        children.forEach((c, idx) => {
          const cx = x + 240 + Math.floor(idx / 8) * CHILD_W;
          const cy = y + (idx % 8) * CHILD_H - 80;
          ns.push({
            id: `co:${c.sp_id}`,
            type: "leaf",
            position: { x: cx, y: cy },
            data: { name: c.name, ticker: c.ticker, sp_id: c.sp_id },
            draggable: true,
          });
        });
      }
    });

    setNodes(ns);
  }, [industries, expanded, loadingIndustry, setNodes]);

  async function expandIndustry(name: string) {
    if (expanded[name]) {
      // collapse
      setExpanded(e => { const n = { ...e }; delete n[name]; return n; });
      return;
    }
    setLoadingIndustry(name);
    try {
      const r = await fetch(`/api/db/cluster?industry=${encodeURIComponent(name)}&limit=120`);
      const d = await r.json();
      setExpanded(e => ({ ...e, [name]: d.companies || [] }));
    } finally { setLoadingIndustry(null); }
  }

  function onNodeClick(_: any, node: Node) {
    if (node.type === "industry") {
      const name = node.id.slice("ind:".length);
      expandIndustry(name);
    } else if (node.type === "leaf") {
      const spId = node.id.slice("co:".length);
      setSelectedSp(spId);
    }
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
        fitViewOptions={{ padding: 0.15, maxZoom: 0.85 }}
        minZoom={0.15}
        maxZoom={2.5}
        nodesDraggable
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--line)" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          maskColor="var(--bg)"
          nodeColor={(n: Node) => n.type === "industry" ? "var(--accent)" : "var(--ink-mute)"}
          nodeStrokeWidth={0}
          pannable zoomable
        />
      </ReactFlow>

      <div className="absolute left-4 top-16 z-30 hairline bg-bg-2/85 backdrop-blur p-3 font-mono text-[10px] space-y-1">
        <div className="text-accent tracking-[0.3em]">// UNIVERSE</div>
        <div className="text-ink-dim">{industries.length} industries · {industries.reduce((a, b) => a + b.count, 0).toLocaleString()} cos</div>
        <div className="text-ink-mute pt-2 border-t border-line space-y-0.5">
          <div>· click industry → expand</div>
          <div>· click company → sidebar</div>
          <div>· drag freely</div>
        </div>
      </div>

      <CompanySidebar
        target={selectedSp ? { kind: "sp", spId: selectedSp } : null}
        onClose={() => setSelectedSp(null)}
      />
    </div>
  );
}

export default function UniverseGraph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
