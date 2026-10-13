# Project Completion and Data Integrity Report

**Generated:** 2026-10-12  
**Owner:** Asish Oliver M (T-Bone47)  
**Scope:** All eight portfolio projects — data, validation, and verification  

---

## 1. Summary

All eight projects are preserved and presented according to their actual implementation and completion status. The validation gate now distinguishes **completion status** from **publication status**, so a completed project with an unpublished repository is not downgraded. The `npm run verify` gate passes end to end: typecheck, lint, 117 tests, production build, and the site audit (257 assertions across 14 routes).

## 2. The eight projects

### 2.1 Live F1 Intelligence
- **Category:** Real-Time Motorsport Intelligence Platform
- **Status:** `active` (extending analysis and AI capabilities)
- **Year:** 2026
- **Completion vs publication:** Active development, public repository
- **Repository:** `https://github.com/T-Bone47/live-f1-intelligence` (verified, public)
- **Key capabilities:** Multi-provider ingestion (OpenF1, F1 SignalR, FastF1, Jolpica), canonical event model with provenance, deterministic replay, timing/sector intelligence, rolling pace, tyre degradation regression, battle detection FSM, race-control state, strategy candidates, qualifying and practice intelligence
- **Evidence:** 1,067,193 canonical events, 0 malformed records, ~2,650 events/sec, ~0.10 ms p50/event, 99 MB peak memory
- **Technologies:** Python, FastAPI, PostgreSQL, TimescaleDB, WebSockets, Docker, Pandas, NumPy, FastF1, OpenF1, Jolpica, F1 SignalR

### 2.2 F1 Lap-Time Simulator
- **Category:** MATLAB Vehicle Dynamics and Lap-Performance Simulation
- **Status:** `completed` (V1)
- **Year:** 2025
- **Completion vs publication:** **Completed implementation, repository unpublished.** This is the key correction: the project is finished, but the repository has not been published to GitHub yet.
- **Repository:** None published. `links.visibility: "unpublished"`.
- **Key capabilities:** MATLAB numerical lap-performance simulator, quasi-steady-state point-mass vehicle model, track modelling, tyre-grip modelling, aerodynamic downforce and drag, power-limited traction, friction-circle constraints, three-pass solver with closed-loop convergence, performance decomposition and sector analysis, independent and linked aerodynamic parameter sweeps, exact closed-form corner-speed solution, Python/NumPy reference implementation used for independent numerical verification
- **Technologies:** MATLAB (primary implementation), Python and NumPy (reference verification implementation)
- **Note:** The public GitHub repository `github.com/T-Bone47/f1-pro-simulator-` is a **different project** ("Historical F1 Race-Engineering Laboratory", a Python platform). It is not the same as this portfolio's MATLAB simulator. The MATLAB implementation is the delivered system; the Python reference is the cross-check.

### 2.3 RaceMind-AI
- **Category:** AI-Assisted Sim-Racing Engineering
- **Status:** `active`
- **Year:** 2026
- **Completion vs publication:** Backend completed and tested, desktop app in progress, public repository
- **Repository:** `https://github.com/T-Bone47/RaceMind-AI` (verified, public)
- **Key capabilities:** Game-agnostic telemetry abstraction, Codemasters F1 telemetry integration, UDP telemetry listener, rule-based race-strategy engine, pit-window/undercut/overcut analysis, tyre/weather/fuel strategy, telemetry-driven driver coaching, LLM-powered AI Engineer for session questions, backend API and data infrastructure
- **Honest boundary:** Backend is implemented and tested; frontend/desktop is in progress. Only Codemasters F1 telemetry decoding is implemented — additional simulator decoders are planned/stubbed.
- **Technologies:** FastAPI, SQLAlchemy, PostgreSQL, WebSockets, JWT, Pytest, Docker, Claude API

### 2.4 F1 Race Manager
- **Category:** F1 Team Management and Strategy Simulation Game
- **Status:** `in-development`
- **Year:** 2026
- **Completion vs publication:** In development, public repository
- **Repository:** `https://github.com/T-Bone47/race-manager` (verified, public)
- **Key capabilities:** Unity team-management game — car development, staff and finance, race-weekend strategy calls across tyres, weather, safety cars and reliability
- **Honest boundary:** This is a **game**, not the vehicle-performance simulator. The strategy model is a game rule set, not a validated model of real race strategy. No build is published.
- **Technologies:** Unity, C#, Python

