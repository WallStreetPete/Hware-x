"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { DATACENTERS } from "@/lib/data/catalog/datacenters";
import type { DcCampus } from "@/lib/catalog-types";

const cols: Column<DcCampus>[] = [
  { key: "name", label: "Campus", render: r => <span className="font-semibold">{r.name}</span> },
  { key: "operator", label: "Operator", filterable: true },
  { key: "location", label: "Location" },
  { key: "region", label: "Grid", filterable: true },
  { key: "capacityMW", label: "Phase MW", numeric: true,
    render: r => <span className="text-accent font-mono">{r.capacityMW.toLocaleString()}</span> },
  { key: "ultimateMW", label: "Ultimate MW", numeric: true,
    render: r => r.ultimateMW ? r.ultimateMW.toLocaleString() : "—" },
  { key: "liveMW", label: "Live MW", numeric: true,
    render: r => r.liveMW ? r.liveMW.toLocaleString() : "—" },
  { key: "status", label: "Status", filterable: true,
    render: r => <span className={`font-mono text-[10px] tracking-[0.15em] ${r.status === "Operating" ? "text-accent" : r.status === "Under Construction" ? "text-ink" : "text-ink-mute"}`}>{r.status.toUpperCase()}</span> },
  { key: "primaryTenants", label: "Tenants", sortable: false,
    accessor: r => r.primaryTenants.join(" "),
    render: r => <span className="text-ink-dim">{r.primaryTenants.join(", ")}</span> },
  { key: "powerSource", label: "Power" },
  { key: "cooling", label: "Cooling" },
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note || ""}</span> },
];

export default function DcCatalog() {
  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/DATACENTERS</div>
      <h1 className="mt-2 text-3xl font-semibold">Data Center Campuses</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Major operating + planned hyperscale campuses. Capacity, status, primary tenants, grid, power source, and cooling.
      </p>
      <div className="mt-6">
        <DataTable rows={DATACENTERS} columns={cols}
                   searchKeys={["name", "operator", "location", "note"]}
                   defaultSort={{ key: "capacityMW", dir: "desc" }} />
      </div>
    </div>
  );
}
