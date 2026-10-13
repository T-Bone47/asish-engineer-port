# Sentinel AI — project addition record

**What was added, what it was sourced from, and what could not be verified.**
The eighth case study, at `/work/sentinel-ai`, catalogue position **07**
(VyaparPulse shifts to **08**).

This portfolio's rule is that a claim is either traced to something real or
left out. Sentinel AI arrived as a *description* — a name, a category, a
technology list and a feature list — and a description is not a source. So
nothing below is transcribed from the request. Everything was read from the
project's own repository, and where a figure could not be reproduced here it
says so.

---

## 1. Where the source came from

The implementation is **not** in this repository. It was found on disk, in two
working copies:

| Path | What it is | State |
|---|---|---|
| `~/Downloads/sentinel-main/sentinel-main/` | Full repo: React front end + `sentinel-ai-backend`, `HANDOFF.md` (1,046 lines), `IMPLEMENTATION_STATUS.md` (314 lines), `README.md` | **used as the source of record** |
| `~/Downloads/sentinel-ai-llm-copilot-handoff (2)/` | A git clone with `dist/`, older commit history (Aug–Sep 2026) | consulted for dates only |
| `~/Downloads/sentinel-main/screenshots/` | 21 real screenshots + `ALT-TEXT.md` + `capture-manifest.json` | not imported (see §5) |

**Snapshot date: 2026-10-07.** That is the modification date of `HANDOFF.md`,
`IMPLEMENTATION_STATUS.md`, `README.md` and the newest source files in the copy
used, and it is the date recorded on the project's `testing.verifiedOn`.

The sibling clone's `git log` ends **2026-09-01**, so it is an earlier lineage
and was not used for content.

---

## 2. What was verified by reading code, not docs

