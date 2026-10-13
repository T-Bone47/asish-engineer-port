# F1 Voice Engineer — Project 09 Integration

Integration pass for **F1 Voice Engineer** as the ninth project in the
ASISH OLIVER M portfolio, plus the repair of corruption this pass found in the
working tree before any of that work could start.

- **Date of pass:** 2026-10-13
- **Project slug:** `f1-voice-engineer`
- **Catalogue position:** 04 (immediately after RaceMind-AI)
- **Case study:** `/work/f1-voice-engineer`
- **Repository:** none published — `links.visibility: "unpublished"`, no URL invented

---

## 1. Read this first: the working tree was corrupted

The repository was **not** in a buildable state when this pass began, and the
damage was not small. A previous edit pass had spliced file contents into each
other mid-token, and `data/projects.ts` — the single source of truth for the
whole catalogue — had lost **five of its eight projects**.

Detected before any new work:

```
$ npx tsc --noEmit
data/projects.ts(13,7): error TS1005: ']' expected.
data/projects.ts(13,12): error TS1127: Invalid character.
data/projects.ts(140,9): error TS1003: Identifier expected.
… (hundreds more)
```

```
$ grep -n '^    id: ' data/projects.ts
27:    id: "live-f1-intelligence",
140:    id: "f1-lap-time-simulator",
217:    id: "racemind-ai",
293:    id: "f1-voice-engineer",
491:    id: "live-f1-intelligence",     ← the file repeating itself
604:    id: "f1-lap-time-simulator",
681:    id: "racemind-ai",
757:    id: "f1-voice-engineer",
```

`data/projects.ts` was 885 lines holding four unique projects, each present
twice as spliced fragments:
`f1-race-manager`, `ea-fc-intelligence`, `football-intelligence-os`,
`sentinel-ai` and `vyaparpulse` were **gone**, and the file had a stray
`Record<ProjectCategory, string>` block (a fragment of `lib/og/project-card.tsx`)
wedged between two half-tokens:

```
export const projects: Project[]oject data — sourced entirely from the spec…
import type { Project }m "@/types/project";
```

Files modified after the last good build (2026-10-12 20:06), i.e. everything
the damaged pass had touched:

| File | State found | Action |
|---|---|---|
| `data/projects.ts` | 885 lines, 5 projects missing, unparseable | restored |
| `lib/og/project-card.tsx` | 1,987 lines of spliced fragments (should be 287) | restored |
| `components/work/instrument-geometry.tsx` | functional, but its 90-line rationale had been replaced with generic prose | restored |
| `components/work/ProjectInstrument.tsx` | reduced to 23 lines, losing its documented contract | restored |
| `components/work/RadioConsole.tsx` | 0 bytes, orphan | deleted |
| `components/work/figures/RadioConsole.tsx` | 165 lines, imported by nothing, duplicating geometry that belongs in `instrument-geometry.tsx` | deleted (geometry ported) |
| `app/work/[slug]/opengraph-image.tsx.bak` | stray backup | deleted |
| `app/work/[slug]/page.tsx`, `…/opengraph-image.tsx` | byte-identical to the built versions | left alone |

### How the originals were recovered

The last successful production build (`.next/`, 2026-10-12 20:06) predates the
damage by four hours, and Turbopack's chunk sourcemaps carry `sourcesContent` —
the **complete original source text**. All four files were restored from it:

```
$ node scripts/recover-dump.mjs
recovered  105810 data/projects.ts from ../../../data/projects.ts
recovered    2332 app/work/[slug]/opengraph-image.tsx
recovered    1647 components/work/ProjectInstrument.tsx
recovered   16130 components/work/instrument-geometry.tsx
recovered    9858 lib/og/project-card.tsx
recovered   31279 app/work/[slug]/page.tsx
```

`data/projects.ts` came back as 1,920 lines with all eight projects:
`live-f1-intelligence`, `f1-lap-time-simulator`, `racemind-ai`,
`f1-race-manager`, `ea-fc-intelligence`, `football-intelligence-os`,
`sentinel-ai`, `vyaparpulse`.

**Proof the restoration is exact, not approximate:** the untouched test suite
is the original one, and it returned to exactly its documented baseline —
`117 passed` — with typecheck, lint and build all passing *before* any of the
new work below started. The recovery scripts were removed afterwards; nothing
in the repository now depends on `.next` or on the damaged copies.

---

## 2. Project summary and scope

**F1 Voice Engineer** is a standalone, voice-driven race-engineering assistant
for F1 25 and the F1 2026 Season Pack: the driver speaks, the request is
interpreted, an engineering answer is produced against whatever race and
session context is available, and the reply comes back as speech, with a
compact driver-facing interface for engineer identity and communication state.

