"use client";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function SectorEssay({ sectorId, sectorName }: { sectorId: string; sectorName: string }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "sector", id: sectorId }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setText(data.text);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <section className="hairline bg-bg-1 p-5 bracket">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent">// ANALYST ESSAY · CLAUDE</div>
        {!text && !loading && (
          <button onClick={generate}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] border border-accent/50 text-accent px-3 py-1.5 hover:bg-accent hover:text-bg transition">
            <Sparkles className="h-3 w-3" /> WRITE ESSAY ON {sectorName.toUpperCase()}
          </button>
        )}
        {loading && <span className="flex items-center gap-2 text-xs text-accent"><Loader2 className="h-3 w-3 animate-spin" /> drafting…</span>}
      </div>
      {err && <div className="mt-3 text-xs text-accent">error: {err}</div>}
      {text && <div className="mt-4 text-sm text-ink leading-relaxed whitespace-pre-wrap">{text}</div>}
    </section>
  );
}
