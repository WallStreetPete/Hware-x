"use client";
import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function CompanyAIBrief({ companyId, companyName }: { companyId: string; companyName: string; sectorName: string }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  // Pre-load DB-cached brief on mount so users see it without clicking generate.
  useEffect(() => {
    fetch(`/api/db/enrichment/${companyId}`).then(r => r.json()).then(d => {
      if (d.enrichment?.brief) { setText(d.enrichment.brief); setCached(true); }
    }).catch(() => {});
  }, [companyId]);

  async function generate() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "company", id: companyId }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setText(data.text);
    } catch (e: any) {
      setErr(e.message || "failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 hairline bg-bg-1 p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent">
          // AI ANALYST BRIEF · CLAUDE {cached && <span className="text-ink-mute ml-2">[CACHED]</span>}
        </div>
        {!text && !loading && (
          <button onClick={generate}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] border border-accent/50 text-accent px-3 py-1.5 hover:bg-accent hover:text-bg transition">
            <Sparkles className="h-3 w-3" /> GENERATE BRIEF ON {companyName.toUpperCase()}
          </button>
        )}
        {text && !loading && (
          <button onClick={() => { setText(null); setCached(false); generate(); }}
                  className="font-mono text-[10px] tracking-[0.2em] text-ink-mute hover:text-accent">
            REGENERATE
          </button>
        )}
        {loading && <span className="flex items-center gap-2 text-xs text-accent"><Loader2 className="h-3 w-3 animate-spin" /> drafting…</span>}
      </div>
      {err && <div className="mt-3 text-xs text-accent">error: {err}</div>}
      {text && (
        <div className="mt-3 text-sm text-ink leading-relaxed whitespace-pre-wrap">{text}</div>
      )}
    </section>
  );
}