Scope of this pass, and what it deliberately does not do:

- **In scope:** the catalogue entry, the case-study content, the project's own
  visual motif, its architecture and interaction figures, its validation
  boundaries as structured data, and regression tests for all of it.
- **Out of scope:** anything that would require the project's source code (it
  has no published repository), and any in-game verification (see §6).
- **Not done on purpose:** no placeholder repository URL, no metric invented to
  give the hero a number, no fake in-game screenshot, no speech-generation
  vendor named that the project's own record does not mention.

The project remains standalone. It has its own voice and telemetry
responsibilities and is **not** an extension, module or dependency of
RaceMind-AI or Live F1 Intelligence — asserted in its content by four
constraints, one trade-off and the regression suite.

---

## 3. Technologies included, and the evidence behind each

| Technology | Role in the project | Evidence status |
|---|---|---|
| Python | Backend / orchestration language | `implemented` — stated in the project's own specification; not verifiable against source, because no repository is published |
| FastAPI | Service layer the request handling and response generation sit behind | `implemented` — same provenance |
| React | Driver-facing interface | `implemented` — same provenance |
| TypeScript | Interface language | `implemented` — same provenance |
| Vosk | **Speech recognition only** | `implemented` — named in the specification as the recognition engine. The specification names **no** speech-generation provider, so none is claimed anywhere on the page. A regression test asserts that no TTS vendor name (pyttsx3, Coqui, ElevenLabs, Azure, Google TTS, gTTS, Piper, Festival, Polly) appears in the project's content |
| UDP telemetry processing | Codemasters F1-game packet structures and their published packet sizes | `implemented` **for the structures**; `not-run` **for a live game** — see §6 |

Technologies belonging to other projects on this site (PostgreSQL,
TimescaleDB, WebSockets, Docker, Unity, Claude API) are asserted to be
**absent**, so a future copy-paste cannot quietly give this project a stack it
does not have.

No metric is published for this project. This is deliberate: in this codebase
`metrics` are values measured for this portfolio, and promoting the project's
reported test count into one would both overstate it and silently change which
projects the homepage previews (the homepage derives its previews from the
first three projects with metrics).

---

## 4. Architecture diagram source

Three figures appear on the case study, all built from data — none is
hand-drawn, and none is a screenshot:

1. **Hero motif — the voice instrument.** `components/work/instrument-geometry.tsx`,
   `voiceGlyphs`. New geometry, drawn once and shared: five level bars are the
   driver speaking, a signal bus runs through four channel slots, three arcs
   are the reply leaving the console, and a second dashed input rises into the
   bus from below because session context arrives on a path of its own. No
   `<text>` is used, matching the existing glyph convention (satori is handed a
   single font by the route that calls it). Same file renders it on the site in
   `var(--color-*)` and on the social card in literal hex, and
   `instrument-geometry.test.ts` proves the two renderings differ by colour
   values alone.
2. **Fig. 01 — the conceptual architecture.** `data/projects.ts` →
   `architecture.pipeline`, rendered by `components/work/ArchitecturePipeline.tsx`
   with `architectureShape: "branched"`. The eight stages are exactly the
   spec's conceptual components — driver voice input, speech recognition,
   request interpretation, Voice Engineer orchestration, telemetry/session
   context, engineering response generation, speech output, driver-facing
   interface — and telemetry ingestion appears as an attached separate input
   path into the context layer (`UDP telemetry ingestion` → `Packet handling &
   decoding (Codemasters F1)` → `Session context`).
3. **Fig. 02 — the voice interaction loop.** `dataFlow`, rendered by
   `components/work/figures/IntelligencePipeline.tsx`. This figure's title and
   caption are now project-supplied (`dataFlowTitle` / `dataFlowCaption`, both
   optional) because its defaults named a player-attribute pipeline; F1 Voice
   Engineer's flow is a conversation and it says so in its own words.
4. **Fig. 03 — validation evidence.** `validationClaims`, rendered by
   `ValidationMatrix` (§5).

This is presented on the page as a **conceptual architecture derived from the
project's specification**, not as a verified source-code dependency graph, and
the hero motif is captioned "illustrative schematic" wherever it appears — on
the page, in the OG card, and in its own `aria-label`.

---

## 5. Case-study sections implemented

The page is the existing reusable `/work/[slug]` template; no page was rebuilt.
Requested layout → what actually renders:

