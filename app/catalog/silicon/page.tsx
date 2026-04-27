"use client";
import DataTable, { type Column } from "@/components/DataTable";
import { SILICON } from "@/lib/data/catalog/silicon";
import type { SiliconProduct } from "@/lib/catalog-types";
import { fmtUSD } from "@/lib/utils";

const cols: Column<SiliconProduct>[] = [
  { key: "name",     label: "Product",      render: r => <span className="font-semibold text-ink">{r.name}</span> },
  { key: "vendorName", label: "Vendor",     filterable: true },
  { key: "family",   label: "Family",       filterable: true,
    render: r => <span className="font-mono text-[10px] tracking-[0.15em] text-accent">{r.family}</span> },
  { key: "segment",  label: "Segment",      filterable: true },
  { key: "released", label: "Released",     numeric: false },
  { key: "process",  label: "Process" },
  { key: "memory",   label: "Memory" },
  { key: "bandwidth", label: "BW" },
  { key: "tdpW",     label: "TDP (W)",      numeric: true,
    render: r => r.tdpW ? <span>{r.tdpW.toLocaleString()}</span> : <span className="text-ink-mute">—</span> },
  { key: "perfFP8",  label: "FP8" },
  { key: "perfFP4",  label: "FP4" },
  { key: "msrpUSD",  label: "MSRP",  numeric: true,
    accessor: r => r.msrpUSD,
    render: r => r.msrpUSD ? <span className="text-accent">${r.msrpUSD.toLocaleString()}</span> : <span className="text-ink-mute">—</span> },
  { key: "notes",    label: "Notes",        sortable: false,
    render: r => <span className="text-ink-dim">{r.notes || ""}</span> },
];

export default function SiliconCatalog() {
  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/SILICON</div>
      <h1 className="mt-2 text-3xl font-semibold">Silicon Catalog</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Every chip that matters in AI infrastructure: datacenter GPUs and AI accelerators, server + consumer CPUs, DPUs, NPUs, and switch ASICs. Sort, filter, search.
      </p>
      <div className="mt-6">
        <DataTable
          rows={SILICON}
          columns={cols}
          vendorIdKey="vendor"
          searchKeys={["name", "vendorName", "family", "process", "notes"]}
          defaultSort={{ key: "released", dir: "desc" }}
        />
      </div>
    </div>
  );
}
