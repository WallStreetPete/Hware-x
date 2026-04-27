"use client";
import { useState } from "react";
import { Search, Loader2, ExternalLink, Sparkles } from "lucide-react";

type ExaResult = {
  title?: string; url: string; text?: string; summary?: string;
  publishedDate?: string; author?: string;
};

export default function DeepSearchPage() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"search" | "answer">("search");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExaResult[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function go(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setErr(null); setResults([]); setAnswer(null);
    try {
      const r = await fetch("/api/exa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, mode }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      if (mode === "answer") {
        setAnswer(data.answer || "");
        setResults(data.citations || []);
      } else {
        setResults(data.results || []);
      }
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /SEARCH · EXA</div>
      <h1 className="mt-2 text-3xl font-semibold">Deep Web Search</h1>
      <p className="mt-1 text-sm text-ink-dim">Neural search across the open web for primary sources beyond our curated dataset.</p>

      <form onSubmit={go} className="mt-6">
        <div className="hairline bg-bg-2 flex items-center gap-2 p-2 shadow-glow-sm">
          <Search className="h-4 w-4 text-accent ml-2" />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="e.g., 'TSMC CoWoS capacity 2026' or 'who builds Stargate?'"
            className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-ink-mute focus:outline-none"
          />
          <div className="flex gap-1 mr-1">
            <button type="button" onClick={() => setMode("search")}
                    className={`font-mono text-[10px] tracking-[0.2em] px-3 py-1.5 transition ${mode === "search" ? "bg-accent text-bg" : "text-ink-dim hover:text-ink"}`}>SEARCH</button>
            <button type="button" onClick={() => setMode("answer")}
                    className={`font-mono text-[10px] tracking-[0.2em] px-3 py-1.5 transition ${mode === "answer" ? "bg-accent text-bg" : "text-ink-dim hover:text-ink"}`}>ANSWER</button>
          </div>
          <button type="submit" disabled={loading}
                  className="font-mono text-[10px] tracking-[0.2em] border border-accent text-accent px-4 py-2 hover:bg-accent hover:text-bg disabled:opacity-40 transition">
            {loading ? "..." : "GO"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-xs text-accent font-mono">
          <Loader2 className="h-3 w-3 animate-spin" /> querying neural index…
        </div>
      )}
      {err && <div className="mt-6 text-xs text-accent">error: {err}</div>}

      {answer && (
        <section className="mt-8 hairline bg-bg-1 p-5 bracket">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-accent mb-3">
            <Sparkles className="h-3 w-3" /> // EXA ANSWER
          </div>
          <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{answer}</div>
        </section>
      )}

      {results.length > 0 && (
        <section className="mt-8 space-y-3">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ink-mute">// {results.length} RESULTS</div>
          {results.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer"
               className="block hairline bg-bg-1 hover:bg-bg-2 p-4 group transition">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink group-hover:text-accent truncate">{r.title || r.url}</div>
                  <div className="font-mono text-[10px] text-ink-mute mt-0.5 truncate">{r.url}</div>
                  {r.summary && <div className="text-xs text-ink-dim mt-2 leading-relaxed">{r.summary}</div>}
                  {!r.summary && r.text && <div className="text-xs text-ink-dim mt-2 leading-relaxed line-clamp-3">{r.text.slice(0, 320)}…</div>}
                </div>
                <ExternalLink className="h-3 w-3 text-ink-mute group-hover:text-accent flex-shrink-0 mt-1" />
              </div>
              {r.publishedDate && <div className="font-mono text-[9px] text-ink-mute mt-2">{new Date(r.publishedDate).toISOString().split("T")[0]}</div>}
            </a>
          ))}
        </section>
      )}

      {!loading && results.length === 0 && !answer && (
        <div className="mt-12 text-center font-mono text-[11px] text-ink-mute">
          enter a query · neural search · powered by exa.ai
        </div>
      )}
    </div>
  );
}
