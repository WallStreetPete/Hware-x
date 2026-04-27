"use client";
import { useState } from "react";
import { logoFor, faviconFor } from "@/lib/data/domains";

export default function Logo({ companyId, size = 24, className = "" }: { companyId: string; size?: number; className?: string }) {
  const initial = logoFor(companyId);
  const [src, setSrc] = useState<string | null>(initial);
  const [stage, setStage] = useState<"clearbit" | "favicon" | "fallback">("clearbit");

  if (!src) {
    return <Fallback id={companyId} size={size} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size, objectFit: "contain" }}
      className={`rounded-sm bg-bg-2 p-0.5 ${className}`}
      onError={() => {
        if (stage === "clearbit") {
          const fav = faviconFor(companyId);
          if (fav) { setSrc(fav); setStage("favicon"); return; }
        }
        setSrc(null); setStage("fallback");
      }}
    />
  );
}

function Fallback({ id, size, className }: { id: string; size: number; className: string }) {
  const letter = (id[0] || "?").toUpperCase();
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      className={`flex items-center justify-center rounded-sm bg-bg-3 text-ink font-mono font-bold ${className}`}
    >
      {letter}
    </div>
  );
}