| Requested | Rendered as | Source field |
|---|---|---|
| 1. Hero — "Your race engineer. In the cockpit." | Hero: number 04, status, tagline, year, title, thesis, four chips, captioned motif, key evidence, honest CTA | `title`, `tagline`, `thesis`, `evidence` |
| 2. Project overview | Overview (four-block 30-second read) | `brief.{problem,built,approach,result}` |
| 3. Product vision and target experience | Problem (long form) + Overview | `problem`, `brief` |
| 4. Voice interaction workflow | Data Flow — "Fig. 02 Voice interaction loop" | `dataFlow`, `dataFlowTitle`, `dataFlowCaption` |
| 5. Telemetry and session-context architecture | System — separate attached input path in Fig. 01, expanded in the appendix | `architecture.pipeline[4].children`, `implementation` |
| 6. Standalone engineering architecture | System — "Fig. 01 Branched architecture · 8 stages" | `architecture`, `architectureShape` |
| 7. Engineer identity and interface design | Engineering (decisions) + appendix (subsystem state) | `engineeringDecisions`, `stateItems` |
| 8. Engineering challenges and design decisions | Engineering — five trade-offs, problem → decision → result | `tradeoffs`, `engineeringDecisions` |
| 9. Automated testing evidence | Evidence — validation matrix + reported run | `validationClaims`, `validation`, `results` |
| 10. Integration status and verification boundaries | Evidence + Limitations + appendix ("Kept out of the main system") | `validationClaims`, `limitations`, `separatelyScoped` |
| 11. Technology stack | Technologies | `technologies` (six, exactly as specified) |
| 12. Future validation milestones | Next | `nextIteration` |

The nine numbered sections that render are `01 Overview` … `10 Technologies`;
the **Links** section intentionally does not render, because there is no link
to show and inventing one was not an option. The hero action correspondingly
renders "Explore the system ↓" rather than "View Source ↗" — verified in the
browser, not inferred from the source (`hasViewSource: false`,
`exploreCta: true`).

