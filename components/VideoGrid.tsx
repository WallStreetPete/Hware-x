"use client";
import type { Video } from "@/lib/types";
import { Play } from "lucide-react";

function ytId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,15})/);
  return m ? m[1] : null;
}

export default function VideoGrid({ videos, label = "VIDEOS" }: { videos: Video[]; label?: string }) {
  if (!videos || videos.length === 0) return null;
  return (
    <section className="hairline bg-bg-1 p-5">
      <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// {label}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map(v => {
          const id = ytId(v.url);
          const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
          return (
            <a key={v.url} href={v.url} target="_blank" rel="noreferrer"
               className="group hairline bg-bg-2 hover:bg-bg-3 transition overflow-hidden">
              <div className="relative aspect-video bg-bg-3 flex items-center justify-center overflow-hidden">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={v.title}
                       className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                ) : (
                  <Play className="h-8 w-8 text-accent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                <Play className="absolute h-10 w-10 text-accent drop-shadow-[0_0_10px_rgba(255,42,42,0.5)] opacity-90 group-hover:scale-110 transition" />
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-ink group-hover:text-accent line-clamp-2">{v.title}</div>
                {v.channel && <div className="font-mono text-[10px] text-ink-mute mt-1">{v.channel}</div>}
                {v.note && <div className="text-[11px] text-ink-dim mt-1">{v.note}</div>}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
