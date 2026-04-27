"use client";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2, MessageSquare } from "lucide-react";

const STARTERS = [
  "What's the chokepoint in HBM supply for 2026?",
  "Walk me through how a Blackwell GPU is built — from sand to package.",
  "Compare CoreWeave vs Lambda vs Crusoe.",
  "Who actually wins if Stargate hits $500B?",
  "Why is ASML the most strategic company on Earth?",
  "Map the second-order beneficiaries of NVIDIA's growth.",
];

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: "/api/chat" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CHAT</div>
      <h1 className="mt-2 text-3xl font-semibold">Ask the AI Infra Analyst</h1>
      <p className="mt-1 text-sm text-ink-dim">Powered by Claude, grounded in HWARE-X's curated dataset of {`{sectors, companies, tech primers}`}.</p>

      {messages.length === 0 && (
        <div className="mt-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ink-mute mb-3">// SUGGESTED PROMPTS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STARTERS.map(s => (
              <button key={s}
                onClick={() => handleInputChange({ target: { value: s } } as any)}
                className="text-left hairline bg-bg-1 hover:bg-bg-2 p-3 text-sm transition group">
                <MessageSquare className="inline h-3 w-3 text-accent mr-2" />
                <span className="text-ink-dim group-hover:text-ink">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-5">
        {messages.map(m => (
          <div key={m.id} className={`hairline p-4 ${m.role === "user" ? "bg-bg-2" : "bg-bg-1 bracket"}`}>
            <div className="font-mono text-[9px] tracking-[0.3em] mb-2" style={{ color: m.role === "user" ? "#a1a1aa" : "#ff2a2a" }}>
              {m.role === "user" ? "// YOU" : "// HWARE-X · CLAUDE"}
            </div>
            <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-accent font-mono">
            <Loader2 className="h-3 w-3 animate-spin" /> thinking…
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-4 mt-8">
        <div className="hairline bg-bg-2 flex items-center gap-2 p-2 shadow-glow-sm">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="ask about anything in AI infrastructure…"
            className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-ink-mute focus:outline-none"
          />
          <button type="submit" disabled={!input || isLoading}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] bg-accent text-bg px-4 py-2 hover:shadow-glow disabled:opacity-40 transition">
            SEND <Send className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
