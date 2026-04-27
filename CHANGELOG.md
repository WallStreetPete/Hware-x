# CHANGELOG

Newest entries on top. Every agent loop iteration appends here.

---

## 2026-04-26 — US ALL view (public + private) + revenue unit fix (USER REQUEST)

- **User request**: "top US companies, public AND private, ~2000 — same boxed React Flow view, with logos. Make it a filter or new page."
- Implemented as a **third toggle on `/top`**: GLOBAL · US PUBLIC · US ALL (PUB + PRIV). New nav link "TOP US" added between TOP GLOBAL and MAP.
- **`topUSAll(limit)`** in `lib/db.ts` — selects `country='USA' AND status='Operating' AND (market_cap_usd > 0 OR revenue_usd > 0)`, sorts by `COALESCE(market_cap_usd, revenue_usd * 3) DESC`. Private companies keep `market_cap_usd=null` so the UI can render "PRIVATE · $XB rev" instead of fabricating a market cap.
- **`/api/db/top` extended** with `?mode=us-all`. The user asked for top 2000 but the data ceiling is **530** US companies with any sizing (317 public + 213 private with revenue). Page caps at the actual count.
- **`<TopMarketCapGraph>` props** changed from `{usOnly}` → `{mode, limit}`. CompanyNode now displays revenue (`$XB rev`) for private companies, ticker/mcap for public. Aggregate stat panel splits "X pub + Y priv" when private companies are in the set.
- **🔧 Fixed silently-broken existing US filter**: `country = 'United States'` returned 0 rows because the actual S&P value is `'USA'`. Was wrong since the filter was added. Now matches.
- **🔧 Fixed CapIQ revenue unit mismatch**: `revenue_usd` and `ebitda_usd` were being stored in **thousands** of USD while `market_cap_usd` and `tev_usd` were in **millions**. NVIDIA showed `revenue=$215.9T`, Altera ranked #1 in the US-all view with $1.93T phantom revenue. Now everything is normalized to millions.
  - `scripts/normalize-revenue-units.ts` — one-shot UPDATE divides existing rows by 1000. Idempotent via a `meta` table marker (`revenue_units_normalized_v1`).
  - `scripts/ingest.ts` — added `SCALE_FACTOR` map so future ingests apply `revenue_usd * (1/1000)` and `ebitda_usd * (1/1000)` at parse time. Re-running ingest is now safe.
  - Spot-check post-fix: NVIDIA $215.9B rev (close to FY26 forecast), Apple $416.2B (real $391B FY24), Altera $1.93B (matches 2014 pre-Intel-acquisition).
- **`scripts/fetch-logos.ts` widened**: WHERE clause now `(market_cap_usd > 0 OR revenue_usd > 0)` instead of mcap-only, so US private companies get their logos pulled too. Order-by switched to `COALESCE(market_cap, revenue*3)` so high-rank private cos get prioritized. Re-fetch in progress for the ~250 US private cos that didn't have logos.

---

## 2026-04-26 — /top: real downloaded logos (USER REQUEST follow-up)

