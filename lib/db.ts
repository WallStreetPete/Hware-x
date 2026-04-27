import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = path.join(process.cwd(), "data", "hwarex.db");

let _db: Database.Database | null = null;

export function db(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("synchronous = NORMAL");
  _db.pragma("foreign_keys = ON");
  init(_db);
  return _db;
}

function init(d: Database.Database) {
  // Master companies table — stable IDs from S&P CapIQ.
  // sp_id is the source-of-truth identifier for any S&P-imported company.
  // For curated entries (from /lib/data/companies.ts) we store sp_id = null and use an internal slug.
  d.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      sp_id           TEXT UNIQUE,                 -- CapIQ SP_ENTITY_ID, e.g. "5466834"
      slug            TEXT UNIQUE,                 -- internal slug fallback / curated companies
      name            TEXT NOT NULL,
      ticker          TEXT,
      website         TEXT,
      status          TEXT,                        -- "Operating" / "Acquired" / etc.
      industry        TEXT,                        -- MI_INDUSTRY_CLASSIFICATION
      primary_industry TEXT,                       -- MI_PRIMARY_INDUSTRY
      sector_l1       TEXT,                        -- MI_LEVEL_1_PRIMARY
      sector_l2       TEXT,                        -- MI_LEVEL_2_PRIMARY
      description     TEXT,                        -- SP_BUSINESS_DESCRIPTION
      country         TEXT,                        -- SP_COUNTRY_NAME (added 2026-04-26)
      geography       TEXT,                        -- SP_GEOGRAPHY (added 2026-04-26)
      address         TEXT,                        -- SP_ADDRESS1 (added 2026-04-26)
      market_cap_usd  REAL,                        -- SP_MARKETCAP USD millions, FY0 (added 2026-04-26)
      tev_usd         REAL,                        -- IQ_TEV USD millions, FY0
      revenue_usd     REAL,                        -- IQ_TOTAL_REV USD millions, FY0
      ebitda_usd      REAL,                        -- IQ_EBITDA USD millions, FY0
      ebitda_margin   REAL,                        -- IQ_EBITDA_MARGIN percent
      tev_ebitda      REAL,                        -- IQ_TEV_EBITDA multiple, LTM
      financials_at   TEXT,                        -- when these financials last updated
      source          TEXT NOT NULL,               -- 'sp' | 'curated' | 'manual'
      created_at      TEXT DEFAULT (datetime('now')),
      updated_at      TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_companies_name      ON companies(name);
    CREATE INDEX IF NOT EXISTS idx_companies_industry  ON companies(primary_industry);
    CREATE INDEX IF NOT EXISTS idx_companies_status    ON companies(status);
    CREATE INDEX IF NOT EXISTS idx_companies_ticker    ON companies(ticker);`);

  // Idempotent column adds for pre-existing DBs (SQLite has no IF NOT EXISTS for ALTER TABLE).
  const existingCols = new Set(
    (d.prepare("PRAGMA table_info(companies)").all() as any[]).map(r => r.name)
  );
  const ensureCol = (name: string, decl: string) => {
    if (!existingCols.has(name)) d.exec(`ALTER TABLE companies ADD COLUMN ${name} ${decl}`);
  };
  ensureCol("country", "TEXT");
  ensureCol("geography", "TEXT");
  ensureCol("address", "TEXT");
  ensureCol("market_cap_usd", "REAL");
  ensureCol("tev_usd", "REAL");
  ensureCol("revenue_usd", "REAL");
  ensureCol("ebitda_usd", "REAL");
  ensureCol("ebitda_margin", "REAL");
  ensureCol("tev_ebitda", "REAL");
  ensureCol("financials_at", "TEXT");

  d.exec(`CREATE INDEX IF NOT EXISTS idx_companies_marketcap ON companies(market_cap_usd DESC);
    CREATE INDEX IF NOT EXISTS idx_companies_country   ON companies(country);

    -- Optional FTS5 virtual table for fast text search across name + description
    CREATE VIRTUAL TABLE IF NOT EXISTS companies_fts USING fts5(
      name, ticker, description, primary_industry,
      content='companies', content_rowid='id', tokenize = 'porter unicode61'
    );

    CREATE TRIGGER IF NOT EXISTS companies_ai AFTER INSERT ON companies BEGIN
      INSERT INTO companies_fts(rowid, name, ticker, description, primary_industry)
      VALUES (new.id, new.name, new.ticker, new.description, new.primary_industry);
    END;
    CREATE TRIGGER IF NOT EXISTS companies_ad AFTER DELETE ON companies BEGIN
      INSERT INTO companies_fts(companies_fts, rowid, name, ticker, description, primary_industry)
      VALUES ('delete', old.id, old.name, old.ticker, old.description, old.primary_industry);
    END;
    CREATE TRIGGER IF NOT EXISTS companies_au AFTER UPDATE ON companies BEGIN
      INSERT INTO companies_fts(companies_fts, rowid, name, ticker, description, primary_industry)
      VALUES ('delete', old.id, old.name, old.ticker, old.description, old.primary_industry);
      INSERT INTO companies_fts(rowid, name, ticker, description, primary_industry)
      VALUES (new.id, new.name, new.ticker, new.description, new.primary_industry);
    END;

    -- Enrichment products table (populated by scripts/gap-finder.ts)
    CREATE TABLE IF NOT EXISTS db_products (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_sp_id  TEXT,
      vendor_name   TEXT,
      category      TEXT NOT NULL,        -- 'gpu','cpu','memory','switch','storage','cooling','energy','fiber','transceiver'
      name          TEXT NOT NULL,
      released      TEXT,
      specs_json    TEXT,                 -- JSON blob: {process,memory,bandwidth,tdp,perfFp8,...}
      msrp_usd      REAL,
      source_url    TEXT,
      source        TEXT NOT NULL,        -- 'exa','firecrawl','claude','manual'
      confidence    REAL DEFAULT 0.5,
      created_at    TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_products_cat    ON db_products(category);
    CREATE INDEX IF NOT EXISTS idx_products_vendor ON db_products(vendor_name);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_products_uniq ON db_products(category, vendor_name, name);

    -- Persisted Claude-written enrichments for curated companies (overlays the static TS data)
    CREATE TABLE IF NOT EXISTS curated_enrichments (
      curated_id  TEXT PRIMARY KEY,
      long_desc   TEXT,
      moat        TEXT,
      risk        TEXT,
      brief       TEXT,
      source      TEXT NOT NULL DEFAULT 'claude',
      updated_at  TEXT DEFAULT (datetime('now'))
    );

    -- Agent run log
    CREATE TABLE IF NOT EXISTS agent_runs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at  TEXT DEFAULT (datetime('now')),
      finished_at TEXT,
      action      TEXT,
      result      TEXT,
      exa_calls   INTEGER DEFAULT 0,
      fc_calls    INTEGER DEFAULT 0,
      claude_calls INTEGER DEFAULT 0
    );
  `);
}

export function logAgentRun(action: string, result: string, exa: number, fc: number, claude: number) {
  db().prepare(`INSERT INTO agent_runs (finished_at, action, result, exa_calls, fc_calls, claude_calls)
    VALUES (datetime('now'), ?, ?, ?, ?, ?)`).run(action, result, exa, fc, claude);
}

export function insertProduct(p: {
  vendor_sp_id?: string | null; vendor_name: string; category: string; name: string;
  released?: string | null; specs_json?: string | null; msrp_usd?: number | null;
  source_url?: string | null; source: string; confidence?: number;
}) {
  return db().prepare(`
    INSERT OR IGNORE INTO db_products
      (vendor_sp_id, vendor_name, category, name, released, specs_json, msrp_usd, source_url, source, confidence)
    VALUES (@vendor_sp_id, @vendor_name, @category, @name, @released, @specs_json, @msrp_usd, @source_url, @source, @confidence)
  `).run({
    vendor_sp_id: p.vendor_sp_id ?? null,
    released: p.released ?? null,
    specs_json: p.specs_json ?? null,
    msrp_usd: p.msrp_usd ?? null,
    source_url: p.source_url ?? null,
    confidence: p.confidence ?? 0.6,
    ...p,
  } as any);
}

export function productsByCategory(category: string, limit = 500) {
  return db().prepare(`SELECT * FROM db_products WHERE category = ? ORDER BY name LIMIT ?`).all(category, limit);
}

export function productCounts() {
  return db().prepare(`SELECT category, COUNT(*) AS c FROM db_products GROUP BY category ORDER BY c DESC`).all();
}

export type CuratedEnrichment = {
  curated_id: string; long_desc: string | null; moat: string | null; risk: string | null;
  brief: string | null; updated_at: string;
};

export function getCuratedEnrichment(id: string): CuratedEnrichment | null {
  return db().prepare("SELECT * FROM curated_enrichments WHERE curated_id = ?").get(id) as CuratedEnrichment | null;
}

export function upsertCuratedEnrichment(e: { curated_id: string; long_desc?: string | null; moat?: string | null; risk?: string | null; brief?: string | null; }) {
  return db().prepare(`
    INSERT INTO curated_enrichments (curated_id, long_desc, moat, risk, brief, updated_at)
    VALUES (@curated_id, @long_desc, @moat, @risk, @brief, datetime('now'))
    ON CONFLICT(curated_id) DO UPDATE SET
      long_desc = COALESCE(excluded.long_desc, curated_enrichments.long_desc),
      moat      = COALESCE(excluded.moat,      curated_enrichments.moat),
      risk      = COALESCE(excluded.risk,      curated_enrichments.risk),
      brief     = COALESCE(excluded.brief,     curated_enrichments.brief),
      updated_at= datetime('now')
  `).run({
    long_desc: e.long_desc ?? null,
    moat: e.moat ?? null,
    risk: e.risk ?? null,
    brief: e.brief ?? null,
    ...e,
  } as any);
}

export function curatedEnrichmentCount(): number {
  return (db().prepare("SELECT COUNT(*) AS c FROM curated_enrichments").get() as any).c;
}

// ── Public query helpers ─────────────────────────────────────

export type DbCompany = {
  id: number;
  sp_id: string | null;
  slug: string | null;
  name: string;
  ticker: string | null;
  website: string | null;
  status: string | null;
  industry: string | null;
  primary_industry: string | null;
  sector_l1: string | null;
  sector_l2: string | null;
  description: string | null;
  country: string | null;
  geography: string | null;
  address: string | null;
  market_cap_usd: number | null;
  tev_usd: number | null;
  revenue_usd: number | null;
  ebitda_usd: number | null;
  ebitda_margin: number | null;
  tev_ebitda: number | null;
  source: string;
};

// Top N companies by market_cap_usd, optionally filtered by primary_industry list.
export function topByMarketCap(opts: { industries?: string[]; limit?: number; usOnly?: boolean } = {}): DbCompany[] {
  const limit = Math.min(opts.limit ?? 1000, 5000);
  const conds: string[] = ["market_cap_usd IS NOT NULL", "market_cap_usd > 0", "status = 'Operating'"];
  const args: any[] = [];
  if (opts.industries && opts.industries.length > 0) {
    conds.push(`primary_industry IN (${opts.industries.map(() => "?").join(",")})`);
    args.push(...opts.industries);
  }
  if (opts.usOnly) {
    conds.push("country = 'USA'");
  }
  const sql = `SELECT * FROM companies WHERE ${conds.join(" AND ")} ORDER BY market_cap_usd DESC LIMIT ?`;
  return db().prepare(sql).all(...args, limit) as DbCompany[];
}

// Top US companies (public + private) ranked by COALESCE(market_cap, revenue * 3).
// Both columns are in millions of USD post-normalization. Revenue × 3 is a rough
// size-parity multiple bridging private revenue → public-cap-equivalent.
// Private companies (no market_cap) keep market_cap_usd = null in the result so
// the UI can render "PRIVATE · $XB rev" instead of fabricating a market cap.
export function topUSAll(opts: { limit?: number } = {}): DbCompany[] {
  const limit = Math.min(opts.limit ?? 2000, 5000);
  const sql = `
    SELECT * FROM companies
    WHERE country = 'USA'
      AND status = 'Operating'
      AND (market_cap_usd > 0 OR revenue_usd > 0)
    ORDER BY COALESCE(market_cap_usd, revenue_usd * 3) DESC
    LIMIT ?
  `;
  return db().prepare(sql).all(limit) as DbCompany[];
}

export function financialsCoverage() {
  const r = db().prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN market_cap_usd IS NOT NULL THEN 1 ELSE 0 END) AS with_marketcap,
      SUM(CASE WHEN revenue_usd IS NOT NULL THEN 1 ELSE 0 END) AS with_revenue,
      SUM(CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END) AS with_country
    FROM companies
  `).get() as any;
  return r;
}

