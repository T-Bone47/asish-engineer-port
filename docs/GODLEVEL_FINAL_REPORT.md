# GODLEVEL FINAL REPORT — Asish Oliver M Portfolio

Deep transformation pass. All results measured against a **production
build** (`next build` + `next start`), not a dev server.

---

## 1. Initial audit

Recorded in [godlevel-visual-audit.md](./godlevel-visual-audit.md). The core
finding:

> **Content quality exceeded visual expression.** The repository held a
> 9-stage pipeline, a three-pass solver, and five measured telemetry
> figures — and the interface rendered nearly all of it as
> `heading → paragraph → hairline → next section`.

Six projects were visually indistinguishable: a telemetry pipeline, a
numerical vehicle solver, a team-management game and a voice-to-ledger
forecast all rendered with the same components in the same layout. The
`Project` model had no `thesis`, `tradeoffs`, `nextIteration` or
`visualizationType`; `limitations` existed but was populated for **0 of 6**
projects.

## 2. Visual changes

**Per-project visual identities** — the single largest change. Six
deterministic SVG instruments, each drawn from what that system actually is:

| Type | Geometry |
|---|---|
| `telemetry` | discrete event ticks resolving into a continuous trace |
| `vehicle` | corner arc with apex marker + friction-circle balance |
| `strategy` | stint timeline with a dashed pit window and degradation |
| `team` | management board — two hubs feeding a weekend hub with spokes |
| `dataset` | two separated clusters split by a feature-engineering rule, ranking out |
| `forecast` | series inside a widening confidence band |

Measured: **5 distinct structural signatures** across the five index rows.
§80's test — distinguish telemetry / sim / AI / game / data within seconds —
now passes.

**Shape-aware architecture.** Diagrams follow the actual architecture:
`converge` renders Live F1's four providers fanning into the canonical model;
`sequential` renders the simulator's nine-stage run. Verified: Live F1 reads
"Fig. 02 Converging architecture · 9 stages", the simulator reads
"Fig. 02 Sequential architecture · 9 stages".

**Figures.** `Fig. NN` numbering with captions and a shape descriptor —
engineering-publication register.

**Signature visual** retained and extended: responsive split (cropped heavy
track at <640px, full two-channel figure above).

## 3. UX changes

- **Case-study hero** no longer opens with a title and a wall of text. It
  opens with catalogue number, domain, status, **one-sentence thesis** and
  the project's own instrument — then the prose.
- **Metrics promoted** into a hero evidence band (they were below the fold,
  under the architecture).
- **`tagline` now renders** — present in the data for all six projects,
  previously unused.
- **Technologies now render** on case studies — 12 were in the data for the
  flagship and none were shown.
- **Active-route indicator** with `aria-current="page"` and a prefix rule, so
  WORK stays current while reading a case study.
- **Hero CTAs** → `View Selected Systems` / `Engineering Profile`.
- **System status bar** — each domain now carries the live status of the
  project backing it.
- **Experience** rebuilt as a timeline instrument (period, rail, node,
  current marker) rather than a divided list.

## 4. Motion system

Unchanged in principle and still dependency-free: `animation-timeline: view()`
for section reveals, CSS keyframes for the boot readout, `transition` for
interaction. **No animation library is installed or needed.**

All new visuals are **static SVG**. They add zero animation cost and are
therefore reduced-motion safe by construction — there is no moving state to
disable. The one new motion affordance, the nav indicator, is a
`transition-[width,opacity]` that settles in 300 ms and is covered by the
existing global reduced-motion override.

## 5. WebGL decision

**Declined, not deferred.** The SVG instrument is more convincing than a 3D
scene would be at this scale, and the brief is explicit that WebGL should be
removed if it is less convincing. `three`, `@react-three/fiber` and
`@react-three/drei` remain removed.

## 6. Project storytelling

The full spine now renders on every case study:

