"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { ENERGY } from "@/lib/data/catalog/energy";
import type { EnergyProvider } from "@/lib/catalog-types";

const cols: Column<EnergyProvider>[] = [
  { key: "name", label: "Provider", render: r => (
      <div>
        <div className="font-semibold">{r.name}</div>
        {r.ticker && <div className="font-mono text-[10px] text-ink-mute">{r.ticker}</div>}
      </div>
    )},
  { key: "type", label: "Type", filterable: true,
    render: r => <span className="font-mono text-[10px] tracking-[0.15em] text-accent">{r.type}</span> },
  { key: "region", label: "Region", filterable: true },
  { key: "capacityGW", label: "Total GW", numeric: true,
    render: r => r.capacityGW ? <span className="text-ink">{r.capacityGW}</span> : <span className="text-ink-mute">—</span> },
  { key: "cleanShare", label: "Clean %", numeric: true,
    render: r => r.cleanShare != null ? (
      <span className={r.cleanShare >= 80 ? "text-accent" : "text-ink"}>{r.cleanShare}%</span>
    ) : <span className="text-ink-mute">—</span> },
  { key: "nuclearGW", label: "Nuclear GW", numeric: true,
    render: r => r.nuclearGW ?? "—" },
  { key: "renewablesGW", label: "Renew GW", numeric: true,
    render: r => r.renewablesGW ?? "—" },
  { key: "marketCapUSD", label: "Mkt Cap", numeric: true,
    render: r => r.marketCapUSD ? <span className="text-accent">${r.marketCapUSD}B</span> : <span className="text-ink-mute">—</span> },
  { key: "hyperscalerDeals", label: "Hyperscaler PPAs", sortable: false,
    accessor: r => r.hyperscalerDeals.join(" "),
    render: r => (
      <ul className="space-y-0.5">
        {r.hyperscalerDeals.slice(0, 3).map((d, i) => (
          <li key={i} className="text-ink-dim text-[11px]">▸ {d}</li>
        ))}
      </ul>
    )},
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note}</span> },
];

export default function EnergyCatalog() {
  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/ENERGY</div>
      <h1 className="mt-2 text-3xl font-semibold">Energy Providers to AI Infrastructure</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Utilities, IPPs, nuclear operators, renewable developers, BESS makers and hyperscaler self-generation. Includes capacity, clean-energy share, and known hyperscaler PPAs.
      </p>
      <div className="mt-6">
        <DataTable
          rows={ENERGY}
          columns={cols}
          searchKeys={["name", "ticker", "region", "note"]}
          defaultSort={{ key: "capacityGW", dir: "desc" }}
        />
      </div>
    </div>
  );
}
