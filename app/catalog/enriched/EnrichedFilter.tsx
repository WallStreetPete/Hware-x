"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

/**
 * Drop-in client filter that hides table rows whose `data-search-blob` doesn't include the query.
 * Pure DOM operation so it works inside a server-rendered table.
 */
export default function EnrichedFilter() {
  const [q, setQ] = useState("");

  useEffect(() => {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;
    const ql = q.trim().toLowerCase();
    let visible = 0;
    tbody.querySelectorAll<HTMLTableRowElement>("tr").forEach(row => {
      if (!ql) { row.style.display = ""; visible += 1; return; }
      const text = (row.textContent || "").toLowerCase();
      const match = text.includes(ql);
      row.style.display = match ? "" : "none";
      if (match) visible += 1;
    });
    const counter = document.getElementById("filter-count");
    if (counter) counter.textContent = ql ? `${visible} match${visible === 1 ? "" : "es"}` : "";
  }, [q]);

  return (
    <div className="hairline bg-bg-2 flex items-center gap-2 px-2 py-1.5 max-w-md">
      <Search className="h-3.5 w-3.5 text-ink-mute" />
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="filter by vendor / product / specs…"
        className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-ink-mute"
      />
      <span id="filter-count" className="font-mono text-[10px] text-ink-mute" />
    </div>
  );
}
