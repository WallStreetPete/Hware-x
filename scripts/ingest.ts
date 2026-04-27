/**
 * Ingest an S&P Global / CapIQ xlsx export into the local SQLite database.
 *
 * Auto-detects two file shapes:
 *   1. "Profile" — SP_ENTITY_NAME + MI_INDUSTRY_CLASSIFICATION + SP_BUSINESS_DESCRIPTION + ...
 *   2. "Financials/Location" — SP_ENTITY_NAME + SP_GEOGRAPHY + SP_COUNTRY_NAME + SP_MARKETCAP + IQ_TOTAL_REV + ...
 *
 * Usage:
 *   npx tsx scripts/ingest.ts <path-to.xlsx>      # specific file
 *   npx tsx scripts/ingest.ts                     # ingests ALL SPGlobal_Export*.xlsx in cwd
 *
 * Idempotent — re-running upserts by sp_id. Empty fields don't overwrite existing data.
 */

import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";
// `db` and `dbStats` from lib/db (db() lazily creates schema + applies migrations)
import { db, dbStats } from "../lib/db";

type RawRow = Record<string, any>;

// All known columns we may pull from any export shape:
const HEADER_ALIAS: Record<string, string[]> = {
  // Profile shape
  name:             ["SP_ENTITY_NAME"],
  sp_id:            ["SP_ENTITY_ID"],
  industry:         ["MI_INDUSTRY_CLASSIFICATION"],
  primary_industry: ["MI_PRIMARY_INDUSTRY"],
  sector_l1:        ["MI_LEVEL_1_PRIMARY"],
  sector_l2:        ["MI_LEVEL_2_PRIMARY"],
  description:      ["SP_BUSINESS_DESCRIPTION"],
  website:          ["SP_WEBSITE"],
  status:           ["SP_COMPANY_STATUS"],
  ticker:           ["SP_EXCHANGE_TICKER"],
  // Location/Financials shape
  country:          ["SP_COUNTRY_NAME"],
  geography:        ["SP_GEOGRAPHY"],
  address:          ["SP_ADDRESS1"],
  market_cap_usd:   ["SP_MARKETCAP"],
  tev_usd:          ["IQ_TEV"],
  revenue_usd:      ["IQ_TOTAL_REV"],
  ebitda_usd:       ["IQ_EBITDA"],
  ebitda_margin:    ["IQ_EBITDA_MARGIN"],
  tev_ebitda:       ["IQ_TEV_EBITDA"],
};

// Fields stored as REAL in the DB. CapIQ exports use "NA" for missing values.
const NUMERIC_FIELDS = new Set([
  "market_cap_usd", "tev_usd", "revenue_usd", "ebitda_usd", "ebitda_margin", "tev_ebitda",
]);

// CapIQ exports use mixed units across columns. Normalize everything to MILLIONS of USD
// to match market_cap_usd. IQ_TOTAL_REV and IQ_EBITDA come in thousands, so /1000.
// IQ_TEV is already in millions like SP_MARKETCAP. Margins and ratios are unitless.
const SCALE_FACTOR: Record<string, number> = {
  revenue_usd: 1 / 1000,
  ebitda_usd:  1 / 1000,
};

function pickRow(r: RawRow) {
  const out: Record<string, any> = {};
  for (const [k, aliases] of Object.entries(HEADER_ALIAS)) {
    for (const a of aliases) {
      const v = r[a];
      if (v == null) continue;
      const s = String(v).trim();
      if (s === "" || s === "NA" || s === "NM" || s === "-") continue;
      if (NUMERIC_FIELDS.has(k)) {
        const n = Number(s.replace(/,/g, ""));
        if (Number.isFinite(n)) {
          out[k] = SCALE_FACTOR[k] != null ? n * SCALE_FACTOR[k] : n;
          break;
        }
      } else {
        out[k] = s; break;
      }
    }
  }
  return out;
}

function findSourceFiles(): string[] {
  const argFile = process.argv[2];
  if (argFile) return [path.resolve(argFile)];
  const matches = fs.readdirSync(process.cwd()).filter(f => /^SPGlobal_Export.*\.xlsx$/i.test(f));
  if (matches.length === 0) {
    console.error("No SPGlobal_Export*.xlsx found in cwd. Pass a path explicitly.");
    process.exit(1);
  }
  // oldest first so newer files overwrite older where they have same fields
  matches.sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
  return matches.map(m => path.resolve(m));
}

