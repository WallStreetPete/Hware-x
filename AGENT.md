# AGENT.md — Standing Instructions for HWARE-X

> **Read this file at the start of every loop iteration.** It is the source of truth for what this autonomous agent is supposed to do, what budgets it operates under, and what counts as "done." It is never done unless the user explicitly says so.

## North star

Build the **most comprehensive platform in the world to showcase all of AI infrastructure** — every company, every product, every supply-chain dependency, every factory, every data center, every fab, every energy source, every mine. Truly universal. The user wants to "understand how the universe works" through this product.

## Core directives (verbatim, do not water down)

1. **Be extremely proactive.** Wake every ~15 minutes. Look for gaps. Fill them.
2. **Document everything** — every change, every thought, every adjustment — in `CHANGELOG.md` (newest at top). README and AGENT.md are kept current with structure.
3. **No questions, no permissions.** The user has granted full execute. Don't ask before running scripts, edits, deployments, etc.
4. **Don't stop until told.** This loop runs indefinitely.
5. **Be budget-aware.** Use Exa, Firecrawl, and Claude judiciously. The user does not want to wake up to a $1,000 bill. Hard cap each iteration at the budget defined below.
6. **Write tests** so nothing breaks across pages.

## Loop iteration playbook

Each time the loop fires, do the following in order:

1. **Read this file** + `CHANGELOG.md` (last 30 lines) + `data/agent-state.json`.
2. **Re-run the full smoke test** (`npx tsx scripts/test-routes.ts`). If anything is red, fix it before anything else.
3. **Run product enrichment** (`npx tsx scripts/gap-finder.ts`) — round-robins the 8 categories. New rows go into `db_products`. If `0 new` for two iters in a row on the same category, skip products this iter and go to step 4.
4. **Run curated enrichment** (`npx tsx scripts/gap-finder.ts --mode=curated`) — picks the next un-enriched curated company and writes longDesc/moat/risk into `curated_enrichments`. Skip if `curatedEnrichmentCount()` ≥ 191 (we're done).
5. **Pick one additional gap** from the priority list below (UI bug, missing data, broken page, missing geo coords, new sector, new tech primer). Update `agent-state.json`.
6. **Append a CHANGELOG entry** describing every change.
7. **Commit nothing.** Don't push or commit unless the user asks.

The combined budget for steps 3+4+5 stays inside the per-iteration caps.

## Budget caps per iteration

- **Exa calls:** ≤ 8 search calls per iteration (each ~$0.005, ≤ $0.04/iter).
- **Firecrawl scrapes:** ≤ 4 per iteration.
- **Claude calls:** ≤ 6 calls per iteration, each ≤ 1500 output tokens.

Total expected: under $0.50 per iteration. At 4 iters/hour × 24 = ~$48/day worst case. If a script can't stay under, it must abort and log an over-budget warning.

The script `scripts/budget.ts` enforces this by refusing to make further calls once the per-iteration counters trip.

## Gap-fill priority list (in order)

The agent should walk this list across iterations. Maintain a cursor in `data/agent-state.json` so successive iterations don't repeat work.

1. **Curated companies missing fields** — domain, longDesc, moat, risk, marketCap, products. Use Exa+Claude to fill.
2. **S&P companies (54k+) — enrich the most-likely-relevant** to AI infra (semis, hyperscalers, fab equipment, optical, fiber). For each, generate a structured product list and store in `db_products` table.
3. **Catalog rows missing specs** — silicon TDP, memory, MSRP; energy capacityGW; fiber routeMiles; etc.
4. **New product categories** to seed — RAM/DRAM SKUs, more network switches, more energy contractors, EV battery players intersecting with grid storage.
5. **Geographic coordinates** — every fab, DC, mine, energy plant should have lat/lng for `/map`.
6. **Industry definitions / supply chain edges** — discover new upstream/downstream relationships and add to the curated graph.

## Inviolable constraints

- Light + dark mode must both work everywhere. Audit on every UI change.
- Every node in any React Flow graph must have a clearly visible accent border.
- All sidebars and overlays must be theme-aware.
- Sidebars must be resizable (drag handle on the inner edge).
- Multi-select must work in all React Flow graphs (shift-drag).
- The CapIQ `sp_id` is the canonical identifier; never break that contract.
- Bulk actions must be idempotent (re-runnable).

## New views the user has explicitly requested

- ✅ Curated god's-eye graph (`/`) — done
- ✅ Universe by industry (`/universe`) — done
- ✅ Full searchable table (`/explore`) — done
- ✅ Catalogs (`/catalog/*`) — done
- ✅ Sidebar with full company info on click — done
- ⏳ **`/map`** — geographic view of all fabs, DCs, energy, mines, nuclear, gas/oil. Toggleable layers. **In progress.**
- ⏳ Continuous gap-filling enrichment from Exa + Firecrawl + Claude. **In progress.**

## Do NOT

- Do not commit / push without explicit user approval.
- Do not delete real data (ingest + curated). Soft-archive instead if needed.
- Do not run scripts that would call out to external APIs in unbounded loops without the budget guard.
- Do not introduce new dependencies without noting them in CHANGELOG with reason.
- Do not silently regress features (tests should catch this).

## Files of record

| File | Purpose |
|---|---|
| `AGENT.md` | This file. The standing brief. |
| `CHANGELOG.md` | Newest-first running log of all agent changes. |
| `README.md` | User-facing project doc — keep current with structure. |
| `data/hwarex.db` | SQLite — all companies + products. |
| `data/agent-state.json` | Cursor for gap-fill iterations. |
| `scripts/ingest.ts` | xlsx → SQLite. Idempotent. |
| `scripts/test-routes.ts` | Smoke test. Run every iteration. |
| `scripts/gap-finder.ts` | The enrichment loop — picks one gap and fills it. |
| `scripts/budget.ts` | Per-iteration spend guard. |

---

_Last updated by agent on each loop iteration as needed._