`Number · Domain · Status · Thesis · Instrument` →
`Engineering Problem` → `Architecture` → `Engineering Trade-offs` →
`Implementation` → `Algorithms / Models` → `Validation` → `Limitations` →
`Next Iteration` → `Current State`

- **Thesis** — 6/6 populated.
- **Limitations** — **6/6 populated** (was 0/6).
- **Trade-offs** — problem → decision → result, 6/6.
- Owner-supplied technical depth added: the simulator's quasi-steady-state
  point-mass model, three-pass solver, closed-loop convergence,
  constant-radius closed-form correction after solver divergence, and
  Python/NumPy reference validation; EA FC's 16,228-player scope; VyaparPulse's
  7-day forecast, duplicate protection and team identity.

## 7. Accessibility

- Touch targets: several standalone links measured 16–28 px tall, below the
  WCAG 2.2 AA 24 px minimum. Padded out — measured post-fix at 44 / 44 / 81 /
  32 / 32 px on `/contact`, **none under 24 px**.
- **Header overflow at 768 px was a real accessibility and layout bug** —
  primary nav and the utility cluster both switched on at `md`, producing
  ~700 px of content in a 640 px container and overflowing the viewport by
  3 px. The utility cluster is now staged to `lg`, with the toggle persisting
  to `lg`. Verified: 768 px → nav + toggle, 0 overflow; 1024 px → utilities,
  toggle hidden, 0 overflow.
- Case-study trade-offs moved from a left rule to a top rule, removing a
  third repeated left-border motif (accent thesis / critical limitations /
  neutral trade-offs were becoming a pattern).
- All new figures: decorative instances `aria-hidden`, meaningful instances
  `role="img"` with a description including "illustrative schematic".

## 8. Performance

Unchanged and still clean: **3 runtime dependencies** (`next`, `react`,
`react-dom`). The new instruments are server-rendered SVG with fixed path
constants — no `Math.random()`, no `Date`, no `useId`, no measurement, no
client JS. Six new SVG figures add kilobytes of markup, not a bundle.

## 9. SEO

Unchanged and verified: unique title + description + canonical + `og:image`
on all 11 indexable routes; `robots.txt` and `sitemap.xml` generated from
route and project data; favicon and dynamic social card.

## 10. Security

No secrets, keys, tokens or private URLs. No `.env` file committed.
`.gitignore` hardened from `.env*.local` to `.env` / `.env.*` with
`!.env.example`.

## 11. Test results

**40 unit tests** across 2 files, all passing. Added this pass:

- every project states a thesis, limitations, visual identity and shape
- trade-offs are stated as problem → decision → result
- **truthfulness locks:** the simulator does not claim verified MATLAB
  execution; RaceMind-AI does not claim a finished frontend; Race Manager is
  labelled a game; EA FC makes no accuracy claim; VyaparPulse is identified
  as a team project; the simulator publishes no lap-time figures

**179 live-site assertions across 12 routes**, all passing against
production.

> Two bugs caught by these gates this pass: an empty "Performance / Results"
> section left behind after metrics moved to the hero, and `F1 Race Manager`
> having no stated decision. Both fixed; both now covered.

## 12. Browser QA

Measured at **320 / 360 / 390 / 768 / 1024 / 1440 / 1920**:

| Width | Result |
|---|---|
| 320 | 0 overflow; metrics 2-up; instrument 214 px |
| 768 | 0 overflow (after header fix); trade-offs 3-up |
| 1024 | 0 overflow; utilities shown, toggle hidden |
| 1440 | 0 overflow; container 1152 px centred; trade-offs 234.7 px ×3 |
| 1920 | 0 overflow; H1 93.44 px, 2 lines |

Content QA: no Lorem/TODO/FIXME/placeholder/`NaN`/`undefined` in **visible
text**. (`$undefined` appears only inside the React Server Component flight
payload; `nan` only inside "financial"/"provenance".) CGPA and marks appear
only in comments that explicitly disable them.