// Partial upsert — only sets non-null columns. Inserts a stub row if sp_id doesn't exist yet.
function partialUpsert(rows: Array<Record<string, any> & { sp_id: string; name: string }>) {
  const allCols = ["sp_id","name","ticker","website","status","industry","primary_industry","sector_l1","sector_l2","description",
                   "country","geography","address","market_cap_usd","tev_usd","revenue_usd","ebitda_usd","ebitda_margin","tev_ebitda"];

  const insertStub = db().prepare(`INSERT OR IGNORE INTO companies (sp_id, name, source) VALUES (?, ?, 'sp')`);
  const updateStmts: Record<string, any> = {};
  for (const col of allCols) {
    if (col === "sp_id" || col === "name") continue;
    updateStmts[col] = db().prepare(`UPDATE companies SET ${col} = ?, updated_at = datetime('now') WHERE sp_id = ?`);
  }
  // For financial rows, also stamp financials_at when a financial col is set.
  const stampFinancials = db().prepare(`UPDATE companies SET financials_at = datetime('now') WHERE sp_id = ?`);

  const tx = db().transaction((xs: any[]) => {
    for (const r of xs) {
      insertStub.run(r.sp_id, r.name);
      let touchedFinancials = false;
      for (const col of allCols) {
        if (col === "sp_id" || col === "name") {
          if (col === "name" && r.name) {
            db().prepare(`UPDATE companies SET name = ? WHERE sp_id = ?`).run(r.name, r.sp_id);
          }
          continue;
        }
        if (r[col] != null) {
          updateStmts[col].run(r[col], r.sp_id);
          if (NUMERIC_FIELDS.has(col)) touchedFinancials = true;
        }
      }
      if (touchedFinancials) stampFinancials.run(r.sp_id);
    }
  });
  tx(rows);
}

function ingestFile(file: string) {
  console.log(`[ingest] reading ${file} (${(fs.statSync(file).size / 1024 / 1024).toFixed(1)} MB)`);

  const wb = XLSX.readFile(file);
  const sheetName = wb.SheetNames.find(n => /sheet1|companies|export/i.test(n)) || wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  console.log(`[ingest] sheet: ${sheetName}`);

  const ref = ws["!ref"];
  if (!ref) throw new Error("empty sheet");
  const range = XLSX.utils.decode_range(ref);

  let headerRow = -1;
  for (let r = range.s.r; r <= Math.min(range.s.r + 30, range.e.r); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell && String(cell.v).trim() === "SP_ENTITY_NAME") { headerRow = r; break; }
    }
    if (headerRow >= 0) break;
  }
  if (headerRow < 0) throw new Error("header SP_ENTITY_NAME not found in first 30 rows");
  console.log(`[ingest] header at row ${headerRow + 1}`);

  const all: RawRow[] = XLSX.utils.sheet_to_json(ws, { range: headerRow, defval: null, raw: true });
  console.log(`[ingest] parsed ${all.length} raw rows`);

  const cleaned = all
    .map(pickRow)
    .filter(r => r.name && r.sp_id) as Array<Record<string, any> & { sp_id: string; name: string }>;

  console.log(`[ingest] upserting ${cleaned.length} valid rows…`);
  const t0 = Date.now();
  const CHUNK = 5000;
  for (let i = 0; i < cleaned.length; i += CHUNK) {
    partialUpsert(cleaned.slice(i, i + CHUNK));
    console.log(`[ingest]   upserted ${Math.min(i + CHUNK, cleaned.length)} / ${cleaned.length}`);
  }
  console.log(`[ingest] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

function main() {
  const files = findSourceFiles();
  console.log(`[ingest] ${files.length} file(s) queued (oldest first):`);
  for (const f of files) console.log(`  ${path.basename(f)}`);
  for (const f of files) ingestFile(f);
  const stats = dbStats();
  console.log("\n[ingest] DB stats:", JSON.stringify(stats, null, 2));

  // Show how many rows have financials now
  const fin = db().prepare(`SELECT
    SUM(CASE WHEN market_cap_usd IS NOT NULL THEN 1 ELSE 0 END) AS marketcap,
    SUM(CASE WHEN revenue_usd    IS NOT NULL THEN 1 ELSE 0 END) AS revenue,
    SUM(CASE WHEN country        IS NOT NULL THEN 1 ELSE 0 END) AS country
    FROM companies`).get();
  console.log("[ingest] financials coverage:", JSON.stringify(fin, null, 2));
}

main();
