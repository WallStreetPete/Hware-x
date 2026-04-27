import Link from "next/link";
import { db, productCounts } from "@/lib/db";
import { findCuratedIdByName } from "@/lib/utils";
import Logo from "@/components/Logo";
import EnrichedFilter from "./EnrichedFilter";

export const dynamic = "force-dynamic";

export default async function EnrichedCatalog({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { category } = await searchParams;
  const counts = productCounts() as any[];
  const cats = counts.map(c => c.category);

  let rows: any[] = [];
  if (category) {
    rows = db().prepare("SELECT * FROM db_products WHERE category = ? ORDER BY vendor_name, name").all(category) as any[];
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG/ENRICHED · AGENT-DISCOVERED</div>
      <h1 className="mt-2 text-3xl font-semibold">Live Enriched Products</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Continuously expanded by the gap-finder loop using Exa + Claude. Every entry has provenance back to its source URL.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/catalog/enriched" className={`hairline px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] ${!category ? "bg-accent text-bg" : "hover:bg-bg-2"}`}>
          ALL CATEGORIES
        </Link>
        {counts.map((c: any) => (
          <Link key={c.category} href={`/catalog/enriched?category=${c.category}`}
                className={`hairline px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] ${category === c.category ? "bg-accent text-bg" : "hover:bg-bg-2"}`}>
            {c.category.toUpperCase()} ({c.c})
          </Link>
        ))}
      </div>

      {!category && (
        <>
          <div className="mt-6 hairline bg-bg-1 p-6">
            <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// SUMMARY</div>
            {counts.length === 0 ? (
              <p className="text-sm text-ink-dim">No enriched products yet — the agent loop hasn't found any. Run <code className="font-mono text-accent">npx tsx scripts/gap-finder.ts</code> manually to seed.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {counts.map((c: any) => (
                  <Link key={c.category} href={`/catalog/enriched?category=${c.category}`} className="hairline bg-bg-2 hover:bg-bg-3 p-4 transition">
                    <div className="font-mono text-[11px] text-ink-mute">{c.category.toUpperCase()}</div>
                    <div className="text-2xl text-accent glow-text mt-1">{c.c}</div>
                    <div className="font-mono text-[10px] text-ink-mute">products</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recently added across all categories */}
          {(() => {
            const recent = db().prepare("SELECT * FROM db_products ORDER BY id DESC LIMIT 24").all() as any[];
            if (recent.length === 0) return null;
            return (
              <div className="mt-6 hairline bg-bg-1">
                <div className="px-5 py-3 hairline-b">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// RECENTLY DISCOVERED · LAST 24</div>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-bg-2">
                    <tr className="hairline-b">
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">CATEGORY</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">VENDOR</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">PRODUCT</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">RELEASED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r: any) => {
                      const curatedId = findCuratedIdByName(r.vendor_name);
                      return (
                        <tr key={r.id} className="hairline-b hover:bg-bg-2 transition">
                          <td className="px-3 py-2">
                            <Link href={`/catalog/enriched?category=${r.category}`}
                                  className="font-mono text-[10px] tracking-[0.15em] text-accent hover:underline">{r.category.toUpperCase()}</Link>
                          </td>
                          <td className="px-3 py-2">
                            {curatedId
                              ? <Link href={`/companies/${curatedId}`} className="font-semibold hover:text-accent">{r.vendor_name}</Link>
                              : <span className="font-semibold">{r.vendor_name}</span>}
                          </td>
                          <td className="px-3 py-2 text-ink">{r.name}</td>
                          <td className="px-3 py-2 font-mono text-[10px] text-ink-mute">{r.released || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </>
      )}

      {category && (
        <div className="mt-6">
          <div className="mb-3"><EnrichedFilter /></div>
          <div className="hairline bg-bg-1">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-bg-2">
              <tr className="hairline-b">
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">VENDOR</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">PRODUCT</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">RELEASED</th>
                <th className="px-3 py-2 text-right font-mono text-[10px] tracking-[0.2em] text-ink-mute">MSRP</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">SPECS</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.2em] text-ink-mute">SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-ink-mute font-mono">no rows yet</td></tr>
              )}
              {rows.map(r => {
                const specs = r.specs_json ? JSON.parse(r.specs_json) : {};
                const curatedId = findCuratedIdByName(r.vendor_name);
                return (
                  <tr key={r.id} className="hairline-b hover:bg-bg-2 transition">
                    <td className="px-3 py-2 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        {curatedId && <Logo companyId={curatedId} size={18} />}
                        {curatedId
                          ? <Link href={`/companies/${curatedId}`} className="hover:text-accent">{r.vendor_name}</Link>
                          : r.vendor_name}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-ink-mute">{r.released || "—"}</td>
                    <td className="px-3 py-2 text-right font-mono text-accent">{r.msrp_usd ? `$${Number(r.msrp_usd).toLocaleString()}` : "—"}</td>
                    <td className="px-3 py-2 text-ink-dim text-[11px] max-w-[400px]">
                      {Object.entries(specs).slice(0, 6).map(([k, v]) => `${k}=${v}`).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px]">
                      {r.source_url ? <a href={r.source_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">link</a> : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