export function searchCompanies(opts: {
  q?: string;
  industry?: string;
  status?: string;
  source?: string;
  limit?: number;
  offset?: number;
}): { rows: DbCompany[]; total: number } {
  const { q, industry, status, source } = opts;
  const limit = Math.min(opts.limit ?? 50, 500);
  const offset = opts.offset ?? 0;

  const conds: string[] = [];
  const args: any[] = [];

  if (industry) { conds.push("primary_industry = ?"); args.push(industry); }
  if (status)   { conds.push("status = ?");           args.push(status); }
  if (source)   { conds.push("source = ?");           args.push(source); }

  let baseFrom = "FROM companies";
  if (q && q.trim()) {
    // FTS5 match — escape special chars
    const term = q.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean).map(t => t + "*").join(" ");
    if (term) {
      baseFrom = "FROM companies JOIN companies_fts ON companies.id = companies_fts.rowid AND companies_fts MATCH ?";
      args.unshift(term);
    }
  }

  const where = conds.length ? " WHERE " + conds.join(" AND ") : "";
  const totalRow = db().prepare(`SELECT COUNT(*) AS c ${baseFrom}${where}`).get(...args) as any;

  const rows = db().prepare(
    `SELECT companies.* ${baseFrom}${where} ORDER BY name COLLATE NOCASE LIMIT ? OFFSET ?`
  ).all(...args, limit, offset) as DbCompany[];

  return { rows, total: totalRow.c };
}