Impeccable detector: 2 findings, both false positives — neutral `#2B2E35` 3px
corner crop marks in the 1200×630 social card, pattern-matched as coloured
side-tabs.

## 13. Content audit

No fabricated content introduced. Metrics rendered verbatim — no client-side
rounding. Verified evidence remains Live F1 Intelligence only, and a test
asserts that, so adding metrics elsewhere becomes a deliberate reviewed
decision.

## 14. Remaining owner input

Repo/demo/documentation links for all six projects; technologies for
F1 Lap-Time Simulator and EA FC Intelligence; year + status for
EA FC Intelligence / VyaparPulse; real project media; `NEXT_PUBLIC_SITE_URL`.

## 15. Known limitations

- **Still not a git repository.** Nothing committed.
- LCP/CLS/INP reasoned about but **not measured** with a profiler — do not
  claim the numbers.
- Motion+ MCP unconfigured (`npx motion-ai` requires a TTY). Nothing depends
  on it.
- Screenshots could not be captured in this environment (the preview webview
  does not composite), so visual QA was done through measured DOM geometry,
  computed styles and contrast — not pixels.
- Route transitions declined: any entrance animation delays LCP.

## 16. Verified vs illustrative

**Verified — measured, reproducible:**
Live F1 Intelligence — 1,067,193 canonical events · 0 malformed records ·
~2,650 events/s · ~0.10 ms p50/event · 99 MB peak memory.

**Illustrative — schematic, labelled on the canvas:**
All six project instruments; the Circuit / Speed Profile figure
(`SCHEMATIC — NOT MEASURED`); all architecture diagrams.

**Deliberately absent:**
No lap-time figures (simulator output unverified). No ML accuracy figures.
No live-F1 claim anywhere. No grade, CGPA, score or academic metric. No
ratings, rankings, "#1", or "world-class" language.

---

# PROJECT INTELLIGENCE EXPANSION

**Date:** 2026-10-03 · **Scope:** EA FC Player Intelligence, Football
Intelligence OS · **Status:** verified and shipped

## 17. Why this phase happened

Visual review found a specific failure: the EA FC page was thin, generic
placeholder copy, and the Football Intelligence OS project did not exist on
the site at all — despite being the owner's largest and most recent data
engineering work. The portfolio's most substantial system was invisible.

The brief called for reconnaissance before writing. Both source repositories
were located on disk outside the portfolio workspace and read directly.

## 18. Reconnaissance — what was actually read

**EA FC Player Intelligence** (`ea-fc-intelligence/ea_fc_player_intelligence`)
— `README.md`, `docs/INTELLIGENCE_ENGINE_ARCHITECTURE.md`,
`docs/ENGINE_BASELINE.md`, `docs/ENGINE_DATA_REQUIREMENTS.md`,
`docs/CARD_DATA_ACQUISITION.md`, `data/fc26_real_foundation/MANIFEST.json`,
the full `backend/` tree, and the FC27 dataset workspace at `~/fc27_dataset`.

**Football Intelligence OS** (`football-intelligence-os`) — `README.md`,
`docs/ARCHITECTURE_DECISIONS.md` (ADR-001…008), `docs/DEVELOPMENT_STATUS.md`,
`apps/api/` provider, ingestion, normalisation, canonical-model and route
modules, migrations 0001–0013, and the capability-registry seed data.

Existing portfolio copy was treated as unverified and overwritten.

## 19. Numbers that changed, and why

The brief supplied two figures. Both were stale, and both were corrected
against the source rather than published as given.

| Claim in brief | Reality | Action |
|---|---|---|
| Football OS: 45 passed / 0 failed / 1 skipped | **609 passed / 0 failed / 61 skipped** | Suite executed; the brief's figure described an early phase. |
| EA FC: 16,228 FC26 players | Confirmed exactly | `ea_fc26_players.csv` = 16,228 rows (14,412 outfield + 1,816 GK). Used unchanged. |
| EA FC: `UT_CARD_SCOPE` disabled | Flag does not exist in the repo | Replaced with what *is* verifiable: the UT card pipeline is built and data-ready but has no permitted data source. |

