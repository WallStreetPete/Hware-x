"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  className?: string;
  sortable?: boolean;
  filterable?: boolean;     // adds a select filter in header
  numeric?: boolean;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => any; // for sorting / filtering
};

export type DataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T | string)[];
  vendorIdKey?: keyof T;       // shows logo + links to /companies/[id]
  defaultSort?: { key: string; dir: "asc" | "desc" };
  rowHref?: (row: T) => string | null;
};

export default function DataTable<T extends { id: string }>({
  rows, columns, searchKeys = [], vendorIdKey, defaultSort, rowHref,
}: DataTableProps<T>) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key || null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.dir || "asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterOptions = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const c of columns) {
      if (!c.filterable) continue;
      const set = new Set<string>();
      for (const r of rows) {
        const v = c.accessor ? c.accessor(r) : (r as any)[c.key];
        if (v != null && v !== "") set.add(String(v));
      }
      out[c.key as string] = Array.from(set).sort();
    }
    return out;
  }, [rows, columns]);

  const filtered = useMemo(() => {
    let out = rows;
    // search
    if (q.trim()) {
      const ql = q.toLowerCase();
      out = out.filter(r => {
        const blob = [
          ...searchKeys.map(k => (r as any)[k]),
          ...columns.map(c => (c.accessor ? c.accessor(r) : (r as any)[c.key])),
        ].filter(Boolean).join(" ").toLowerCase();
        return blob.includes(ql);
      });
    }
    // filters
    for (const [k, v] of Object.entries(filters)) {
      if (!v) continue;
      const col = columns.find(c => c.key === k);
      out = out.filter(r => {
        const x = col?.accessor ? col.accessor(r) : (r as any)[k];
        return String(x) === v;
      });
    }
    // sort
    if (sortKey) {
      const col = columns.find(c => c.key === sortKey);
      out = [...out].sort((a, b) => {
        const ax = col?.accessor ? col.accessor(a) : (a as any)[sortKey];
        const bx = col?.accessor ? col.accessor(b) : (b as any)[sortKey];
        if (ax == null && bx == null) return 0;
        if (ax == null) return 1;
        if (bx == null) return -1;
        const av = typeof ax === "number" ? ax : String(ax).toLowerCase();
        const bv = typeof bx === "number" ? bx : String(bx).toLowerCase();
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return out;
  }, [rows, q, filters, sortKey, sortDir, columns, searchKeys]);

  function toggleSort(k: string) {
    if (sortKey === k) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  }

  return (
    <div className="hairline bg-bg-1">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 hairline-b">
        <div className="flex items-center gap-2 hairline bg-bg-2 px-2 py-1.5 flex-1 min-w-[240px]">
          <Search className="h-3.5 w-3.5 text-ink-mute" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={`search ${rows.length} rows…`}
            className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-ink-mute"
          />
        </div>
        {columns.filter(c => c.filterable).map(c => (
          <select
            key={c.key as string}
            value={filters[c.key as string] || ""}
            onChange={e => setFilters(f => ({ ...f, [c.key as string]: e.target.value }))}
            className="hairline bg-bg-2 px-2 py-1.5 text-xs font-mono"
          >
            <option value="">{`all ${c.label}`}</option>
            {(filterOptions[c.key as string] || []).map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ))}
        <div className="font-mono text-[10px] text-ink-mute ml-auto">
          {filtered.length} / {rows.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="hairline-b bg-bg-2">
              {vendorIdKey && <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute"></th>}
              {columns.map(c => (
                <th key={c.key as string}
                    className={`px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute ${c.numeric ? "text-right" : ""} ${c.className || ""}`}>
                  {c.sortable !== false ? (
                    <button onClick={() => toggleSort(c.key as string)} className="flex items-center gap-1 hover:text-accent">
                      {c.label.toUpperCase()}
                      {sortKey === c.key
                        ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)
                        : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  ) : c.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const href = rowHref ? rowHref(r) : null;
              const Row = (
                <tr className={`hairline-b hover:bg-bg-2 transition ${i % 2 ? "bg-bg-1" : ""}`}>
                  {vendorIdKey && (
                    <td className="px-3 py-2">
                      <Logo companyId={(r as any)[vendorIdKey]} size={20} />
                    </td>
                  )}
                  {columns.map(c => {
                    const val = c.accessor ? c.accessor(r) : (r as any)[c.key];
                    return (
                      <td key={c.key as string}
                          className={`px-3 py-2 ${c.numeric ? "text-right font-mono" : ""} ${c.className || ""}`}>
                        {c.render ? c.render(r) : (val == null ? <span className="text-ink-mute">—</span> : String(val))}
                      </td>
                    );
                  })}
                </tr>
              );
              return href ? (
                <Link key={r.id} href={href} legacyBehavior>
                  <a className="contents">{Row}</a>
                </Link>
              ) : <tr key={r.id}>{Row.props.children}</tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
