import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyBySpId } from "@/lib/db";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SpCompanyPage({ params }: { params: Promise<{ spid: string }> }) {
  const { spid } = await params;
  const co = getCompanyBySpId(spid);
  if (!co) return notFound();

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="font-mono text-[10px] tracking-[0.3em] text-ink-mute">
        <Link href="/explore" className="hover:text-accent">/EXPLORE</Link> › <span>{co.sp_id}</span>
      </div>

      <header className="mt-3 hairline bracket bg-bg-1 p-6">
        <div className="font-mono text-[10px] tracking-[0.3em] text-accent">{co.primary_industry?.toUpperCase()}</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{co.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-mute">
          {co.ticker && <span>{co.ticker}</span>}
          <span>· CapIQ {co.sp_id}</span>
          {co.status && <span>· {co.status}</span>}
        </div>
        {co.website && (
          <a href={co.website.startsWith("http") ? co.website : `https://${co.website}`}
             target="_blank" rel="noreferrer"
             className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            {co.website} <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </header>

      {co.description && (
        <section className="mt-5 hairline bg-bg-1 p-5">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">// BUSINESS DESCRIPTION</div>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{co.description}</p>
        </section>
      )}

      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="INDUSTRY CLASSIFICATION">
          <Row k="Primary Industry" v={co.primary_industry} />
          <Row k="Industry Group" v={co.industry} />
          <Row k="Sector L2" v={co.sector_l2} />
          <Row k="Sector L1" v={co.sector_l1} />
        </Card>
        <Card title="IDENTIFIERS">
          <Row k="S&P CapIQ ID" v={co.sp_id} mono />
          <Row k="Ticker" v={co.ticker} mono />
          <Row k="Status" v={co.status} />
          <Row k="Source" v={co.source} mono />
        </Card>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="hairline bg-bg-1 p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">// {title}</div>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}
function Row({ k, v, mono }: { k: string; v: any; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <dt className="text-ink-mute">{k}</dt>
      <dd className={`text-ink text-right ${mono ? "font-mono" : ""}`}>{v ?? <span className="text-ink-mute">—</span>}</dd>
    </div>
  );
}