export function getCompanyBySpId(spId: string): DbCompany | null {
  return db().prepare("SELECT * FROM companies WHERE sp_id = ?").get(spId) as DbCompany | null;
}

export function getCompanyById(id: number): DbCompany | null {
  return db().prepare("SELECT * FROM companies WHERE id = ?").get(id) as DbCompany | null;
}

export function listIndustries(): { name: string; count: number }[] {
  return db().prepare(
    "SELECT primary_industry AS name, COUNT(*) AS count FROM companies WHERE primary_industry IS NOT NULL GROUP BY primary_industry ORDER BY count DESC"
  ).all() as any;
}

// Top N S&P companies whose primary_industry is in the given list.
// Public companies (with ticker) come first as a market-cap proxy; rest alphabetical.
// Excludes companies already in the curated set (matched by name) so this is purely
// "more from this sector" rather than duplicating curated entries.
export function topSpByIndustries(industries: string[], excludeNames: Set<string>, limit = 100): DbCompany[] {
  if (industries.length === 0) return [];
  const placeholders = industries.map(() => "?").join(",");
  const rows = db().prepare(`
    SELECT * FROM companies
    WHERE primary_industry IN (${placeholders})
      AND status = 'Operating'
    ORDER BY (CASE WHEN ticker IS NOT NULL AND ticker != '' THEN 0 ELSE 1 END),
             name COLLATE NOCASE
    LIMIT ?
  `).all(...industries, limit + excludeNames.size) as DbCompany[];
  // Filter out curated duplicates after the LIMIT (small N so fine).
  return rows.filter(r => !excludeNames.has(r.name.toLowerCase())).slice(0, limit);
}

