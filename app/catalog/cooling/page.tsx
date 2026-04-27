"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { COOLING } from "@/lib/data/catalog/cooling";
import type { CoolingProduct } from "@/lib/catalog-types";

const cols: Column<CoolingProduct>[] = [
  { key: "name", label: "Product", render: r => <span className="font-semibold">{r.name}</span> },
  { key: "vendorName", label: "Vendor", filterable: true },
  { key: "type", label: "Type", filterable: true,
    render: r => <span className="font-mono text-[10px] text-accent">{r.type}</span> },
  { key: "capacityKW", label: "Capacity (kW)", numeric: true,
    render: r => r.capacityKW ? r.capacityKW.toLocaleString() : "—" },
  { key: "fluid", label: "Fluid" },
  { key: "released", label: "Year" },
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note || ""}</span> },
];

export default function CoolingCatalog() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/COOLING</div>
      <h1 className="mt-2 text-3xl font-semibold">Cooling Catalog</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Direct-to-chip cold plates, CDUs, rear-door HX, single-phase + two-phase immersion, and chillers powering 100kW+ racks.
      </p>
      <div className="mt-6">
        <DataTable rows={COOLING} columns={cols} vendorIdKey="vendor"
                   searchKeys={["name", "vendorName", "type", "note"]}
                   defaultSort={{ key: "capacityKW", dir: "desc" }} />
      </div>
    </div>
  );
}