Test suites were **executed**, not summarised:

```
Football Intelligence OS   PYTHONPATH=apps/api python -m pytest -q
                          670 collected · 609 passed · 0 failed · 61 skipped
                          (61 skip because a live Postgres was unreachable)

EA FC Player Intelligence  python -m pytest backend/tests -q
                          441 collected · 278 passed · 138 skipped · 25 failed
```

The EA FC result is published in full rather than summarised to a flattering
number. The 25 failures decompose as: 10 deliberate `assert False` debug
probes left in the tree, 9 genuine open OVR-trap / tactical-flip gaps in the
Phase 7 adversarial suite, and 6 CSV decode errors caused by the Windows
cp1252 default locale. The 9 real ones are surfaced on the page as the
project's known open work.

## 20. EA FC 26 → restructured around the version model

The project is no longer "the EA FC project". It is two release lines with a
wall between them, because they have opposite statuses:

- **FC26 — baseline, complete.** 16,228 players, 60 columns, CC0 public
  source, per-file SHA-256 recorded at retrieval. Served live by the engine.
- **FC27 — active acquisition, zero records imported.** Target 20,689.
  The engine was made FC27-*capable* before any FC27 data existed: version
  config, request guard and a 404 no-data wall are implemented and tested,
  so an FC27 request can never be silently answered with FC26 values.

Field mapping, 14 executable data-quality gates, migration SQL and an
identity-review queue are all **defined but deliberately not executed**,
because no authorised FC27 source exists. EA publishes no bulk feed with a
redistribution licence and every community database prohibits scraping, so
nothing was taken from them.

Rendered as a dedicated `VersionWall` figure with an explicit seam —
*data never crosses* — plus a regression test that fails if FC27 is ever
marked verified.

## 21. Football Intelligence OS — added as the 7th project

Positioned as a distinct system answering a different engineering question:
EA FC asks *how do we turn player data into player intelligence?*; Football
Intelligence OS asks *how do we build trustworthy football data
infrastructure across providers?*

Content is read from source, not authored:

- **Providers** — StatsBomb (keyless, live-verified), API-Football (active,
  four capabilities live-verified with real result counts), football-data.org
  (implemented and tested, inactive by default per ADR-008).
- **Capability matrix** — all 17 registry rows reproduced exactly, including
  StatsBomb `360` marked *not exposed*. `Documented` and `Live verified` are
  rendered as independent columns, mirroring the source schema's split between
  `available` and `last_verified`.
- **Lineage** — DataSource → IngestionRun → DataSnapshot (content-addressed)
  → Canonical record → Consumer.
- **Retry/backoff** — tenacity, 3 attempts, retry on 429/5xx only, never on
  4xx, honours `Retry-After`, exponential 0.5–8 s. Eight typed exception
  classes.
- **Architecture** — modular monolith with 24 canonical models across 13
  migrations, stated as a decision with reasoning rather than drawn as a
  microservice mesh.

## 22. Engineering-system work

**Data model.** `types/project.ts` extended with optional, generic blocks:
`constraints`, `dataFlow`, `providers`, `capabilities`, `lineage`,
`validationClaims`, `testing`, `stateItems`, `apiSurface`,
`separatelyScoped`, `versionHistory`, `tags`, `order`. All optional; every
renderer is gated on presence. This is the shared template's schema, not a
one-off page.

**Figure system.** Reusable SVG/CSS-only components in
`components/work/figures/`: `EngineeringFigure` (shell), `VersionWall`,
`ProviderGraph`, `CapabilityMatrix`, `DataLineage`, `IntelligencePipeline`,
`FeatureSpace`, plus `EvidenceBadge` / `EvidenceLegend`.

**A deliberate vocabulary.** `EvidenceStatus` separates
live-verified > verified > implemented > partial > not-run > blocked >
research > planned, mirroring the discipline the source repos already apply
to their own capability registries. Green is reserved for `live-verified`
alone, so a badge always means something.

