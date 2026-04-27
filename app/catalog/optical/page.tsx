"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { OPTICAL } from "@/lib/data/catalog/optical";
import type { OpticalSku } from "@/lib/catalog-types";

const cols: Column<OpticalSku>[] = [
  { key: "name", label: "Product", render: r => <span className="font-semibold">{r.name}</span> },
  { key: "vendorName", label: "Vendor", filterable: true },
  { key: "rate", label: "Rate", filterable: true,
    render: r => <span className="font-mono text-[10px] tracking-[0.15em] text-accent">{r.rate}</span> },
  { key: "formFactor", label: "Form Factor", filterable: true },
  { key: "reach", label: "Reach" },
  { key: "optics", label: "Optics" },
  { key: "laser", label: "Laser" },
  { key: "powerW", label: "Power (W)", numeric: true,
    render: r => r.powerW != null ? r.powerW : "—" },
  { key: "released", label: "Year" },
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note || ""}</span> },
];

export default function OpticalCatalog() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/OPTICAL</div>
      <h1 className="mt-2 text-3xl font-semibold">Optical Transceivers</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Pluggable optical modules from 100G through 1.6T plus emerging co-packaged optics. Form factor, reach, laser type, and power consumption.
      </p>
      <div className="mt-6">
        <DataTable rows={OPTICAL} columns={cols} vendorIdKey="vendor"
                   searchKeys={["name", "vendorName", "optics", "note"]}
                   defaultSort={{ key: "rate", dir: "desc" }} />
      </div>
    </div>
  );
}