### 2.5 EA FC Player Intelligence
- **Category:** Football Player Intelligence, Data Engineering and ML
- **Status:** `active`
- **Year:** 2026
- **Completion vs publication:** **FC26 baseline completed and serving live recommendations; FC27 active on acquisition side (0 of 20,689 records imported, blocked on permitted data source).** Repository is private/unpublished.
- **Repository:** `https://github.com/T-Bone47/EA_FC_INTELLIGENCE` — verified to exist under T-Bone47 account, but the repository is private/not publicly accessible. Treated as unpublished for link purposes.
- **Key capabilities:** Version-aware player recommendation engine, 16,228-player FC26 baseline from CC0 public dataset, seven-component deterministic scoring, version isolation wall (FC27 returns 404, never falls back to FC26), golden regression contract, adversarial OVR-trap test suite
- **Honest boundary:** FC26 is complete. FC27 has zero imported records. Nine adversarial OVR-trap cases currently fail (documented open work). 138 backend tests require a live PostgreSQL instance and were skipped in the recorded run.
- **Technologies:** Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic, Pydantic, Pytest, React, TypeScript, Vite

### 2.6 Football Intelligence OS
- **Category:** Football Data Infrastructure and Intelligence Platform
- **Status:** `active`
- **Year:** 2026
- **Completion vs publication:** Foundation verified, public repository
- **Repository:** `https://github.com/T-Bone47/Football_OS` (verified, public, latest commit 2026-10-01)
- **Key capabilities:** Multi-provider football data ingestion (StatsBomb, API-Football, football-data.org), provider adapters behind one contract, content-addressed raw snapshot store, canonical domain model (24 entities, 13 migrations), capability registry (documented vs verified separated), analytics foundations (features, role discovery, similarity)
- **Evidence:** 609 tests passing, 0 failing, 61 skipped (no live PostgreSQL). Two providers confirmed against real API calls.
- **Honest boundary:** 61 integration tests require live PostgreSQL and were skipped. Container deployment defined but never run end to end. Downstream intelligence (valuation, recruitment, forecasting) is built on the foundation but not covered by the same verification bar.
- **Technologies:** Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic, Pydantic, Pandera, Tenacity, httpx, Pytest, React

