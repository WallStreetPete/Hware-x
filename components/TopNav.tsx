"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, Boxes, Cpu, MessageSquare, Search, Layers, Globe, Map as MapIcon, TrendingUp, Flag } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "GOD'S-EYE", icon: Activity },
  { href: "/top", label: "TOP GLOBAL", icon: TrendingUp },
  { href: "/top?mode=us-all", label: "TOP US", icon: Flag },
  { href: "/map", label: "MAP", icon: MapIcon },
  { href: "/universe", label: "UNIVERSE", icon: Globe },
  { href: "/explore", label: "EXPLORE 54K", icon: Search },
  { href: "/sectors", label: "SECTORS", icon: Boxes },
  { href: "/catalog", label: "CATALOGS", icon: Layers },
  { href: "/tech", label: "TECH", icon: Cpu },
  { href: "/search", label: "SEARCH", icon: Search },
  { href: "/chat", label: "ASK", icon: MessageSquare },
  { href: "/agent", label: "AGENT", icon: Activity },
];

export default function TopNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 hairline-b bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-sm bg-accent shadow-glow-sm" />
            <div className="absolute inset-[3px] rounded-sm bg-bg" />
            <div className="absolute inset-[6px] rounded-sm bg-accent animate-pulse-slow" />
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm font-bold tracking-[0.25em] text-ink group-hover:text-accent transition-colors">HWARE<span className="text-accent">·</span>X</div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-ink-mute">AI INFRA · GOD'S-EYE</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] transition-all",
                  active
                    ? "bg-accent/10 text-accent shadow-glow-sm"
                    : "text-ink-dim hover:text-ink hover:bg-bg-2"
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-ink-mute">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow-sm animate-pulse" />
            LIVE · {new Date().getUTCFullYear()}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