Expandable technical detail (the template's single CSS-only `<details>` panel)
contains: design constraints, implementation notes, subsystem state and scope
boundaries — and its summary now names exactly those four, from the data.

---

## 6. Historical test evidence, and the live-game boundary

**Reported by the project's own record:**

- 3,313 tests passed
- 20 tests skipped
- 0 tests failed
- five of five quality gates passed

**Provenance, stated on the page itself:** these figures belong to F1 Voice
Engineer's own suite, as recorded in its project report. They were **not**
re-executed against this repository, and no execution date is recorded — which
is why they are published as attributed `validationClaims` and prose rather
than as a `TestEvidence` run (that type requires a `verifiedOn` date, and
inventing one would be worse than omitting it).

**What the suite does and does not demonstrate:**

| Claim | Status | Why |
|---|---|---|
| Automated software tests | `implemented` | The reported run covers the voice path, backend, interface and packet handling |
| Quality gates | `implemented` | Five of five, same reported run |
| Packet format & structural validation | `implemented` | Codemasters F1 UDP packet structures and their published packet sizes are implemented and validated independently of a running game |
| Mocked / simulated integration | `partial` | Honest test coverage — and explicitly *not* a live decode |
| Live-game decode (F1 25 / F1 2026 Season Pack) | **`not-run`** | Neither supported title was available in the test environment |

The live-game row is the project's honesty boundary, and it is asserted as
such: no unit test, mock or synthetic packet stands in for it, and the page
says so in three places (impression-limited prose, the evidence matrix, and a
"Kept out of the main system" note in the appendix). **No live-game test was
performed during this pass, and none is claimed.**

---

## 7. Defects found and fixed in the shared template

Both were found by verifying the rendered page rather than the source, and both
were **pre-existing** — the new project merely made them visible.

### 7.1 `links.visibility` rendered as a link

`app/work/[slug]/page.tsx` built its link list with
`typeof entry[1] === "string"`, which the control field `visibility` satisfies.
Every project recorded as `unpublished` therefore rendered a Links section
containing `<a href="unpublished">visibility ↗</a>`, and its section gate
(`Object.values(project.links).some(Boolean)`) was true for the same reason.

Measured before the fix, against the running production server:

```
f1-lap-time-simulator bogusHrefs=["unpublished"] labels=["visibility"]
sentinel-ai           bogusHrefs=["unpublished"] labels=["visibility"]
f1-voice-engineer     bogusHrefs=["unpublished"] labels=["visibility"]
racemind-ai           bogusHrefs=[] (has a real repository URL)
```

The bogus link was also the **only** sub-24px tap target on the page
(`h=16`, `w=109`). Fixed by excluding the control field from both the list and
the gate. After the fix, all three pages report `href="unpublished"` zero times,
the Links section is gone from the unpublished case studies, and no undersized
target remains.

### 7.2 The appendix summary promised blocks projects do not have

The appendix summary was one fixed sentence — "Design constraints, algorithms,
provider contracts, capability registry, data lineage, subsystem state, API
surface and full test runs." — which told F1 Lap-Time Simulator it had seven
blocks when it has one. It is now composed from what the data actually
contains, in the appendix's own render order:

| Project | Appendix summary as rendered |
|---|---|
| F1 Voice Engineer | Design constraints, implementation notes, subsystem state, scope boundaries. |
| F1 Lap-Time Simulator | Implementation notes. |
| Sentinel AI | Design constraints, implementation notes, full test runs, API surface, subsystem state. |
| EA FC Player Intelligence | Design constraints, implementation notes, feature space, full test runs, subsystem state, scope boundaries, version detail. |
| Football Intelligence OS | Design constraints, implementation notes, provider contracts, capability registry, data lineage, full test runs, API surface… |
| Live F1 Intelligence | no appendix (unchanged) |

---

## 8. Files changed

**Data, types and schema**

- `data/projects.ts` — restored to 1,920 lines, then F1 Voice Engineer inserted
  at position 04; header comment extended with its provenance, its publication
  state and why it carries no `metrics`
- `types/project.ts` — added `voice` to `ProjectCategory`; added optional
  `dataFlowTitle` / `dataFlowCaption`
- `data/projects.test.ts` — added `voice` to the valid-category and
  valid-visualization-type locks, with the reasoning
- `data/projects-f1-voice-engineer.test.ts` — **new**, 28 regression tests

**Components**

- `components/work/instrument-geometry.tsx` — restored, then `voice` added:
  `TYPE_LABEL` entry, `voiceGlyphs` factory, `GLYPHS` entry, header type list
- `lib/og/project-card.tsx` — restored, then `voice` added to `CATEGORY_LABEL`
- `components/work/figures/IntelligencePipeline.tsx` — optional `title` prop
  (default unchanged: "Intelligence pipeline")
- `components/work/ProjectInstrument.tsx` — restored
- deleted: `components/work/RadioConsole.tsx` (empty),
  `components/work/figures/RadioConsole.tsx` (unused; geometry ported),
  `app/work/[slug]/opengraph-image.tsx.bak`

**Shared template**

- `app/work/[slug]/page.tsx` — link filter excludes `visibility`; link section
  gate uses the filtered list; appendix summary composed from present blocks

**Docs**

- `docs/F1_VOICE_ENGINEER_PORTFOLIO_INTEGRATION.md` — this file
- `README.md` — status table (tests, routes, audit), nine-project counts, new
  "3C" and "3C-fix" entries, owner-action list, repository structure

Two temporary recovery scripts (`scripts/recover-scan.mjs`,
`scripts/recover-dump.mjs`) were used to extract the originals from
`.next`'s sourcemaps and were **removed** when the recovery was verified;
recovered copies live outside the repository.

---

## 9. Commands executed, and their results

```
$ npm run typecheck                     → exit 0   (tsc --noEmit, no output)
$ npm run lint                          → exit 0   (eslint ., no output)
$ npm run test                          → exit 0
    Test Files  7 passed (7)
         Tests  150 passed (150)         (baseline before this pass: 117)
$ npm run build                         → exit 0
    Compiled successfully in 3.3s
    ✓ Generating static pages (29/29)
    29 routes — 11 static + 18 SSG (9 case studies, 9 prerendered social cards)
$ npm run audit:site -- http://127.0.0.1:3111
    ALL CHECKS PASS  (277 assertions across 15 routes)   (baseline: 257 / 14)
```

The build is itself a check on the new motif: all nine case-study cards are
prerendered through satori, so an element satori cannot serialise would fail
the build rather than the browser.

The project-data validation gate (`data/projects-validation.test.ts`) passes
with the new entry: unique valid slug, non-empty name and description, a
well-formed technology list, a valid status, a resolving case-study route — and
**no repository URL**, which `links.visibility: "unpublished"` is designed to
permit. The regression suite additionally asserts that any URL-shaped text is
absent entirely, so the absence is active rather than incidental.

### Social cards, measured from the bytes

All nine prerendered cards were decoded (PNG signature, `IHDR`, inflate,
per-row un-filter) rather than eyeballed:

| Card | Size | Distinct colours | Accent pixels |
|---|---|---|---|
| `f1-voice-engineer` | 1200×630, 62,533 B | 1,312 | 722 |
| `live-f1-intelligence` | 1200×630, 57,205 B | 1,415 | 3,032 |
| `sentinel-ai` | 1200×630, 50,663 B | 1,415 | 2,195 |
| (5 more) | all 1200×630 | 1,154–1,637 | 326–2,195 |

9 of 9 cards fully distinct, none blank, and the new card's motif is present
(722 accent pixels, drawn from the console) rather than an empty panel.

---

## 10. Browser QA results

Live production build (`next start`, port 3111), audited with a scripted real
Chromium (Playwright 1.64 driving the sandbox's cached Chromium 1243) plus the
repository's own live site audit.

**Overflow / layout — 12 route × viewport combinations, all clean:**

```
360px /work                       scrollWidth=360  overflow=no  offenders=0
360px /work/f1-voice-engineer     scrollWidth=360  overflow=no  offenders=0
390px /work                       scrollWidth=390  overflow=no  offenders=0
390px /work/f1-voice-engineer     scrollWidth=390  overflow=no  offenders=0
1440px /work                      scrollWidth=1440 overflow=no  offenders=0
1440px /work/f1-voice-engineer    scrollWidth=1440 overflow=no  offenders=0
   (+ /work/racemind-ai and /work/live-f1-intelligence at all three widths)
```

No console errors, no page errors, no failed requests (≥400) on any of the four
routes at any width.

**Text wrapping — measured per element, at 390px and 1440px** on
`/work/f1-voice-engineer`: every text node (`h1`–`h3`, `p`, `li`, `dd`, `dt`,
`figcaption`, `summary`) was checked for horizontal clipping inside its own box
(`scrollWidth > clientWidth` with `overflow-x` not `visible`) — **0 clipped at
each width** — and for over-long words forced into narrow boxes — **0 found**.
The only element reporting vertical clipping anywhere on the page is the
`sr-only` skip link (1×1 until focused), which is by design. The hero motif
renders at 360×84 from its `0 0 206 60` viewBox, scaling with its container
rather than distorting.

**Keyboard access and focus states** — 14 real `Tab` presses on
`/work/f1-voice-engineer` at 1440px: first stop is the visible skip link,
every stop reports `:focus-visible=true` with a real `2px` outline
(`rgb(255,122,24)` accent or the element's own token), and 13 of 14 are 44px
tall (the skip link is 32px — pre-existing shell markup, untouched here, and
above the repo's own 24px audit criterion).

**Reduced motion** — with `reducedMotion: 'reduce'`: the media query matches,
16 sections render, **0 of 71** sampled elements are hidden or opacity-0, and
**0** are still animating. Content renders in its final state rather than
waiting on an animation that will not run.

**Content, read from the rendered DOM:**

```
h1            "F1 Voice Engineer"
h2s           01 Overview … 10 Technologies  (Links correctly absent)
hero motif    360×84 rendered, 23 path/rect/circle/line elements
figcaptions   hero schematic · Fig. 01 Branched architecture · 8 stages
              Fig. 02 Voice interaction loop · Fig. 03 Validation evidence
hasViewSource false        exploreCta true        liveClaim false
```

**Regressions checked:** `/work` (flagship unchanged at 01, eight other rows
renumbered 02–09 with F1 Voice Engineer at 04), `/work/racemind-ai`,
`/work/live-f1-intelligence`, `/work/sentinel-ai`, `/work/f1-lap-time-simulator`
and `/work/ea-fc-intelligence` all render, pass the audit, and are unaffected
except for the two defect fixes in §7.

**One environment limitation, reported rather than papered over:** screenshots
cannot be captured — the preview webview does not composite in this
environment. All of the above was therefore measured from the live DOM and
computed styles in a real Chromium, and the social cards were measured from
their decoded bytes. `:focus-visible` matching and reduced-motion behaviour
*were* verified for real, in a scripted Chromium with real key events.

---

## 11. What this pass does not claim

- **No live-game session was run.** F1 25 and the F1 2026 Season Pack were not
  available in this environment, so no telemetry from a running game was
  received, decoded or observed — by this project or by this pass.
- **No implementation detail was invented.** Speech-generation technology,
  engineering commands, telemetry fields and race features are all omitted
  rather than guessed, because the project's record does not name them.
- **No affiliation.** Team-inspired themes and engineer personas are presented
  as presentation only; no official team affiliation, endorsement or licensed
  access is implied, and no avatar animation, overlay or game-window
  integration is claimed as working.
- **The reported test figures are attributed, not re-measured.** They belong to
  F1 Voice Engineer's own suite.
- **No repository link exists**, because the repository has not been published.

When a repository is published, the only change needed is
`links.visibility: "public"` plus the URL in `data/projects.ts`: the Links
section reappears (the §7.1 fix makes that work correctly), and the hero CTA
switches from "Explore the system" to "View Source" on its own.
