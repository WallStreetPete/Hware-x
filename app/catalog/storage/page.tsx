"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { STORAGE } from "@/lib/data/catalog/storage";
import type { StorageSku } from "@/lib/catalog-types";

const cols: Column<StorageSku>[] = [
  { key: "name", label: "Product", render: r => <span className="font-semibold">{r.name}</span> },
  { key: "vendorName", label: "Vendor", filterable: true },
  { key: "type", label: "Type", filterable: true,
    render: r => <span className="font-mono text-[10px] text-accent">{r.type}</span> },
  { key: "capacityTB", label: "Capacity (TB)", numeric: true,
    render: r => r.capacityTB ? r.capacityTB.toLocaleString() : "—" },
  { key: "formFactor", label: "Form Factor" },
  { key: "perfGBs", label: "GB/s", numeric: true,
    render: r => r.perfGBs ?? "—" },
  { key: "iops", label: "IOPS" },
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note || ""}</span> },
];

export default function StorageCatalog() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/STORAGE</div>
      <h1 className="mt-2 text-3xl font-semibold">Storage Catalog</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Disaggregated all-flash, QLC SSDs, HAMR HDDs, object stores, and tape — across the AI training-data lake stack.
      </p>
      <div className="mt-6">
        <DataTable rows={STORAGE} columns={cols} vendorIdKey="vendor"
                   searchKeys={["name", "vendorName", "type", "note"]}
                   defaultSort={{ key: "capacityTB", dir: "desc" }} />
      </div>
    </div>
  );
}