**Accessibility.** Every figure carries a title, a caption, ARIA labelling and
a "Read this figure as text" fallback restating the same information as prose.
Interaction is CSS-only (`group-hover` / `focus-within`) — no new client
components, and everything is readable without a pointer.

**Visual distinction.** A new `platform` visualization type was added for
Football Intelligence OS. It draws many provider streams collapsing into a
canonical spine; the existing `dataset` instrument stays EA FC's
player-feature language. The two football projects cannot be mistaken for each
other, and a test enforces that.

**Navigation.** Case studies now carry PREVIOUS / ALL SYSTEMS (07) / NEXT,
respecting narrative order and one-sided at the catalogue ends rather than
wrapping.

## 23. Changes to the rest of the site (all data-driven)

- Homepage **Selected Systems** now lists all seven, in narrative order.
  Previously it filtered to `featured` only, which meant both football
  projects were invisible until a visitor navigated into `/work`.
- **Engineering Domains** gained Data Engineering, Systems & APIs and Sports
  Analytics; AI/ML gained Player Intelligence and Explainability.
- **AI/ML section** rewritten from three generic chains into six flows naming
  the real transformation in each system.
- **Sitemap, routes, nav, metadata and og:image** all derive from
  `data/projects.ts` and picked up the new project automatically.

## 24. QA findings — including one against this audit itself

- **Figure numbering was broken.** Per-block-type constants produced
  "Fig. 01, 03, 05, 04, 06" — out of sequence in the DOM, because allocation
  order and JSX render order disagreed. Replaced with a render-order
  allocator.
- **The tap-target audit check was a hardcoded pass.** `tests/site-audit.mjs`
  recorded a passing check labelled "verified at 320/360/390" that measured
  nothing at all, since the script fetches HTML and cannot compute geometry.
  Re-measuring manually found **4 real violations** (footer and header utility
  links at 16px). Those were fixed, and the check is now honestly labelled as
  manual with its procedure written down. A safety assertion that measures
  nothing is worse than no assertion.
- **The audit had never seen the new route.** The route list was hardcoded and
  did not include `/work/football-intelligence-os`, so the new page shipped
  unverified until caught. Added.

## 25. Verification