- **User feedback**: "logos look like placeholders, just one letter — find them and store them in the database so they auto-render."
- **Root cause**: Clearbit's hot-link API is dead post-HubSpot for many domains, ad-blockers also kill it. Live `<img src=clearbit.com>` was failing on most cards.
- **New `scripts/fetch-logos.ts`** downloads logos for every top-N company and caches them locally:
  - 7 sources tried in cascade per domain: `logo.clearbit.com`, `icons.duckduckgo.com/ip3`, `google.com/s2/favicons`, `<domain>/favicon.ico`, `www.<domain>/favicon.ico`, `<domain>/favicon.png`, `http://<domain>/favicon.ico`.
  - Last-resort fallback: fetches the homepage HTML and parses `<link rel="icon|shortcut icon|apple-touch-icon">` to discover non-standard paths (e.g. NAURA's logo lives at `/static/favicon.ico`).
  - 12 concurrent workers, 8s per-request timeout. Min response size 90B to drop empty/1×1 placeholders.
  - Saves to `public/logos/<sp_id>.png` (raw bytes; extension is just for routing).
  - Adds `companies.logo_at TEXT` column (idempotent migration), sets it to `datetime('now')` on each successful save.
  - `--limit=N`, `--force` flags. Default re-runs only fetch missing logos.
- **Coverage on top 1000**: 824/1000 = 82%. Remaining 18% are mostly Chinese SHSE/SZSE/TWSE listings with Cloudflare bot protection or no detectable favicon. Letter-tile fallback covers them.
- **`<TopMarketCapGraph>` updated**:
  - `<CompanyLogo>` now reads `/logos/<sp_id>.png` (served statically by Next from `public/`) instead of hot-linking Clearbit.
  - Reads `logo_at` from the API row to decide whether to render an `<img>` (with `onError` letter-tile fallback for any 404) or jump straight to the letter tile.
  - `domainOf()` helper removed from the component (still lives in the fetch script).

---

## 2026-04-26 — /top: uniform grid + logos (USER REQUEST)

- **Three fixes for `/top` per user feedback** ("nodes need to be the same size, all need logos, no overlapping vertical stacks — should be a grid"):
  1. **Uniform 120×120 nodes** — `CompanyNode` now has fixed `NODE_W=120, NODE_H=120` instead of variable `min-w-[180px]` width-by-content. Card layout is logo-on-top, name + ticker · country + mcap centered below.
  2. **Logo on every node** — new `<CompanyLogo>` subcomponent pulls from `https://logo.clearbit.com/<domain>` using the `website` field that's now included in the `/api/db/top` response. 999/1000 top companies have a website populated → near-100% logo coverage. Letter-tile fallback for the 1 missing + any Clearbit 404s. White background under each logo for legibility against the dark canvas.
  3. **Grid per industry** — `buildLayout()` now arranges each industry's companies into a `4-column × N-row` grid with 16px gaps. Industry blocks sit side-by-side (each ~528px wide) with 80px gutters between groups. Industry headers widen to span the full block. Sort order preserved (industries by aggregate cap desc, companies within by cap desc).
- **`Row` type extended** with `website: string | null`; new `domainOf()` helper strips `https://`, `www.`, and trailing path so `www.nvidia.com/foo` → `nvidia.com` for the Clearbit URL.
- Smoke test: API still returns websites correctly (NVIDIA → www.nvidia.com, Apple → www.apple.com, Broadcom → www.broadcom.com).

---

## 2026-04-26 — Phase 5: Financials + Top-1000 view (USER REQUEST)

- **Ingested S&P Location/Financials export** (`SPGlobal_Export_4-26-2026_Location_Financials.xlsx`).
  - Schema extended with 10 new columns: `country, geography, address, market_cap_usd, tev_usd, revenue_usd, ebitda_usd, ebitda_margin, tev_ebitda, financials_at`. Idempotent migration via `PRAGMA table_info` + `ALTER TABLE ADD COLUMN` for the existing 54k-row DB.
  - **Coverage after merge**: 3,206 companies have market cap, 5,612 have revenue, 54,044 have country. Top of book: NVIDIA $5.06T, Apple $3.98T, Broadcom $2.00T, TSMC $1.80T, Samsung $951B, SK Hynix $580B, AMD $567B, ASML $563B, Micron $560B, Intel $415B.
- **Ingest script generalized** to handle multiple xlsx shapes — `partialUpsert` only writes non-null fields, so financials don't clobber profile data and vice versa. Re-running the ingest is now safe; it auto-discovers all `SPGlobal_Export*.xlsx` files in cwd.
- **New `/top` page** — top 1000 (or top N) by market cap, grouped by `primary_industry` columns on a React Flow canvas:
  - 261 Semis · 205 Electronic Components · 150 Electronic Equipment · 149 Semi Materials/Equip · 100 Comm Equipment · 80 Tech HW/Storage · 29 EMS · 26 Tech Distributors
  - Each company node shows ticker · country · market cap. Hover, click → sidebar with full S&P profile + market cap + revenue + country.
  - Columns sorted by aggregate market cap (largest first); within column, sorted by mcap desc.
  - Search box filters across name+ticker; click a search hit → opens its sidebar.
  - GLOBAL / US ONLY toggle in the header.
  - "TOP 1000" added to top nav between GOD'S-EYE and MAP.
- **`/explore` table now shows MCAP and COUNTRY columns** — formats as $T/$B/$M, rendered with accent color.
- **`<CompanySidebar>` S&P pane now includes a 3-stat strip** (MKT CAP · REVENUE · COUNTRY) when financials are available.
- Smoke test: 37/37 pass.

---

## 2026-04-26 — Loop iter #34 (FINAL · loop stopped per user request)

- 🛑 **Autonomous loop cancelled** by user (`CronDelete 8a38e951`). Cron job that was firing every 15 minutes has been removed from session store. The dev server keeps running; only the autonomous re-trigger has stopped.
- gap-finder products: **cpu** → 4 NEW. DB: **144 products** across 8 categories.
- gap-finder curated: **Samsung Foundry** enriched (#26 of 191). Coverage: 13.6%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: **~$1.24 across 34 iters**.
- Smoke test: 37/37 pass.
- **Final cumulative state**: 144 enriched products / 8 categories · 26 / 191 curated companies AI-enriched (13.6%) · 75 geo assets · ~$1.24 total agent spend (~$0.036/iter) · 37/37 routes green every iter · supply-chain edges visible by default on home graph · 100-per-sector S&P expansion live on every `/sectors/[id]`.

## 2026-04-26 — Loop iter #33 (USER REQUESTS — edges back + 100-per-sector)

- **Restored supply-chain edges on god's-eye graph** — `showAllEdges` default flipped from `false` to `true`, opacity bumped 0.18 → 0.32 for visibility. Lines now show on first load. Click any node to fade non-related edges and intensify the relevant ones.
- **New "MORE FROM THIS SECTOR · TOP 100 FROM S&P" section on `/sectors/[id]`** — pulls up to 100 S&P companies whose `primary_industry` matches the sector's mapped industries (`lib/data/sector-sp-mapping.ts`). Public companies (with ticker) ranked first as a market-cap proxy, then alphabetical. Excludes curated duplicates. Each row links to `/explore/[capiq-id]` for the full S&P profile.
- **Caveat on ranking**: the S&P export doesn't include market cap. True ranking by market cap would require an Exa enrichment pass per company (not done yet — left as a future agent task). Public-first is a reasonable proxy: most large companies are listed.
- gap-finder products: **gpu** → 3 NEW. DB: **140 products**.
- gap-finder curated: **SiFive** enriched (#25 of 191). Coverage: 13.1%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.20 across 33 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #32 (Arm + cost-per-insight stat)

- **`/agent` page now surfaces `$ / INSIGHT`** alongside total spend. Defined as `total_spend / (products + curated_enrichments)` → currently ~$0.0072 per insight (137 products + 24 curated for ~$1.16 spent). Communicates the platform's per-unit economics at a glance.
- gap-finder products: **fiber** → 8 NEW (rotation hit a fresh transceiver/CPO variant). DB: **137 products** — biggest single fiber haul.
- gap-finder curated: **Arm Holdings** enriched (#24 of 191). Coverage: 12.6%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.16 across 32 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #31 (Siemens EDA + relative timestamps)

- **`/agent` recent-runs table now shows relative time** ("5m ago", "2h ago", "1d ago") instead of bare HH:MM:SS — readable across iters that span hours/days. Hover for the absolute timestamp.
- gap-finder products: **energy** → 0 new (this rotation variant is saturated; will hit a different one next time).
- gap-finder curated: **Siemens EDA** enriched (#23 of 191). Coverage: 12.0%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.12 across 31 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #30 (30-iter milestone + actions rollup)

- 🎉 **30-iteration milestone**. Cumulative agent results: 129 enriched products / 8 categories, 22 of 191 curated companies enriched (11.5%), 75 geo assets, ~$1.08 total spend, 37/37 routes green every iter.
- **`/agent` page added "ACTIONS BY FREQUENCY" rollup** — pills showing each unique action (gpu/cpu/memory/.../curated) with its run count. Surfaces which categories the loop has fired most. Curated runs get the accent border, product runs get muted bg.
- **Recent runs cap bumped 50 → 100** so the full loop history fits.
- gap-finder products: **cooling** → 5 NEW. DB: **129 products**.
- gap-finder curated: **Cadence** enriched (#22 of 191). Coverage: 11.5%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.08 across 30 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #29 (storage +8 + industries cache)

- 🎉 **storage +8 NEW** (rotation hit HAMR HDD / object S3 / tape variants — was 0 last storage iter, now thriving). DB at **124 products**.
- **`/api/db/industries` cached identically to `/api/db/cluster`** — same 1h TTL pattern. Speeds up `/explore` server-side render and the explore page's industry filter dropdown. Both heavy 54k-row scans now memo'd.
- gap-finder curated: **Synopsys** enriched (#21 of 191). Coverage: 11.0% — past the 10% line.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.04 across 29 iters.
- Smoke test: 37/37 pass — `/universe` no longer in the slowest-3 list (caching paid off).

## 2026-04-26 — Loop iter #28 (TWO milestones + 24× perf win)

- 🎉 **10% curated coverage milestone**: 20 of 191 curated companies enriched.
- 🎉 **switch +8 NEW** — biggest single-iter product haul since iter #14. DB at **116 products**.
- **`/universe` perf: 9.86s → 0.41s (24× faster)** via in-memory cache on the industry-summary query (the heaviest 54k-row scan). 1-hour TTL is safe because `companies` is only mutated by the ingest script, which restarts the dev server. Module-level memo, no infrastructure added.
- gap-finder products: **switch** → 8 NEW (rotation hit InfiniBand / white-box / Marvell variant).
- gap-finder curated: **ASM International** enriched (#20 of 191). Coverage: 10.5%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$1.00 across 28 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #27 (Tokyo Electron + product-count badges)

- **`/sectors/[id]` company tables now show a `Np` badge** when a vendor has N products in the agent-enriched catalog (e.g. NVIDIA shows `14P`, AMD shows `4P`). Built once via `SELECT vendor_name, COUNT(*) FROM db_products GROUP BY vendor_name`, looked up by name and ticker. Surfaces vendor coverage at the sector level.
- gap-finder products: **memory** → 3 NEW. DB: **108 products**.
- gap-finder curated: **Tokyo Electron** enriched (#19 of 191). Coverage: 9.9% — about to cross 10%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.96 across 27 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #26 (KLA + FACILITIES section)

- **`/companies/[id]` now shows a FACILITIES section** when geo assets reference the company via `operatorId`. Each facility shows name + city + capacity + operating-status pill, links to `/map`. Closes a missing bridge: company pages already linked to map via map popups, but the reverse (map → company already worked from iter #8, company → map of own facilities) was missing.
- gap-finder products: **cpu** → 1 new (3 dedup'd). DB: **105 products**.
- gap-finder curated: **KLA Corporation** enriched (#18 of 191). Coverage: 9.4%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.92 across 26 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #25 (Lam Research + ★ on neighbor chips)

- **`/companies/[id]` upstream/downstream/competitor chips now show ★** for enriched neighbors. Closes the visual-consistency gap — every list of curated companies in the app now signals enrichment status the same way (home graph dot, sector card progress, sector table star, sidebar tag, brief cache tag, neighbor chips).
- gap-finder products: **gpu** → 3 NEW. DB: **104 products**.
- gap-finder curated: **Lam Research** enriched (#17 of 191). Coverage: 8.9%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.88 across 25 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #24 (💯 PRODUCT MILESTONE + filter)

- 🎉 **100-product milestone crossed**: fiber +6 → 101 enriched products across 8 categories.
- **`<EnrichedFilter>` client component** added to `/catalog/enriched?category=X` — instant text filter that hides non-matching rows and shows a live match counter. Pure DOM operation so it composes with the server-rendered table.
- gap-finder products: **fiber** → 6 NEW (rotation hit submarine cable / DCI / CPO variant). DB: **101 products**.
- gap-finder curated: **Applied Materials** enriched (#16 of 191). Coverage: 8.4%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.84 across 24 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #23 (TRUMPF + S&P↔curated bridge)

- **`/explore` rows now show ★ next to S&P entries that match a curated company** — clickable directly to `/companies/[id]`. Bridges the 54k S&P universe with the 191 curated set so users can navigate between them without re-searching. Uses the same `findCuratedIdByName()` fuzzy matcher as `/catalog/enriched`.
- gap-finder products: **energy** → 3 NEW. DB: **95 products** (5 from the 100 milestone).
- gap-finder curated: **TRUMPF** enriched (#15 of 191). Coverage: 7.9%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.80 across 23 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #22 (cooling +6 + agent runs polish)

- **`/agent` runs table now parses action strings into pretty badges**: `enrich:cooling` → `[COOLING]` muted badge; `enrich:curated:zeiss` → `[CURATED]` accent-bordered badge + clickable company name (`Carl Zeiss SMT`). Action column is now scannable at a glance.
- gap-finder products: **cooling** → 6 NEW (rotation hit a fresh variant — DLC, RDHx, immersion, or chillers). DB: **92 products** — within striking distance of 100.
- gap-finder curated: **Carl Zeiss SMT** enriched (#14 of 191). Coverage: 7.3%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.76 across 22 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #21 (map search + Soitec)

- **`/map` now has a search box** — top-left panel, live dropdown of asset matches by name/operator/city/country. Selecting a result `flyTo`s the marker (zoom 6, 1.2s ease). Closes the "where is X?" gap on the map analogous to the god's-eye graph search.
- gap-finder products: **storage** → 0 new (rotation variant covered).
- gap-finder curated: **Soitec** enriched (#13 of 191). Coverage: 6.8%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.72 across 21 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #20 (★ marker on sector company tables — 20-iter milestone)

- 🎉 **20-iteration milestone**. Cumulative agent results: 86 products + 12/191 curated companies enriched, 75 geo assets, ~$0.68 total spend. Loop healthy across the board.
- **`/sectors/[id]` company tables now show ★ next to AI-enriched companies** (those with static `longDesc` or DB enrichment). Closes the last surface where enrichment status was invisible — now visible on home graph, sectors index, sector detail, sidebar, and company page.
- gap-finder products: **switch** → 3 new (DB: **86 products**).
- gap-finder curated: **Tokyo Ohka Kogyo** enriched (#12 of 191). Coverage: 6.3%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.68 across 20 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #19 (memory +5 + recently-discovered feed)

- **`/catalog/enriched` now shows a "RECENTLY DISCOVERED · LAST 24" feed** when no category is selected. Newest products across all categories with category badge, vendor logo+link (when fuzzy-matched to curated), product name, release year. Surfaces the agent's productivity at a glance.
- gap-finder products: **memory** → 5 NEW (rotation hit a fresh memory variant — likely GDDR/LPDDR/CXL). DB: **83 products**.
- gap-finder curated: **JSR Corporation** enriched (#11 of 191). Coverage: 5.8%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.64 across 19 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #18 (10 curated milestone + nav polish)

- 🎉 **First double-digit curated milestone**: 10 of 191 enriched (5.2%).
- **Hero stats now clickable**: S&P UNIVERSE → /explore, GEO ASSETS → /map, PRODUCTS → /catalog/enriched, AI-ENRICHED → /agent. Hover dims them.
- **`/agent` recent enrichments show full company names** (not slug ids), tooltip shows updated_at timestamp on hover.
- gap-finder products: **cpu** → 2 new (DB: **78 products**).
- gap-finder curated: **Entegris** enriched (#10 of 191). Coverage: 5.2%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.60 across 18 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #17 (gpu +6 + brief auto-load on company page)

- **`<CompanyAIBrief>` now pre-loads cached briefs** on mount. Users hitting `/companies/[id]` see the AI brief immediately without clicking "Generate" if one exists in DB. Section header shows `[CACHED]` tag, plus a "REGENERATE" button if they want a fresh one. Mirrors the sidebar behavior added in iter #16.
- gap-finder products: **gpu** → 6 NEW (rotation hit edge AI / consumer / Chinese AI accel variant). DB: **76 products**.
- gap-finder curated: **Siltronic** enriched (#9 of 191). Coverage: 4.7%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.56 across 17 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #16 (brief persistence + SUMCO)

- **Briefs now persist to DB** — `/api/brief` checks `curated_enrichments.brief` first; if cached, returns immediately (saves a Claude call). If not, generates and stores. Sidebar pre-loads cached briefs on open so users see them without clicking "Generate". Eliminates redundant token spend for repeat visits.
- gap-finder products: **fiber** → 4 new (5 extracted, 1 dedup). DB: **70 products**.
- gap-finder curated: **SUMCO** enriched (#8 of 191). Coverage: 4.2%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.52 across 16 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #15 (energy +7 + home hero scale stats)

- **Home hero now shows full platform scale**: CURATED (191) · S&P UNIVERSE (54,045) · GEO ASSETS (75) · PRODUCTS (66) · AI-ENRICHED (10★) · LAYERS (7). Replaces the prior 4 stats so visitors immediately understand the breadth.
- gap-finder products: **energy** → 7 NEW (rotation hit SMR/BESS/turbines variant — none overlapping with prior). DB: **66 products**.
- gap-finder curated: **Shin-Etsu Chemical** enriched (#7 of 191). Coverage: 3.7%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.48 across 15 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #14 (rotation pays off + sector enrichment %)

- **Query rotation working as designed**: cooling iter pulled 7 NEW products this run (all 7 extracted were novel — rotation hit a different sub-niche). DB jumped 52 → **59 products**.
- **`/sectors` index now shows enrichment % per sector**: each card shows `X CO / Y★ (Z%)`, plus a thin glowing progress bar at the bottom. Surfaces which sectors the agent has enriched and which need attention.
- gap-finder curated: **Air Liquide** enriched (#6 of 191). Coverage: 3.1%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.44 across 14 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #13 (query rotation + Linde)

- **Diversified gap-finder Exa queries** — `QUERIES_BY_CAT` is now an array of 5 variants per category, picked by `iterationCount % len`. Each category gets exposure to different sub-niches over time:
  - storage: enterprise SSD → all-flash array → object S3 → HAMR HDD → tape
  - cpu: server → Arm Neoverse → consumer → mobile → Chinese
  - memory: HBM → SSD → GDDR → LPDDR → CXL
  - …etc. Should fix the saturating-product issue from earlier iters.
- gap-finder products: **storage** (this iter) → 0 new + a re-run with different variant → 0 new. Storage already has the enterprise SSD slice covered; future iters will hit HAMR/object/tape.
- gap-finder curated: **Linde** enriched (#5 of 191). Coverage: 2.6%.
- Spend: 2 Exa + 3 Claude (storage iter + storage re-run + curated) = ~$0.06. Cumulative: ~$0.40 across 13 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #12 (enriched indicator on graph)

- **God's-eye nodes now show an AI-enriched indicator** — small accent dot in the top-right of any node whose company has been Claude-enriched (either via static `longDesc` field or DB `curated_enrichments`). Server-renders enrichment ids and threads them through to the React Flow graph. Legend updated with "ai-enriched" entry.
- gap-finder products: **switch** → 4 new (Claude found 6, 2 dedup'd). Products: **52**.
- gap-finder curated: **MP Materials** enriched (#4 of 191). Coverage: 2.1%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.34 across 12 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #11 (vendor linking + Cameco enriched)

- **`/catalog/enriched` rows now link vendor names → curated company pages** when there's a fuzzy match. Added `findCuratedIdByName()` in `lib/utils.ts` that normalizes corp suffixes (Inc/Corp/Ltd/etc.), maps name + ticker + id → curated id. Vendor cells now render with logo + clickable link when matched.
- gap-finder products: **memory** → 1 new (Claude found 4, 3 dedup'd). Products: **48**.
- gap-finder curated: **Cameco** enriched (#3 of 191). Coverage: 1.6%.
- Spend: 1 Exa + 2 Claude (~$0.04). Cumulative: ~$0.30 across 11 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #10 (dual-mode + agent dashboard upgrade)

- **AGENT.md updated to dual-mode playbook**: every iter now does (a) product enrichment, (b) curated-company enrichment, (c) one extra gap-fill — all inside the per-iter budget. Codifies the saturating-product-queue pivot from iter #9.
- **`/agent` page upgraded**: new "ENRICHED CURATED" stat (`X / 191`), full-width progress bar showing % coverage, and a "RECENT" pill row of last 8 enriched company ids (each links to its page). Visualizes the agent's actual progress.
- gap-finder regular: **cpu** → 3 new products (Claude found 4, 1 dedup'd). Total products: **47**.
- gap-finder curated: **Albemarle** enriched (#2 of 191). Curated coverage: **2 / 191 = 1.0%**.
- Spend this iter: 1 Exa + 2 Claude = ~$0.04. Cumulative: ~$0.26 across 10 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #9 (curated enrichment pivot)

- **Major pivot**: product round-robin saturating (gpu re-run found 0 new). Per AGENT.md priority #1, shifted gap-finder to enrich curated companies' missing `longDesc`/`moat`/`risk`. 188/191 curated companies still need this.
- **New `--mode=curated` in `scripts/gap-finder.ts`** — picks the next curated company missing all three fields, asks Claude for tight Stratechery-style enrichment via tool-use schema (guaranteed structured output), persists to new `curated_enrichments` SQLite table.
- **New table `curated_enrichments`** (curated_id PK + long_desc/moat/risk/brief). Idempotent upsert. Read via `getCuratedEnrichment(id)`.
- **New API `/api/db/enrichment/[id]`** + sidebar overlay: when a curated company has DB enrichment, it's used as the OVERVIEW/MOAT/RISK fallback. Marked with `// AGENT-ENRICHED` tag so the user sees provenance.
- **First curated enrichment**: Freeport-McMoRan got a tight 2-paragraph profile + moat + risk written by Claude. Visible in sidebar at `/companies/freeport`.
- gap-finder regular iter ran for **gpu** (no new — all 8 already covered). Total enriched products: 44.
- Spend this iter: 1 Exa + 2 Claude (regular gpu iter + curated enrichment) = ~$0.04. Cumulative: ~$0.22 across 9 iters.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #8 (fiber + map drilldown + audit script)

- **`/map` popups now link to the company page** when an asset's `operatorId` matches a curated company. Adds an "OPEN COMPANY →" CTA inside the popup, plus inline-styled hyperlink on the operator name. Closes the navigation gap from map → entity.
- **New `scripts/audit-curated.ts`** — read-only diagnostic that prints how many of the 191 curated companies are missing `marketCapUSD` / `revenueUSD` / `longDesc` / `moat` / `risk` / `domain`. Output: 100% have domains, 52% missing financials, 97% missing longDesc, only **3 fully-tagged** (ASML, TSMC, NVIDIA). Will drive future enrichment iterations.
- **gap-finder fiber**: 5 new products. DB total: **44 enriched products across all 8 categories** (gpu 8 / cpu 6 / switch 6 / cooling 5 / energy 5 / memory 5 / fiber 5 / storage 4). The full round-robin is now seeded.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #7 (energy + GPU recovery)

- **Added `--category=X` override flag to `scripts/gap-finder.ts`** — runs a specific category once without advancing the round-robin cursor. Unblocks targeted re-runs (the GPU iter #1 had failed before tool-use schema landed).
- **Recovered GPU enrichment**: 8 new products (H100, H200, B200, GB200, MI300X, MI325X, TPU v5p, AWS Trainium2). DB total: **39 enriched products across 7 categories**.
- gap-finder ran for **energy** — 5 new products. Spend (exa/fc/claude): 1/0/1 (regular iter) + 1/0/1 (GPU re-run) = 2/0/2.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #6 (graph search + cooling)

- **Added node search to god's-eye graph** — top-left search box with live dropdown of matching curated companies; selecting an entry pans + zooms (1.4×) to the node and opens its sidebar. Closes the "where is X?" gap when scrolling 150 nodes.
- gap-finder ran for **cooling** — 5 new products (Vertiv CoolPhase, CoolIT CHx2000, Asetek 7200, Submer SmartPodX, JetCool SmartPlate). DB total: 26 enriched products across 5 categories. Spend (exa/fc/claude): 1/0/1.
- Smoke test: 37/37 pass.

## 2026-04-26 — Loop iter #5 (UX gaps + agent diagnostics)

- **Added website link to `/companies/[id]` full page** — same `DOMAINS`-driven approach as the sidebar. Closes the parallel UX gap on the standalone company page.
- **New `/agent` page** — diagnostic dashboard for the autonomous loop. Shows iteration count, total enriched products, estimated spend, per-category breakdown, the next category in the queue, and a table of the last 50 runs from `agent_runs`. Wired into top nav.
- gap-finder ran for **storage** — 4 new products (Solidigm D5-P5336, Samsung PM, Pure FlashArray-XL, Vast Ceres). DB total: 21 enriched products. Spend (exa/fc/claude): 1/0/1.
- Smoke test: 37/37 pass. Cumulative agent spend (5 iters): ~$0.10.

## 2026-04-26 — Loop iter #4 (gaps + UX)

- **Added website link to curated company sidebar** — now uses the `DOMAINS` map. Previously only S&P-imported entries showed website. Closes a UX gap.
- **Added 25 geo coordinates to `/map`**: 11 fabs (TSMC Fab 15/16/20/Dresden, Samsung Austin, Intel Magdeburg/Rio Rancho, SK Hynix Wuxi, Micron Hiroshima, Kioxia Yokkaichi, Samsung Xi'an), 9 data centers (Meta Clonee/Singapore, Google Belgium, AWS Osaka, Azure Joburg, CoreWeave Vegas, Equinix FRA/SG, Yondr AMS), 7 nuclear (Byron, Braidwood, Limerick, Millstone, Palo Verde, Kashiwazaki, Bruce), 5 mines (Collahuasi, Morenci, Thacker Pass, Salar de Atacama, MP Stage III), 2 rare-gas plants. Map now ~75 assets across 11 layers.
- Smoke test: 37/37 pass.

## 2026-04-26 — Agent loop iteration

- gap-finder ran for **switch** — 6 new products in 'switch' (6 extracted). Total enriched products in DB: 17. Spend (exa/fc/claude): 1/0/1.

## 2026-04-26 — Agent loop iteration

- gap-finder ran for **memory** — 5 new products in 'memory' (5 extracted). Total enriched products in DB: 11. Spend (exa/fc/claude): 1/0/1.

## 2026-04-26 — Agent loop iteration

- gap-finder ran for **cpu** — 6 new products in 'cpu' (6 extracted). Total enriched products in DB: 6. Spend (exa/fc/claude): 1/0/1.

## 2026-04-26 — Agent loop iteration

- gap-finder ran for **gpu** — ERROR: Expected ',' or ']' after array element in JSON at position 3908 (line 166 column 6). Total enriched products in DB: 0. Spend (exa/fc/claude): 1/0/1.

## 2026-04-26 — Phase 4: Autonomous loop infrastructure

- Added `AGENT.md` — standing instructions the loop re-reads each iteration. Codifies budget caps (Exa ≤ 8/iter, Firecrawl ≤ 4/iter, Claude ≤ 6/iter), gap-fill priority list, and inviolable UI constraints.
- Added `data/agent-state.json` cursor file for resumable enrichment.
- Added `scripts/budget.ts` — counter-based spend guard, refuses calls past per-iteration cap.
- Added `scripts/gap-finder.ts` — picks one gap, fills it via Exa+Claude, writes to DB, appends here.
- Added `scripts/test-routes.ts` — smoke test that hits every route + key API endpoints.
- Added `/map` page — Leaflet-based world map of fabs / DCs / energy plants / mines, with toggleable layers.
- Set up `/loop 15m` for continuous enrichment.

## 2026-04-26 — Phase 3: S&P universe + sidebar + light-mode fixes

- **Ingested 54,045 S&P CapIQ companies** into local SQLite (`data/hwarex.db`) from `SPGlobal_Export_4-26-2026_*.xlsx`. Schema in `lib/db.ts`. Idempotent upsert by `sp_id`. FTS5 index for search.
- Added `/universe` — industry-cluster React Flow graph; click an industry to expand into its companies; click a company → sidebar.
- Added `/explore` — server-paginated, searchable table over the full 54k. Filters by industry; FTS-backed search.
- Added `/explore/[capiq-id]` — full S&P company detail page.
- Added API routes: `/api/db/search`, `/api/db/industries`, `/api/db/cluster`, `/api/db/company/[spid]`.
- Built `<CompanySidebar>` — works for both curated and S&P companies. Resizable via left-edge drag handle (320–window width, persisted in localStorage). Esc to close. Replaces the old small HUD on the god's-eye graph.
- Added multi-select to React Flow: shift-drag for box-select, shift-click to add/remove, delete to remove selected nodes.
- Refactored color tokens to RGB triplets in CSS vars + Tailwind theme so `bg-bg-2/80`, `accent/50` etc. work properly. Fixed light-mode color leaks (`hover:bg-white/5`, `divide-white/5`, hardcoded backdrop colors).
- Fixed node borders — every node in every React Flow graph (god's-eye + universe) now has a full red accent border.
- Light mode no longer leaks dark colors on category labels, sector labels, layer headers, or sidebar.

## 2026-04-26 — Phase 2: catalogs + light mode + graph polish

- Added 8 product catalogs at `/catalog/*` with sortable / filterable / searchable tables: silicon (50+ chips), energy (33 utilities/IPPs/nuclear/renewables/BESS), fiber (24 carriers/cables/submarine/DCI), optical transceivers (17), data center campuses (23), network switches (14), storage (16), cooling (13).
- Added reusable `<DataTable>` component with column sort, search, dropdown filters, vendor logos.
- Expanded sectors from 26 → 38; tech primers from 10 → 24. Added rare gases, edge AI, telecom DCI, AI software stack, data platform, AI security, real estate, water/cooling fluids, humanoid supply, quantum, photonics R&D, test+measurement.
- Added per-sector and per-tech YouTube video grids (Asianometry, Veritasium, Real Engineering, Wendover, ServeTheHome, official channels).
- Added light-mode toggle (sun/moon in nav). CSS variables drive both themes. No FOUC via inline pre-paint script.
- Added `<Logo>` component using Clearbit Logo API → favicon → letter-tile fallback. Wired into nodes, sidebar, company detail, sector tables, catalog tables.
- Added per-sector AI essay generator (Claude) and ClusterMAX-style ratings panel for hyperscalers + neoclouds.
- Overhauled god's-eye graph: nodes draggable; sector + layer headers are now React Flow nodes (pan/zoom with the graph); edges hidden by default with toggle + per-node trace on click.

## 2026-04-26 — Phase 1: scaffold + curated dataset

- Initial Next.js 15 + Tailwind + React Flow + AI SDK scaffold.
- Curated dataset: 26 sectors, ~120 hero companies across the AI infra stack, 10 tech primers.
- Pages: `/` god's-eye, `/sectors`, `/companies/[id]`, `/tech`, `/chat`, `/search`.
- AI integration: Claude analyst chat (grounded in curated dataset) + Exa neural search + Firecrawl scrape endpoint + Anthropic-powered company brief generator.
- Theme: black bg, red accents (`#ff2a2a`), monospace headers, scanlines, corner brackets, glow on focus.
