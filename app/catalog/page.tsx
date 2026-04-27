import Link from "next/link";
import { SILICON } from "@/lib/data/catalog/silicon";
import { ENERGY } from "@/lib/data/catalog/energy";
import { FIBER } from "@/lib/data/catalog/fiber";
import { OPTICAL } from "@/lib/data/catalog/optical";
import { DATACENTERS } from "@/lib/data/catalog/datacenters";
import { SWITCHES } from "@/lib/data/catalog/switches";
import { STORAGE } from "@/lib/data/catalog/storage";
import { COOLING } from "@/lib/data/catalog/cooling";
import { Cpu, Zap, Cable, Network, Server, Database, Snowflake, Wifi, Sparkles } from "lucide-react";
import { productCounts } from "@/lib/db";

const CATALOGS = [
  { href: "/catalog/silicon",     icon: Cpu,       title: "Silicon Catalog",        sub: "Every GPU, CPU, AI accelerator, DPU, switch ASIC",       count: SILICON.length },
  { href: "/catalog/energy",      icon: Zap,       title: "Energy Providers",       sub: "Utilities, IPPs, nuclear, renewables, BESS, self-gen",  count: ENERGY.length },
  { href: "/catalog/fiber",       icon: Cable,     title: "Fiber & Telecom",        sub: "Carriers, cable makers, submarine, DCI optics",          count: FIBER.length },
  { href: "/catalog/optical",     icon: Wifi,      title: "Optical Transceivers",   sub: "100G → 1.6T pluggables + CPO",                            count: OPTICAL.length },
  { href: "/catalog/datacenters", icon: Server,    title: "Data Center Campuses",   sub: "Major operating + planned hyperscale builds",            count: DATACENTERS.length },
  { href: "/catalog/switches",    icon: Network,   title: "Network Switches",       sub: "AI fabric switches by ASIC and capacity",                count: SWITCHES.length },
  { href: "/catalog/storage",     icon: Database,  title: "Storage Products",       sub: "All-flash, QLC SSD, HDD, disaggregated, object",         count: STORAGE.length },
  { href: "/catalog/cooling",     icon: Snowflake, title: "Cooling Products",       sub: "DLC, immersion, RDHx, CDUs",                              count: COOLING.length },
];

export default function CatalogIndex() {
  const enrichedCount = (productCounts() as any[]).reduce((a, b) => a + b.c, 0);
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="font-mono text-[10px] tracking-[0.4em] text-accent">// /CATALOG</div>
      <h1 className="mt-2 text-3xl font-semibold">Product Catalogs</h1>
      <p className="mt-1 text-sm text-ink-dim max-w-3xl">
        Sortable, filterable tables of every product / asset that matters in AI infrastructure — chips, power, fiber, optics, cooling, switches, storage, and the data center campuses themselves.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link href="/catalog/enriched"
              className="group hairline bg-bg-1 hover:bg-bg-2 p-5 bracket transition border border-accent shadow-glow-sm">
          <div className="flex items-start justify-between">
            <Sparkles className="h-5 w-5 text-accent" />
            <div className="font-mono text-[10px] text-accent">{enrichedCount} LIVE</div>
          </div>
          <h2 className="mt-3 text-lg font-semibold group-hover:text-accent transition">Enriched (Agent Loop)</h2>
          <p className="mt-1 text-xs text-ink-dim leading-relaxed">Continuously expanded by the autonomous gap-finder using Exa + Claude. Provenance-tracked.</p>
        </Link>
        {CATALOGS.map(c => (
          <Link key={c.href} href={c.href}
                className="group hairline bg-bg-1 hover:bg-bg-2 p-5 bracket transition">
            <div className="flex items-start justify-between">
              <c.icon className="h-5 w-5 text-accent" />
              <div className="font-mono text-[10px] text-ink-mute">{c.count} ENTRIES</div>
            </div>
            <h2 className="mt-3 text-lg font-semibold group-hover:text-accent transition">{c.title}</h2>
            <p className="mt-1 text-xs text-ink-dim leading-relaxed">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
