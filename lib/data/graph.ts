import { COMPANIES, COMPANY_BY_ID } from "./companies";
import { SECTORS, SECTOR_BY_ID, LAYER_ORDER, LAYER_LABEL } from "./sectors";
import type { Edge } from "../types";

// Build edges from upstream/downstream declarations on each Company.
export function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (const c of COMPANIES) {
    for (const u of c.upstream || []) {
      const key = `${u}->${c.id}`;
      if (!seen.has(key) && COMPANY_BY_ID[u]) {
        edges.push({ from: u, to: c.id, kind: "supplies", weight: 2 });
        seen.add(key);
      }
    }
    for (const d of c.downstream || []) {
      const key = `${c.id}->${d}`;
      if (!seen.has(key) && COMPANY_BY_ID[d]) {
        edges.push({ from: c.id, to: d, kind: "supplies", weight: 2 });
        seen.add(key);
      }
    }
  }
  return edges;
}

export const ALL_EDGES = buildEdges();

export function neighborsOf(companyId: string) {
  const upstream: string[] = [];
  const downstream: string[] = [];
  for (const e of ALL_EDGES) {
    if (e.to === companyId) upstream.push(e.from);
    if (e.from === companyId) downstream.push(e.to);
  }
  return {
    upstream: Array.from(new Set(upstream)).map(id => COMPANY_BY_ID[id]).filter(Boolean),
    downstream: Array.from(new Set(downstream)).map(id => COMPANY_BY_ID[id]).filter(Boolean),
  };
}

export function companiesBySector(sectorId: string) {
  return COMPANIES.filter(c => c.sector === sectorId);
}

export { SECTORS, SECTOR_BY_ID, COMPANIES, COMPANY_BY_ID, LAYER_ORDER, LAYER_LABEL };
