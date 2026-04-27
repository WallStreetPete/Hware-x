"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { FIBER } from "@/lib/data/catalog/fiber";
import type { FiberProvider } from "@/lib/catalog-types";

const cols: Column<FiberProvider>[] = [
  { key: "name", label: "Provider", render: r => (
      <div>
        <div className="font-semibold">{r.name}</div>
        {r.ticker && <div className="font-mono text-[10px] text-ink-mute">{r.ticker}</div>}
      </div>
    )},
  { key: "type", label: "Type", filterable: true,
    render: r => <span className="font-mono text-[10px] tracking-[0.15em] text-accent">{r.type}</span> },
  { key: "hq", label: "HQ" },
  { key: "routeMiles", label: "Route Miles", numeric: true,
    render: r => r.routeMiles ? r.routeMiles.toLocaleString() : "—" },
  { key: "longHaulMiles", label: "Long-haul", numeric: true,
    render: r => r.longHaulMiles ? r.longHaulMiles.toLocaleString() : "—" },
  { key: "metroMiles", label: "Metro", numeric: true,
    render: r => r.metroMiles ? r.metroMiles.toLocaleString() : "—" },
  { key: "buildings", label: "Buildings", numeric: true,
    render: r => r.buildings ? r.buildings.toLocaleString() : "—" },
  { key: "capacityTbps", label: "Capacity" },
  { key: "marketCapUSD", label: "Mkt Cap", numeric: true,
    render: r => r.marketCapUSD ? <span className="text-accent">${r.marketCapUSD}B</span> : <span className="text-ink-mute">—</span> },
  { key: "hyperscalerExposure", label: "Hyperscaler Deals", sortable: false,
    accessor: r => r.hyperscalerExposure.join(" "),
    render: r => (
      <ul className="space-y-0.5">
        {r.hyperscalerExposure.slice(0, 3).map((d, i) => (
          <li key={i} className="text-ink-dim text-[11px]">▸ {d}</li>
        ))}
      </ul>
    )},
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note}</span> },
];

export default function FiberCatalog() {
  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/FIBER</div>
      <h1 className="mt-2 text-3xl font-semibold">Fiber & Telecom Catalog</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Dark-fiber carriers, cable manufacturers, submarine cable integrators, DCI optical-system vendors, and hyperscaler-owned global networks. Route-miles + capacity + hyperscaler exposure.
      </p>
      <div className="mt-6">
        <DataTable
          rows={FIBER}
          columns={cols}
          searchKeys={["name", "ticker", "hq", "note"]}
          defaultSort={{ key: "routeMiles", dir: "desc" }}
        />
      </div>
    </div>
  );
}