| Claim | Method | Result |
|---|---|---|
| React + Vite + TypeScript front end | `package.json` | React `^18.3.1`, Vite `^5.2.0`, TypeScript `^5.5.4` |
| Python + FastAPI + PostgreSQL back end | `pyproject.toml` | `fastapi`, `sqlalchemy[asyncio]`, `asyncpg`, `psycopg`, `alembic`, `pydantic`; `requires-python >=3.11` |
| Alembic migrations exist | `migrations/versions/` | 2 revisions: initial schema + trust-score snapshots |
| 15 datasets | `sentinel-ai-backend/datasets/` | 15 CSVs, `dataset1_…` → `dataset15_…`, names match the entities cited |
| Test suite size | counted `def test_` across `tests/` | 177 test functions in 10 files (the recorded *result* is 246 collected, because eight files parametrise — see §3) |
| Front end reads the API, not seed data | `grep` for `src/data` imports under `src/pages` | 21 of 23 page components import the API service layer; the only `src/data` import left is a **TypeScript type** (`ChatMessage`) |
| All 10 named features exist as screens | `ls src/pages` | Command Center, Copilot, Investigations, Graph, RiskCenter, Findings, Policies, Controls, Frameworks, Evidence, AuditLog, Reports, `org/` (6), `privacy/` (2) |
| API surface | counted route decorators | 34 handlers (the project's own handoff counts 38 distinct paths; both numbers are stated rather than blended) |
| Architecture style | `HANDOFF.md` §2 + folder layout | routers → services → domain → repositories; business logic not in routers |

**Feature states were assigned from `IMPLEMENTATION_STATUS.md`, which is
written as an honest done/not-done tracker** ("If it's not marked DONE, treat
it as not existing"). Features whose backend *and* front end are both marked
DONE are `implemented`; the two with a test-proven live result behind them
(Command Center aggregates, organisation graph edges) are `verified`. Nothing
is `live-verified` — nothing is deployed.

---

## 3. Evidence attribution — read this before quoting a number

The suite was **not re-executed** during this work. Its requirements are a
live PostgreSQL 16 instance plus the project's own Python environment, neither
of which is present here. Re-running it would have been the only way to
upgrade the figure from *recorded* to *observed*, and that upgrade was not
made.

So every figure on the page is attributed where it appears:

| Figure | Source | Where it is shown |
|---|---|---|
| **245 passed / 1 skipped / 0 failed** (246 collected) | the project's `HANDOFF.md` and `IMPLEMENTATION_STATUS.md`, snapshot 2026-10-07 | headline metric, Test evidence table, `validationClaims[0]` |
| **14,400 records, 15 datasets, 0 errors, 0 skipped** | `IMPLEMENTATION_STATUS.md` Step 4, Step 5 | metric note, ingestion validation claim |
| **66.0% coverage — 198 of 300 controls** | `HANDOFF.md` § "Evidence Intelligence — the coverage formula", live values table | metric note, `brief.result`, coverage validation claim |
| **14 verified FKs, 0 orphans** | `HANDOFF.md` §11 relationship table | metric, relationship validation claim |
| **18 tables / 20 total** | `HANDOFF.md` §7, corroborated by a test named `test_migration_created_all_18_tables` | architecture pipeline detail |
| **37 mocked LLM tests** | `IMPLEMENTATION_STATUS.md`, LLM grounding section | the `not-run` claim on real-model quality |

The one number that is deliberately **absent** is a per-suite breakdown of the
246: it is recorded in the handoff, but the `TestEvidence` contract takes one
run per suite entry and splitting a single run to imply more coverage than was
recorded would overstate it.

---

## 4. What could not be verified, and is therefore stated as such

These are on the page, in `limitations` and as `not-run`/`partial` evidence
states — not omitted, because an invisible boundary is worse than a visible one:

- **A live grounded-model response was never observed.** No provider key was
  configured in the environment the project was built in and it had no network
  path to one. The project's own handoff says this outright. The path is
  covered by 37 mocked tests.
- **Authentication is unapplied.** `bcrypt`, token issue/refresh and a
  `require_roles` guard all exist; the guard is applied to **no** data
  endpoint, and neither query endpoint requires a token.
- **The API is read-only.** No POST/PATCH/DELETE for records.
- **No deployment, no users, no clients, no certification.** None is claimed
  anywhere, and the compliance frameworks the data references are not
  presented as certified.
- **Nothing about adoption.** There is no user count, no organisation using it
  and no client outcome stated.
- **Pre-existing type errors** in unrelated screens, which the Vite build does
  not gate on.

---

## 5. Decisions taken, and what was left alone

**Catalogue position 07.** Inserted ahead of VyaparPulse so Sentinel AI is 07
and VyaparPulse is 08, per the request. Verified in the rendered DOM: the index
shows `06 Football Intelligence OS · 07 Sentinel AI · 08 VyaparPulse`, and
Sentinel AI appears **exactly once**.

**`featured: false`, deliberately.** `getFlagshipProject()` returns the first
featured project that carries metrics, and `app/work/[slug]/page.test.ts`
asserts that set is exactly `["live-f1-intelligence"]`. Sentinel AI has real
measured figures, so marking it featured would have silently moved the flagship
block on `/work`.

**A new `governance` instrument, not a reused one.** Its architecture is the
only *containment* hierarchy on the site — policies contain controls, controls
carry evidence — so it got nested scope with one evidence gap drawn dashed and
unfilled. Reusing a flow shape would have drawn a GRC platform as a pipeline.

**A new `enterprise-grc` category.** Filing it as `ai-ml` would have overstated
it (its core answers are deterministic and its README states no LLM is
configured) and `data-platform` would have described its plumbing rather than
its purpose. Same reasoning that produced `data-platform` for Football
Intelligence OS.

**Real screenshots were NOT imported**, though 21 exist with written alt text.
This project ships no asset directory by design, and importing media for one
project is a media-pipeline decision (optimisation, aspect handling, alt-text
conventions) rather than a data-entry one. Recorded as an owner decision in
`README.md` and in the data file's header comment.

**No repository link.** A local git remote pointing at a third-party GitHub
account was found in the sibling clone, but it is unconfirmed as Sentinel AI's
canonical repository. Publishing it unverified is the exact failure the data
model exists to prevent, so `links` is empty and the case study renders no
Links section — which is correct, not broken.

**The case-study template was not modified.** It renders only `metrics[0]` in
the hero evidence band, which is a documented pre-existing behaviour that
applies uniformly to all eight projects (`MetricGrid` is used by the flagship
block on `/work`, not by the template). Changing it would have altered seven
other case studies as a side effect of adding one. Sentinel AI's remaining
three figures are visible in prose and in the validation claims instead; see
§3.

**Three `planned` entries were added to `stateItems`, on purpose.** The
Subsystem state block is the one place a reader scans for "what actually
works", and with only shipped features in it, `implemented` reads as
*complete*. Three capabilities the project's own tracker marks as unfinished
are now listed there as `planned`, each traceable rather than inferred:

| Entry | Source in the repository |
|---|---|
| Record write endpoints | `HANDOFF.md:117` ("Only GET exists"), `IMPLEMENTATION_STATUS.md:71` (`TODO — POST/PATCH/DELETE`) |
| Role-based access applied to endpoints | `HANDOFF.md:120` ("`require_roles()` exists and works, but no data endpoint is currently guarded"), `IMPLEMENTATION_STATUS.md:61` |
| Policy document upload | `HANDOFF.md:728` ("No file upload endpoint and no PDF text extraction"), `IMPLEMENTATION_STATUS.md:220` |

This follows the convention already in the file: `ea-fc-intelligence` carries
`blocked` and `research` items in its `stateItems` for the same reason. The
existing `EvidenceLegend` already defines `planned` as "defined, deliberately
not executed", so no new vocabulary or styling was introduced — and the chip
renders in `--color-foreground-faint`, checked in the browser, staying clear of
the green reserved for `verified` and the blue used for `implemented`.

Deployment and certification were **not** added as state items, because they
are not capabilities. They remain stated in `limitations` and `currentState`,
which is where a reader looking for the project's overall standing will find
them.

---

## 6. Checks run

| Check | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | pass |
| Lint | `npm run lint` | pass |
| Tests | `npm run test` | **57 passed** (2 files) |
| Build | `npm run build` | pass — **19 routes** (11 static + 8 SSG) |
| Live audit | `node tests/site-audit.mjs` | **209 assertions, 14 routes, all pass** |
| Re-run after the `planned` items | `npm run verify` | pass — re-run because the data file changed; 57 tests, 19 routes |
| Re-run live audit + DOM check | audit + browser | 209 assertions still pass; the three `planned` entries render in the Subsystem state block on the production build, `Planned` chip in the muted tone, no overflow at 1440 or 390, console clean |

`tests/site-audit.mjs` keeps its own hardcoded route list and says so in a
comment ("a new case study can ship un-audited"). `/work/sentinel-ai` was
added to it, which is why the audit went from 194 assertions over 13 routes to
209 over 14.

Browser checks on the production build (Chromium, DOM measurement):

| Width | Result |
|---|---|
| 1440 | index shows Sentinel AI once at 07; case study renders sections **01–10** with no gaps; hero instrument 84px tall; 0 targets under 44px; no overflow |
| 390 | 0 targets under 44px with all appendix panels open; no overflow; instrument 298×84 |

Console on the production build: **no errors, no warnings, no hydration
messages, no failed requests.**

No screenshots were taken: `preview_screenshot` cannot composite in this
environment, so all layout verification is geometry and computed style. Optical
quality of the new instrument was **not** inspected.