| Gate | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm run lint` | clean |
| `npm test` | **45 passed** (was 40) |
| `npm run build` | 18 routes (was 17) |
| `node tests/site-audit.mjs` | **194 assertions / 13 routes** — all pass |
| Overflow @ 320/360/390/768/1024/1440/1920 | none (303px doc @ 320px viewport) |
| Tap targets >= 24px | 0 violations |
| Console / hydration errors | none |

New test coverage added for the version wall's honesty rules, EA FC/Football
OS separation, UT-card scoping, test-evidence arithmetic, and figure
reachability.

## 26. Verified vs illustrative vs still open

**Verified (measured or read from a dated source artifact):**
FC26 16,228 players · 20,689 FC27 target with 0 imported · 14 FC27 quality
gates · 441/278/138/25 EA FC test counts · 609 passed / 0 failed / 61 skipped
Football OS · 3 providers · 17 capability rows · 4 live-verified API-Football
capabilities · 24 canonical models · 13 migrations · 64 canonical endpoints ·
748.8 ms full-pool warm p50 (repo benchmark, dated).

**Illustrative (labelled as such on the page):**
All project instruments, the feature-space scatter, every architecture
diagram. No animated data implies a live feed.

**Still open:**
FC27 has zero imported records and is blocked on data permission. Nine
adversarial OVR-trap cases fail. The Football OS integration suite and
container deployment were not executed here. Two provider adapters are
verified only through mocked transports. No model accuracy figure is
published anywhere, because none has been verified — the EA FC engine is
deterministic scoring, not a trained model.

**Not claimed anywhere:** EA/FIFA licensing or partnership, commercial data
access, live football feeds, live player prices, users, deployments or
clients.
================================================================================
PHASE D — RECRUITER-FIRST REFINEMENT
================================================================================

WHAT THIS PASS WAS. Not a rebuild and not a redesign. The visual identity, the
design tokens, the type system and the motion work from Phases A and B are
untouched. What changed is the information hierarchy: which information a
visitor meets, in what order, and how much of it is on screen before they
have to ask for more.

THE PROBLEM THIS FIXED. Phase C made the two football projects genuinely
substantial — real repositories, real registries, real test runs. It also
made them documentation. Measured before this pass, the case-study template
rendered 16 and 17 `h2` sections on EA FC Player Intelligence and Football
Intelligence OS, with provider matrices, 17-row capability registries,
64-endpoint tables, lineage chains and subsystem state all inline in the
primary view. The two strongest engineering projects on the site were also
the two hardest to read, and a 15-second visitor left with a registry
inventory rather than an impression of the engineer.

--------------------------------------------------------------------------------
§27-30 — THE FOUR LEVELS, NOW REAL
--------------------------------------------------------------------------------

Level 1 (3s)  Card row: number · name · domain · status · one-line purpose ·
               3–7 chips · one evidence item · VIEW CASE STUDY →
Level 2 (10s) Hero: number/status/domain/year · title · one-sentence thesis ·
               2–4 chips · one evidence metric · primary + secondary action
Level 3 (30s) 01 Overview (four blocks) · 02 Problem · 03 System ·
               04 Engineering · 05 Evidence · 06 Current State ·
               07 Limitations · 08 Next · 09 Technologies · 10 Links
Level 4       One `TECHNICAL DETAIL +` disclosure at the foot of the page.

Measured after: Football OS 17 → 10 sections, EA FC 16 → 10, Live F1 7 → 9
(now it has four brief blocks it previously had nothing equivalent to).
On both football pages the recruiter's complete read now ends at 44% and 47%
of document height respectively.

--------------------------------------------------------------------------------
§28 — NEW FIELDS ON THE PROJECT MODEL
--------------------------------------------------------------------------------

Four fields were added to `types/project.ts`. All three of the first are
REQUIRED, so a project cannot be added to the catalogue without them:

  hook        one memorable engineering line — the whole card in three seconds
  evidence    the single evidence item; a figure only where a figure is
              verified, otherwise an evidence statement
  brief       the four-block 30-second read (problem / built / approach /
              result), 1–2 sentences each, written short on purpose
  keyTechnologies  3–7 curated chips; optional, falls back to `technologies`

`brief` is deliberately NOT derived from `problem` + `description` +
`results`. Those three were written to be complete — a problem statement has
to explain the fragmentation. Compressing them automatically produces either a
truncated claim or an unreadable one, so the short form is written by hand
and the long form stays long.

--------------------------------------------------------------------------------
§29-30 — WHAT MOVED, AND WHAT DELIBERATELY DID NOT
--------------------------------------------------------------------------------

Moved into the appendix: design constraints, algorithm and implementation
write-ups, the provider abstraction graph, the capability registry, data
lineage, the feature-space figure, the full test-run table, the API surface
table, subsystem-by-subsystem state, separately-scoped subsystems, and the
version-line bookkeeping bullets.

Kept in the primary view, deliberately: verified metrics, the FC26 → FC27
version wall, the validation matrix, limitations, current state, next. §11
says "do not hide important evidence, hide implementation complexity" — that
line is enforced by a test, not by intention.

The version wall was split rather than moved. `VersionWall` now renders the
status, the summary and the measured stats above the fold, and `VersionBuckets`
renders the shipped / in-progress / defined-not-executed / blocked lists in
the appendix. Nothing is repeated between them, and FC26 → FC27 is still
legible in one screen — which was the point of building the wall in Phase C.

--------------------------------------------------------------------------------
§31 — THE APPENDIX IS ONE NATIVE <details>
--------------------------------------------------------------------------------

`components/work/TechnicalDetail.tsx` is a CSS-only disclosure built on
`<details>` / `<summary>`. The budget for this portfolio is two client
components (`app/error.tsx`, the header menu) and an accordion is not worth a
third. Native disclosure gives keyboard operation, the correct ARIA role,
no-JS support and a hydration-free boundary for free.

The panel renders only when the project actually has level-4 content. This
was a real defect caught in browser QA, not a hypothetical: Live F1 has
trade-offs and validation prose but no registry and no endpoint table, and
was shipping a "TECHNICAL DETAIL +" affordance promising provider contracts
and a capability registry that did not exist. Four of seven case studies now
have no appendix at all — which is the correct outcome, not a missing one.

--------------------------------------------------------------------------------
§32-34 — THE INDEX, THE FLAGSIP AND THE HOMEPAGE
--------------------------------------------------------------------------------

`ProjectIndexRow` was reduced to exactly the eight items §05 permits. The
hover-reveal instrument and the floating metric column came off; the visible
"VIEW CASE STUDY →" label replaced a bare arrow, and the row's single link
covers the whole surface.

Index numbers are now the catalogue position, so a row labelled 02 opens the
case study labelled 02. They used to restart at 01 for the non-flagship set.

The flagship block dropped its description, architecture summary and stack
list — all three now live on the case study, and carrying them made the same
paragraphs appear twice within one click. What justifies a featured treatment
is what remains: hook, thesis, the full evidence band, the instrument.

The homepage used to render all seven projects as rows identical to /work.
The archive was a duplicate of the homepage rather than somewhere new to go.
It now previews the three systems that carry measured evidence — derived by
the same rule as the flagship (`metrics.length > 0`), not hand-listed — and
states the full count so nothing is hidden by omission.

--------------------------------------------------------------------------------
§33 — THE TECHNICAL ARSENAL, REGROUPED
--------------------------------------------------------------------------------

Six groups, mapped to how a recruiter actually filters: Languages · AI/ML ·
Backend & Data · Frontend · Motorsport & Simulation · Infrastructure &
Practice. The previous six mixed languages with libraries with methods, so
the section meant to answer "what kind of engineer is this?" could not.

Nothing was added that is not already attested in `data/projects.ts` — a
dependency in a project's stack or a tool named in a project's own copy.
Frontend was previously absent entirely despite two React projects.

Experience (§23) now carries two to four contributions per role. IGNICT's six
bare nouns became four contributions, selected and rephrased from the items
the brief supplied — no new claim.

--------------------------------------------------------------------------------
§36 — F1 LAP-TIME SIMULATOR TECHNOLOGIES
--------------------------------------------------------------------------------

`technologies: []` with a TODO is now `["MATLAB", "Python", "NumPy"]`. Each of
the three was already named in this project's own copy — MATLAB in
`limitations` and `nextIteration`, Python/NumPy as the validated reference
implementation in `tradeoffs`. Nothing was inferred from what a lap-time
simulator "ought" to use. Without it the project rendered a card with no
chips at all.

A second, more valuable fix was caught by the new chip test: RaceMind-AI's
curated chips claimed "Python", which was not in that project's declared
stack. The chip list was corrected rather than the stack padded.

--------------------------------------------------------------------------------
§38 — EVIDENCE ORDERING
--------------------------------------------------------------------------------

`metrics[0]` is what the index card and the case-study hero promote, so array
order IS the headline claim. Football OS led with "3 provider adapters"; it
now leads with the executed test run — 609 passed, 0 failed — and the hero
renders the metric's `note` beneath it, so "61 skipped (no live PostgreSQL)"
travels with the number. A figure printed without its caveat reads cleaner
than the run was, and that is precisely the failure this portfolio exists to
avoid.

--------------------------------------------------------------------------------
§39-41 — VALIDATION, AND WHAT BROKE
--------------------------------------------------------------------------------

  npm run verify      typecheck · eslint · 57 tests · 18 routes · build OK
  node tests/site-audit.mjs
                      194 assertions across 13 routes — all pass
  Browser QA          320 / 375 / 768 / 1440 — zero horizontal overflow on
                      every route, appendix open and closed; zero console
                      errors, zero hydration errors, all requests 200

Tests went 45 → 57. Nothing was deleted; the case-study mirror in
`page.test.ts` was rewritten for the §09 order, and ten locks were added:

  - every project has a hook, under 90 characters, and no two are alike
  - an evidence statement containing a digit requires a measured metric
  - every brief block is written and under 330 characters
  - no brief block repeats the long description
  - card chips are 3–7 and every chip exists in the project's own stack
  - every project can render a chip row
  - the page still has a render site for all 22 optional data fields
  - the page renders the appendix through `<details>` and contains no
    "use client"
  - validation evidence and limitations sit ABOVE the disclosure, not inside
  - the appendix is offered only when the project has deep content

The last two are the ones that matter: content can now be silently moved
behind a disclosure, and it can be silently dropped from the page entirely.
Both are now test failures rather than things to notice later.

--------------------------------------------------------------------------------
§72 — ACCEPTANCE CRITERIA
--------------------------------------------------------------------------------

  [x] recruiter understands the portfolio in 30s        Levels 1–3 all above
                                                        the appendix boundary
  [x] every project has a clear one-line purpose        required `hook`
  [x] every project has visible domain/status           card + hero
  [x] every project has concise technologies            3–7 curated chips
  [x] every project has evidence where available        required `evidence`
  [x] project pages do not feel like documentation      16/17 sections → 10
  [x] technical depth still exists                      nothing deleted
  [x] technical depth is progressively disclosed         one CSS-only <details>
  [x] Football OS provider matrix not primary           moved to appendix
  [x] EA FC concise above the fold                       hero + 30-second read
  [x] FC26 → FC27 immediately understandable             split wall, stats up
  [x] Live F1 metrics remain prominent                   hero + flagship band
  [x] Lap-Time Simulator remains credible                MATLAB/Python/NumPy
  [x] RaceMind remains clearly AI + telemetry            hook + thesis
  [x] Race Manager remains clearly a GAME                "Team management as a
                                                        strategy game"
  [x] VyaparPulse remains team/business intelligence     hook + explicit team
                                                        framing in the brief
  [x] no fake metrics                                   none added; test added
  [x] no fake links                                     none added; still none
  [x] no unsupported claims                             new copy traces to
                                                        existing data fields
  [x] no CGPA / grades / marks                          none present, none added
  [x] mobile remains excellent                          checked at 320 and 375
  [x] accessibility remains intact                       site audit 194/194;
                                                        native disclosure
  [x] reduced motion works                              `motion-reduce` on the
                                                        disclosure rotation; no
                                                        new animation
  [x] no console errors                                 verified
  [x] no hydration errors                               verified
  [x] no broken routes                                  18 static routes
  [x] production build succeeds                         verified
  [x] project navigation works                          previous / all / next
  [x] visual hierarchy feels premium                    hero, brief grid and
                                                        appendix panel read as
                                                        three distinct registers
  [x] portfolio feels like one engineer                  one voice, one card
                                                        rule, one set of terms

--------------------------------------------------------------------------------
§73 — WHAT THIS PASS DID NOT DO
--------------------------------------------------------------------------------

It did not add information. Every project already had enough; the problem
was that the amount was showing all at once. The strongest evidence here is
still the strongest it was: 1,067,193 canonical events with 0 malformed
records, a 16,228-player FC26 baseline that serves real recommendations, and
670 collected tests with 609 passing and none failing.

Owner input still outstanding, unchanged: repository, demo and documentation
URLs for all seven projects; `year` and a confirmed `status` for VyaparPulse;
real screenshots. Until the URLs exist the hero's primary action stays an
in-page "Explore the system" anchor rather than a link to nowhere.
