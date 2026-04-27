import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COMPANIES } from "./data/companies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtUSD(b?: number) {
  if (b == null) return "—";
  if (b >= 1000) return `$${(b / 1000).toFixed(2)}T`;
  if (b >= 1) return `$${b.toFixed(b >= 100 ? 0 : 1)}B`;
  return `$${(b * 1000).toFixed(0)}M`;
}

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Build a normalized-name → curated id index for fuzzy vendor matching.
// E.g. "NVIDIA Corporation" → "nvidia"; "AMD Inc." → "amd".
let _curatedNameIndex: Map<string, string> | null = null;
function normalizeName(s: string): string {
  return s.toLowerCase()
    .replace(/\b(corp|corporation|inc|ltd|limited|co|company|sa|ag|nv|llc|holdings|group|technologies|tech|sk\s|systems)\b\.?/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function buildCuratedNameIndex(): Map<string, string> {
  if (_curatedNameIndex) return _curatedNameIndex;
  const m = new Map<string, string>();
  for (const c of COMPANIES) {
    m.set(normalizeName(c.name), c.id);
    m.set(c.id, c.id); // also match by id
    if (c.ticker) m.set(c.ticker.toLowerCase(), c.id);
  }
  _curatedNameIndex = m;
  return m;
}
export function findCuratedIdByName(rawName: string): string | null {
  if (!rawName) return null;
  const idx = buildCuratedNameIndex();
  const n = normalizeName(rawName);
  if (idx.has(n)) return idx.get(n)!;
  // try first word
  const first = n.split(" ")[0];
  if (first && idx.has(first)) return idx.get(first)!;
  return null;
}