export function dbStats() {
  const total = (db().prepare("SELECT COUNT(*) AS c FROM companies").get() as any).c;
  const bySource = db().prepare("SELECT source, COUNT(*) AS c FROM companies GROUP BY source").all() as any[];
  const byStatus = db().prepare("SELECT status, COUNT(*) AS c FROM companies WHERE status IS NOT NULL GROUP BY status").all() as any[];
  return { total, bySource, byStatus };
}

// ── Bulk upsert used by ingest ───────────────────────────────

export function upsertCompanies(rows: Array<Omit<DbCompany, "id">>) {
  const stmt = db().prepare(`
    INSERT INTO companies
      (sp_id, slug, name, ticker, website, status, industry, primary_industry, sector_l1, sector_l2, description, source, updated_at)
    VALUES
      (@sp_id, @slug, @name, @ticker, @website, @status, @industry, @primary_industry, @sector_l1, @sector_l2, @description, @source, datetime('now'))
    ON CONFLICT(sp_id) DO UPDATE SET
      name = excluded.name,
      ticker = excluded.ticker,
      website = excluded.website,
      status = excluded.status,
      industry = excluded.industry,
      primary_industry = excluded.primary_industry,
      sector_l1 = excluded.sector_l1,
      sector_l2 = excluded.sector_l2,
      description = excluded.description,
      updated_at = datetime('now')
  `);
  const tx = db().transaction((xs: any[]) => {
    for (const r of xs) stmt.run(r);
  });
  tx(rows);
}
