import Link from "next/link";
import { ASSETS } from "@/lib/data/geo";
import MapClient from "./MapClient";

export default function MapPage() {
  return (
    <div className="relative">
      <section className="hairline-b px-6 pt-6 pb-4">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-accent glow-text">// /MAP · GEO LAYER</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                The <span className="text-accent">Geographic Universe</span>
              </h1>
              <p className="mt-1 text-sm text-ink-dim max-w-2xl">
                Every fab, data center, nuclear plant, mine, and gas field that powers AI infrastructure — toggle layers on the left.
              </p>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <Stat label="ASSETS" value={ASSETS.length.toLocaleString()} />
              <Link href="/" className="hairline px-3 py-1 hover:bg-accent hover:text-bg transition self-center">← GOD'S-EYE</Link>
            </div>
          </div>
        </div>
      </section>
      <MapClient />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[9px] tracking-[0.3em] text-ink-mute">{label}</div>
      <div className="text-xl text-accent glow-text">{value}</div>
    </div>
  );
}
