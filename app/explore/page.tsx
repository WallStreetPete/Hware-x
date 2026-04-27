import Link from "next/link";
import { searchCompanies, listIndustries, dbStats } from "@/lib/db";
import { findCuratedIdByName } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE = 50;

export default async function Explore({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const q = sp.q || "";
  const industry = sp.industry || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const offset = (page - 1) * PAGE;

  const { rows, total } = searchCompanies({
    q: q || undefined,
    industry: industry || undefined,
    limit: PAGE,
    offset,
  });
  const industries = listIndustries();
  const stats = dbStats();

  const totalPages = Math.max(1, Math.ceil(total / PAGE));

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (industry) params.set("industry", industry);
    if (p !== 1) params.set("page", String(p));
    return `/explore${params.toString() ? "?" + params.toString() : ""}`;
  }

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /EXPLORE · {stats.total.toLocaleString()} ENTITIES</div>
      <h1 className="mt-2 text-3xl font-semibold">Universe Explorer</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Every public + private semiconductor and hardware company tracked by S&P CapIQ in the curated screen. Search by name, ticker, description; filter by industry classification.
      </p>

      {/* Filters */}
      <form method="get" action="/explore" className="mt-6 hairline bg-bg-1 p-3 flex flex-wrap items-center gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="search 54k companies — name, ticker, description…"
          className="flex-1 min-w-[260px] hairline bg-bg-2 px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <select name="industry" defaultValue={industry}
                className="hairline bg-bg-2 px-2 py-2 text-xs font-mono">
          <option value="">all industries ({industries.length})</option>
          {industries.map(i => (
            <option key={i.name} value={i.name}>{i.name} ({i.count.toLocaleString()})</option>
          ))}
        </select>
        <button type="submit"
                className="font-mono text-[10px] tracking-[0.2em] bg-accent text-bg px-4 py-2 hover:shadow-glow transition">
          QUERY
        </button>
        {(q || industry) && (
          <Link href="/explore" className="font-mono text-[10px] tracking-[0.2em] hairline px-3 py-2 hover:bg-bg-2">CLEAR</Link>
        )}
        <div className="font-mono text-[10px] text-ink-mute ml-auto">
          {total.toLocaleString()} matches · page {page}/{totalPages}
        </div>
      </form>

      {/* Table */}
      <div className="mt-4 hairline bg-bg-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="hairline-b bg-bg-2">
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">NAME</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">TICKER</th>
              <th className="px-3 py-2 text-right font-mono text-[10px] tracking-[0.2em] text-ink-mute">MCAP</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">COUNTRY</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">PRIMARY INDUSTRY</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">DESCRIPTION</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">CAPIQ ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="hairline-b hover:bg-bg-2 transition">
                <td className="px-3 py-2 align-top">
                  <Link href={`/explore/${r.sp_id}`} className="font-semibold hover:text-accent">{r.name}</Link>
                  {(() => {
                    const cid = findCuratedIdByName(r.name);
                    return cid ? (
                      <Link href={`/companies/${cid}`} title="curated company"
                            className="ml-1.5 text-accent text-xs hover:scale-110 inline-block">★</Link>
                    ) : null;
                  })()}
                  {r.status && r.status !== "Operating" && (
                    <span className="ml-2 font-mono text-[9px] text-ink-mute">[{r.status}]</span>
                  )}
                </td>
                <td className="px-3 py-2 align-top font-mono text-[11px]">{r.ticker?.split(":")[1] || r.ticker || <span className="text-ink-mute">—</span>}</td>
                <td className="px-3 py-2 align-top text-right font-mono text-[11px] text-accent">
                  {(r as any).market_cap_usd
                    ? ((r as any).market_cap_usd >= 1_000_000 ? `$${((r as any).market_cap_usd/1_000_000).toFixed(2)}T`
                       : (r as any).market_cap_usd >= 1000 ? `$${((r as any).market_cap_usd/1000).toFixed(1)}B`
                       : `$${(r as any).market_cap_usd.toFixed(0)}M`)
                    : <span className="text-ink-mute">—</span>}
                </td>
                <td className="px-3 py-2 align-top font-mono text-[10px] text-ink-dim">{(r as any).country || "—"}</td>
                <td className="px-3 py-2 align-top text-ink-dim">{r.primary_industry || "—"}</td>
                <td className="px-3 py-2 align-top text-ink-dim max-w-[380px]">
                  <span className="line-clamp-2">{r.description || "—"}</span>
                </td>
                <td className="px-3 py-2 align-top font-mono text-[10px] text-ink-mute">{r.sp_id}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-ink-mute font-mono">no matches</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="font-mono text-[10px] text-ink-mute">
          showing {((page - 1) * PAGE + 1).toLocaleString()}–{Math.min(page * PAGE, total).toLocaleString()} of {total.toLocaleString()}
        </div>
        <div className="flex gap-1">
          <PageBtn href={pageHref(1)} disabled={page === 1}>« first</PageBtn>
          <PageBtn href={pageHref(page - 1)} disabled={page === 1}>‹ prev</PageBtn>
          <span className="hairline px-3 py-1.5 font-mono text-[10px] bg-bg-2">{page} / {totalPages}</span>
          <PageBtn href={pageHref(page + 1)} disabled={page === totalPages}>next ›</PageBtn>
          <PageBtn href={pageHref(totalPages)} disabled={page === totalPages}>last »</PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ href, disabled, children }: { href: string; disabled?: boolean; children: React.ReactNode }) {
  if (disabled) return <span className="hairline px-3 py-1.5 font-mono text-[10px] text-ink-mute opacity-40">{children}</span>;
  return <Link href={href} className="hairline px-3 py-1.5 font-mono text-[10px] hover:bg-accent hover:text-bg transition">{children}</Link>;
}
