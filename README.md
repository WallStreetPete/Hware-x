# HWARE-X

A god's-eye view of AI infrastructure — semis, fabs, HBM, fiber, optics, cooling, power, hyperscalers, neoclouds, frontier labs, and the capital funding it all.

## Run

```bash
npm install
npx tsx scripts/ingest.ts          # one-time: ingest S&P export → SQLite
npm run dev                         # http://localhost:3000 (or 3030 if 3000 is busy)
```

## Routes

| Route | Purpose |
|---|---|
| `/` | God's-eye graph of the **curated** ~150 hero companies, layered + draggable |
| `/top` | React Flow grid of top public companies by market cap. 3 modes via toggle: **GLOBAL** (1,000 worldwide) · **US PUBLIC** (1,000 US-listed) · **US ALL** (530 public + private US). Uniform 120×120 nodes with cached logos, grouped by industry. |
| `/map` | Geographic view of curated assets (fabs, data centers, undersea cables) on Leaflet |
| `/universe` | **All 54k+ S&P companies** clustered by industry; click to expand |
| `/explore` | Server-paginated, searchable table over the full SQLite (54k+) with MCAP and country |
| `/explore/[capiq-id]` | Full S&P company detail page with financials |
| `/sectors`, `/sectors/[id]` | Curated sector index + per-sector deep dives + AI essay + ratings + videos |
| `/companies/[id]` | Curated company deep dive |
| `/catalog` + 8 sub-routes | Sortable product catalogs (silicon, energy, fiber, optical, DCs, switches, storage, cooling) |
| `/tech`, `/tech/[id]` | Technology primers (semiconductor fab, EUV, HBM, CoWoS, SMRs, etc.) with YouTube videos |
| `/chat` | Claude analyst grounded in the curated dataset |
| `/search` | Exa neural web search |
| `/agent` | Autonomous gap-finder loop (Exa + Claude) for enriching the curated dataset |

## Data architecture

### Two parallel data layers

1. **Curated TS files** (`lib/data/*.ts`) — hand-authored, ~150 companies + tech primers + ratings + videos. Drives the god's-eye graph and the sector / tech / catalog pages.
2. **SQLite database** (`data/hwarex.db`) — bulk-ingested S&P CapIQ universe (54k+ companies). Drives `/universe` and `/explore`.

The two are **not yet linked**. Long-term, every curated entry should reference a CapIQ ID so the graphs can cross-pollinate.

### SQLite schema

File: `lib/db.ts`

```sql
CREATE TABLE companies (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  sp_id           TEXT UNIQUE,         -- S&P CapIQ SP_ENTITY_ID (the canonical key)
  slug            TEXT UNIQUE,         -- internal slug (used for curated rows)
  name            TEXT NOT NULL,
  ticker          TEXT,
  website         TEXT,
  status          TEXT,                -- "Operating" / "Acquired" / etc.
  industry        TEXT,                -- MI_INDUSTRY_CLASSIFICATION
  primary_industry TEXT,               -- MI_PRIMARY_INDUSTRY (used for /universe clusters)
  sector_l1       TEXT,                -- MI_LEVEL_1_PRIMARY
  sector_l2       TEXT,                -- MI_LEVEL_2_PRIMARY
  description     TEXT,                -- SP_BUSINESS_DESCRIPTION
  source          TEXT NOT NULL,       -- 'sp' | 'curated' | 'manual'
  -- Location + financials (from SPGlobal_Export_*_Location_Financials.xlsx)
  country         TEXT, geography TEXT, address TEXT,
  market_cap_usd  REAL,                -- in millions of USD
  tev_usd         REAL,                -- in millions of USD
  revenue_usd     REAL,                -- in millions of USD (normalized from CapIQ thousands)
  ebitda_usd      REAL,                -- in millions of USD (normalized from CapIQ thousands)
  ebitda_margin   REAL, tev_ebitda REAL,
  financials_at   TEXT,
  logo_at         TEXT,                -- timestamp set when /public/logos/<sp_id>.png is downloaded
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
```

**Important unit note**: CapIQ exports `market_cap` and `tev` in millions of USD but `revenue` and `ebitda` in *thousands*. The ingest script (`scripts/ingest.ts`) applies a `1/1000` scale factor to `revenue_usd` and `ebitda_usd` so everything in the DB is in millions. Pre-existing rows can be normalized one-shot via `npx tsx scripts/normalize-revenue-units.ts` (idempotent).