### 2.7 Sentinel AI
- **Category:** Enterprise AI, Governance, Risk and Compliance
- **Status:** `active`
- **Year:** 2026
- **Completion vs publication:** Active development, **repository unpublished.** The project is a genuine engineering effort whose canonical repository is not public under the T-Bone47 GitHub account.
- **Repository:** None published. `links.visibility: "unpublished"`. A local git remote pointing at a third-party GitHub account was found in a separate working copy, but it is unconfirmed as the canonical repository.
- **Key capabilities:** Command Center, GRC Copilot, Investigations, Organization graph, Risk and findings management, Governance and controls, Asset management, Privacy and consent, Evidence management, Audit logs and reporting
- **Evidence:** 245 backend tests passing, 1 skipped, 0 failed (the project's own recorded pytest run, attributed not re-run). 14,400 records in one model. 66.0% controls with verified evidence (198 of 300). 0 orphaned relationships.
- **Honest boundary:** Built for a hackathon. No provider key was available in the development environment, so the grounded-model path is covered by mocked tests only. Authentication exists but the role guard is applied to no data endpoint. API is read-only (no create/update/delete). Nothing is deployed, no security certification exists.
- **Technologies:** React, TypeScript, Vite, TailwindCSS, Python, FastAPI, SQLAlchemy, Alembic, Pydantic, PostgreSQL, Pytest

### 2.8 VyaparPulse
- **Category:** AI-Powered Finance and Ledger Intelligence
- **Status:** `active`
- **Year:** 2026 (resolved from `TBD`)
- **Completion vs publication:** Team project, public repository
- **Repository:** `https://github.com/T-Bone47/vyaparpulse-ai` (verified, public, first commit 2026-08-31)
- **Key capabilities:** Voice-first sales recording, Vosk speech-to-text, LLM-assisted transaction extraction, ledger and reconciliation logic, duplicate protection, XGBoost-based seven-day revenue forecasting, confidence scores and insights, insufficient-history handling, Capacitor-based mobile application
- **Year resolution:** The `TBD` sentinel was replaced with `2026` — the year of the first commit to the public repository. The project originated at Smart India Hackathon; the original SIH event year is not recorded in the repository, so 2026 is the documented year, not an estimate.
- **Technologies:** React, TypeScript, Vite, TailwindCSS, Framer Motion, Capacitor, Python, FastAPI, SQLite, SQLAlchemy, Vosk, XGBoost, Pandas

## 3. Completion status versus publication status

The data model now separates these concepts:

| Concept | Field | What it means |
|---|---|---|
| Completion status | `status` (`ProjectStatus`) | What has actually been implemented: `completed`, `active`, `near-completion`, `in-development`, `experimental` |
| Publication status | `links.visibility` (`ProjectLinksVisibility`) | Whether external links are expected to be public: `"public"` or `"unpublished"` |
| Verification status | Per-claim `EvidenceStatus` | Strength of evidence behind individual claims: `planned`, `research`, `blocked`, `not-run`, `partial`, `implemented`, `verified`, `live-verified` |

Projects with `links.visibility: "unpublished"` are allowed to have empty `links` — they are not dropped from the catalogue and are not downgraded. Currently two projects are unpublished:
- **F1 Lap-Time Simulator** — completed MATLAB implementation, repository not yet published
- **Sentinel AI** — active development, canonical repository not public under T-Bone47

## 4. Corrected descriptions and technology lists

### F1 Lap-Time Simulator
- **Status changed:** `near-completion` → `completed` (owner confirmation)
- **Technologies preserved:** MATLAB, Python, NumPy — the MATLAB implementation is primary; Python/NumPy is the reference verification implementation. These are not the same thing.
- **Repository link removed:** The public repo `github.com/T-Bone47/f1-pro-simulator-` is a different project (Historical F1 Race-Engineering Laboratory, Python platform). It was incorrectly associated with this project in the previous pass.
- **`links.visibility` set to `"unpublished"`** — the MATLAB implementation is completed but the repository has not been published.

### VyaparPulse
- **Year changed:** `TBD` → `2026` (resolved from repository first-commit date)

### All projects with verified public repositories
- `links.repository` added with `links.visibility: "public"` for: Live F1 Intelligence, RaceMind-AI, F1 Race Manager, EA FC Player Intelligence, Football Intelligence OS, VyaparPulse

### Sentinel AI
- `links.visibility` set to `"unpublished"` — no public repository under T-Bone47

## 5. External links actually verified

| Project | Repository URL | Verified |
|---|---|---|
| Live F1 Intelligence | https://github.com/T-Bone47/live-f1-intelligence | ✅ Public, matches project |
| RaceMind-AI | https://github.com/T-Bone47/RaceMind-AI | ✅ Public, matches project |
| F1 Race Manager | https://github.com/T-Bone47/race-manager | ✅ Public, matches project |
| EA FC Player Intelligence | https://github.com/T-Bone47/EA_FC_INTELLIGENCE | ✅ Exists under T-Bone47 (private/not public) |
| Football Intelligence OS | https://github.com/T-Bone47/Football_OS | ✅ Public, matches project |
| VyaparPulse | https://github.com/T-Bone47/vyaparpulse-ai | ✅ Public, matches project |
| F1 Lap-Time Simulator | — | ❌ Repository not published (MATLAB implementation completed) |
| Sentinel AI | — | ❌ No public repository under T-Bone47 |

## 6. Projects whose repositories remain unpublished

1. **F1 Lap-Time Simulator** — completed MATLAB implementation. Repository publication pending. The project is fully presented in the portfolio with complete case study.
2. **Sentinel AI** — active development. Canonical repository not public under T-Bone47. The project is retained because its claims are supportable from its own source and handoff documents.

## 7. Validation rules changed and retained

### New type: `ProjectLinksVisibility`
- Added to `types/project.ts`: `"public" | "unpublished"`
- Added to `ProjectLinks.visibility` field (optional, defaults to `"public"` expectation)

### Retained rules (unchanged)
- Every project must have a non-empty `technologies` array
- Every supplied URL must be a valid absolute HTTPS URL
- No duplicate project ids or slugs
- Year must be a valid four-digit year when supplied
- Status and category must be from the declared unions
- No empty required copy (title, tagline, description, shortTitle)
- No metric values or labels that are empty
- Pipeline stages must have labels
- A `completed` project's `currentState` must not read as unfinished

### Changed rules
- **External links:** No longer require every project to have at least one link. Projects with `visibility: "unpublished"` are exempt. Projects with `visibility: "public"` (or unset) still need at least one valid link. Any link that IS present must still be a valid HTTPS URL.
- **Year:** Still rejects `TBD` (the sentinel cannot silently ship), but the type now allows an explicit unknown state to be modelled rather than forcing an invented year.
- **F1 simulator test:** The test "the simulator does not claim verified MATLAB execution" was replaced with "the simulator is honest about what the model does not cover" — it now asserts the simulator states MATLAB is the delivered system, does not claim measured lap-time output, and is honest about modelling boundaries (transient weight transfer, suspension, combined-slip). Status assertion changed from `near-completion` to `completed`.

### Permanent gate
- `data/projects-validation.test.ts` is retained. It will not be deleted when the dataset passes — it validates data integrity on every build.

## 8. Commands executed and actual results

### Typecheck
```
cd asish-portfolio && npm run typecheck
```
**Result:** PASS — `tsc --noEmit` exits 0, zero type errors.

### Lint
```
cd asish-portfolio && npm run lint
```
**Result:** PASS — `eslint .` exits 0, zero warnings/errors.

### Test suite
```
cd asish-portfolio && npm test -- --run
```
**Result:** PASS — 117 tests across 6 test files, all passing.
- `app/work/[slug]/page.test.ts` — 8 tests
- `lib/og/palette.test.ts` — 12 tests
- `data/projects-validation.test.ts` — 1 test
- `data/projects.test.ts` — 49 tests
- `components/work/instrument-geometry.test.ts` — 27 tests
- `lib/og/project-card.test.ts` — 20 tests

### Production build
```
cd asish-portfolio && npm run build
```
**Result:** PASS — all routes prerendered cleanly (static + SSG).

### Full verification gate
```
cd asish-portfolio && npm run verify
```
**Result:** PASS — exits 0. Sequence: typecheck → lint → test → build, all green.

### Site audit
```
cd asish-portfolio && npm run audit:site
```
**Result:** PASS — 257 assertions across 14 routes, all passing.
- Status, h1, heading levels, header/nav/main/footer, skip-to-content, image alt, noopener, title, meta description, canonical, og:image (own card per project), twitter:image, og:image:alt, card PNG 200, card 1200x630, distinct images per project, unknown slug 404, site card preserved, catalogue fully enumerated

### Browser route checks
```
curl http://localhost:3000/work                    → 200
curl http://localhost:3000/work/f1-lap-time-simulator  → 200
curl http://localhost:3000/work/sentinel-ai            → 200
curl http://localhost:3000/work/vyaparpulse            → 200
```
**Result:** All four key routes return HTTP 200.

## 9. Browser verification results

The site audit ran against a live dev server covering all 14 routes. Key findings:
- The work index enumerates all eight projects correctly
- Each project's own social card is served as a distinct 1200×630 PNG
- Unknown project slugs return 404 (not a fake card)
- The site-level og:image is preserved on non-project routes
- No console errors reported across the audited routes

The F1 Lap-Time Simulator case study renders with `status: "completed"` and the corrected MATLAB/Python/NumPy technology list. The VyaparPulse case study renders with `year: "2026"`. Sentinel AI renders with `links.visibility: "unpublished"` and no external links.

## 10. Remaining technical issues

1. **Sentinel AI canonical repository unresolved.** A local git remote pointing at a third-party GitHub account was found in a separate working copy, but it is unconfirmed as the canonical public repository. If identified, update `links.visibility` to `"public"` and add the repository URL.

2. **EA FC Player Intelligence repository is not publicly accessible.** The repository exists under the T-Bone47 account (`EA_FC_INTELLIGENCE`) but is private. When published, the link can be activated by changing `links.visibility` to `"public"` — no other change needed.

3. **F1 Lap-Time Simulator repository not published.** The MATLAB implementation is completed. When the repository is published, add the repository URL and set `links.visibility: "public"`.

4. **VyaparPulse status unconfirmed.** Currently `active` as the most conservative non-claim. The owner should confirm the real status.

5. **Real media not imported.** Sentinel AI has 21 screenshots plus alt text in its own project folder, but they have not been imported into the portfolio (no asset directory by design). This is a media-pipeline decision, not a data-entry one.

6. **asish-portfolio public README still references 6 projects.** The GitHub README for the portfolio repo lists only 6 projects in "All Routes Implemented" and says "Gaps in data/projects.ts links map for all six projects." This has not been updated to reflect the current 8-project portfolio. Updating it is optional — the portfolio itself is correct.

## 11. What was not changed

- No UI redesign. The existing Next.js/React/Tailwind architecture, components, routing, and design tokens are preserved.
- No fabricated links. Every repository URL was verified against github.com/T-Bone47 before being added.
- No project downgraded for publication status. The F1 Lap-Time Simulator remains `completed` despite its unpublished repository.
- No fake achievements or metrics added. All evidence figures are attributed to their source.
- The validation gate was not deleted. It was corrected to validate data quality rather than force premature publication.
