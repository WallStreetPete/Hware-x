"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { SWITCHES } from "@/lib/data/catalog/switches";
import type { NetworkSwitch } from "@/lib/catalog-types";

const cols: Column<NetworkSwitch>[] = [
  { key: "name", label: "Switch", render: r => <span className="font-semibold">{r.name}</span> },
  { key: "vendorName", label: "Vendor", filterable: true },
  { key: "asic", label: "ASIC", filterable: true,
    render: r => <span className="font-mono text-[10px] text-accent">{r.asic}</span> },
  { key: "rateTbps", label: "Tbps", numeric: true,
    render: r => <span className="text-accent">{r.rateTbps}</span> },
  { key: "portsTopology", label: "Ports" },
  { key: "ru", label: "RU", numeric: true },
  { key: "released", label: "Year" },
  { key: "note", label: "Note", sortable: false,
    render: r => <span className="text-ink-dim">{r.note || ""}</span> },
];

export default function SwitchesCatalog() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/SWITCHES</div>
      <h1 className="mt-2 text-3xl font-semibold">AI Network Switches</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Top-of-rack and spine switches used in AI training clusters. Backed by Tomahawk, Spectrum, Quantum, Silicon One, Teralynx and Jericho ASICs.
      </p>
      <div className="mt-6">
        <DataTable rows={SWITCHES} columns={cols} vendorIdKey="vendor"
                   searchKeys={["name", "vendorName", "asic", "note"]}
                   defaultSort={{ key: "rateTbps", dir: "desc" }} />
      </div>
    </div>
  );
}