Plus an FTS5 virtual table `companies_fts` for fast text search across `name + ticker + description + primary_industry`.

### Identifiers

- **`sp_id`** is the canonical identifier for any company sourced from S&P CapIQ (e.g. `5466834`).
- **`slug`** is used only for hand-curated entries that don't have a CapIQ ID yet. To link a curated entry to its CapIQ row, populate the `sp_id` column manually.
- The internal `id` is an autoincrement convenience key — never use it as an external reference.

### Adding more S&P data

Drop any new `SPGlobal_Export*.xlsx` next to the existing one and run:

```bash
npx tsx scripts/ingest.ts                          # auto-discovers newest export
npx tsx scripts/ingest.ts path/to/specific.xlsx    # explicit file
```

The ingest is **idempotent** via `INSERT … ON CONFLICT(sp_id) DO UPDATE`. Re-running it re-upserts existing companies (latest description / industry / status wins) and inserts new ones.

The ingest expects these columns (header row scanned for `SP_ENTITY_NAME`):
- `SP_ENTITY_NAME` (required)
- `SP_ENTITY_ID`   (required — used as primary key)
- `MI_INDUSTRY_CLASSIFICATION`, `MI_PRIMARY_INDUSTRY`, `MI_LEVEL_1_PRIMARY`, `MI_LEVEL_2_PRIMARY`
- `SP_BUSINESS_DESCRIPTION`, `SP_WEBSITE`, `SP_COMPANY_STATUS`, `SP_EXCHANGE_TICKER`

## API routes

| Endpoint | Purpose |
|---|---|
| `GET /api/db/top` | `?limit=&us=1` or `?mode=us-all` — top companies by market cap (or COALESCE(mcap, rev*3) for US ALL) |
| `GET /api/db/search` | `?q=&industry=&status=&limit=&offset=` — paginated FTS search |
| `GET /api/db/industries` | List of all primary industries with counts |
| `GET /api/db/cluster` | Industry summary; with `?industry=foo` returns its companies |
| `GET /api/db/company/[capiq-id]` | Single S&P company by CapIQ ID |
| `POST /api/chat` | Streaming Claude chat grounded in the curated dataset |
| `POST /api/exa` | Exa neural search (`mode=search` or `mode=answer`) |
| `POST /api/firecrawl` | One-shot scrape of a URL into markdown |
| `POST /api/brief` | Claude-generated analyst brief for a company or sector |

## Environment

```
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-4-5     # optional — falls back if unset
OPENAI_API_KEY=...                     # not yet used in routes
EXA_API_KEY=...
FIRECRAWL_API_KEY=...
```

## Scripts

- `scripts/ingest.ts` — read any `SPGlobal_Export*.xlsx` → SQLite. Auto-detects whether the file is a profile export or a financials export and partial-upserts only the columns it has, scaling thousands→millions for revenue/ebitda.
- `scripts/normalize-revenue-units.ts` — one-shot normalization for any pre-existing rows that were ingested before the unit fix. Idempotent via a `meta` table marker.
- `scripts/fetch-logos.ts` — downloads logos to `public/logos/<sp_id>.png` for every company that has a website AND any sizing data (mcap or revenue). Cascades 7 sources (Clearbit → DuckDuckGo → Google s2 favicons → direct `<domain>/favicon.ico` variants → homepage HTML `<link rel="icon">` parser). Sets `logo_at` in the DB on success. Re-runnable with `--force`.
- `scripts/gap-finder.ts` — Exa + Claude loop for enriching the curated dataset.
- `scripts/test-routes.ts` — smoke test all 37 routes; exits non-zero on any failure.

## Data sources

- **S&P Capital IQ exports** — drop `SPGlobal_Export*.xlsx` files in the project root. Two flavors are auto-detected:
  - **Profile export** — names, tickers, websites, descriptions, industry classifications.
  - **Location + Financials export** — country, address, market cap, TEV, revenue, EBITDA.

  > ⚠️ S&P CapIQ data is licensed. The xlsx files and the resulting `data/hwarex.db` are **gitignored** — you need your own export to bootstrap the DB.

- **Logos** are fetched at build time from public sources (Clearbit, DDG, Google, direct favicons) and cached under `public/logos/`. Committed to the repo so they ship with the app.

## Tech stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · React Flow · `@ai-sdk/anthropic` · `exa-js` · `better-sqlite3`.
