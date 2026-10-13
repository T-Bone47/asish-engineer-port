# Motion System — Implementation Report

**"Engineering in Motion."** The motion layer of this portfolio: what was
built, what it cost, what it is measured to do, and what was deliberately left
out. Companion audit (the state before this pass):
[MOTION_SYSTEM_AUDIT.md](./MOTION_SYSTEM_AUDIT.md).

---

## 1. The shape of the answer

One token layer, a small set of named CSS primitives, and one rule that governs
all of it:

> **The hidden state of every animation exists only inside
> `@media (prefers-reduced-motion: no-preference)`, and every scroll-driven one
> additionally inside `@supports (animation-timeline: view())`.**

Outside those blocks the selectors do not match, so the element renders in its
final, visible state. The unsafe state is unreachable by default rather than
survivable afterwards — which is what keeps PRD TR4 ("content renders without
JavaScript") true for a page whose entire motion layer is CSS. There is no
JavaScript in the motion layer at all: **zero client components added, 136 KB of
first-load JS unchanged from baseline.**

### Why no animation library

The motion skill is present locally (`.agents/skills/motion/`, read in
full). Its advice is followed wherever it can be followed. It cannot be
followed where it contradicts this repository's architecture:

- Motion for React animates **client components**. PRD TR3 caps this project at
  two (`app/error.tsx`, `components/layout/Header.tsx`) and everything else is
  server-rendered.
- GSAP/ScrollTrigger and Lenis are uninstalled by decision (PRD §8), not by
  omission.
- Every effect in this pass is expressible in transform, opacity and
  stroke-offset on elements the server already rendered.

The two exceptions to compositor-only animation are named and measured rather
than assumed cheap: the SVG stroke-offset draw, and the scale of the
one- and two-pixel diagram connector rules. §10 below reports their cost.

## 2. The token layer

`app/globals.css`, one block, the only place a number appears:

| Token | Value | Used for |
|---|---|---|
| `--motion-duration-instant` | 90 ms | State colour changes, the disclosure caret — read as state, not motion. |
| `--motion-duration-fast` | 150 ms | Every hover/focus surface (UI UX Pro Max's 150–300 ms floor). |
| `--motion-duration-base` | 240 ms | Header rules, motif glyphs, page headers. |
| `--motion-duration-reveal` | 520 ms | Section reveals, diagram nodes. |
| `--motion-duration-draw` | 1100 ms | The signature draw only — the one moment the site asks to be watched. |
| `--motion-duration-ambient` | 6400 ms | The one looping animation on the site. |
| `--motion-ease-standard` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Everything except the draw. |
| `--motion-ease-mechanical` | `cubic-bezier(0.16, 1, 0.3, 1)` | The draw. Expo-out: arrives early, settles long. |
| `--motion-lift-sm` / `--motion-lift` / `--motion-lift-glyph` | 8 / 14 / 6 px | Distances. Nothing travels far enough to read as a transition. |
| `--motion-stagger-tight` / `--motion-stagger` / `--motion-stagger-loose` | 55 / 80 / 130 ms | Steps. Glyphs step tight, rows step loose. |

No overshoot anywhere — one exponential ease-out family, per PRD §8's
rejection of `back.out` on informational UI.

## 3. The primitives

| Class | What it does | Where |
|---|---|---|
| `.seq` | Time-driven entrance, identity → role → statement → actions, 80 ms apart. First child is translate-only so the H1 is never faded out of the LCP paint. | Hero |
| `.seq-tight` | Same sequence, tighter step, for the roles list inside the hero | Hero |
| `.seq-page` | Page-header entrance (title → thesis → chips) so every interior route arrives the same way | `/work`, `/experience`, `/about`, case studies |
| `.reveal` | Scroll-driven section reveal (`view()` timeline) | Homepage sections, every case-study section |
| `.reveal-group` | Reveal that staggers its own children, each on its own timeline — nine index rows arrive in order | `/work` index |
| `.instrument` | Each direct child of a project motif rises in draw order | All nine motifs, one rule |
| `.trace-step-1…6` | Six `animation-range` windows of the signature figure's entry phase | Signature visual |
| `.trace-draw` / `.trace-fade` | Stroke-offset draw / opacity fade, both keyed by `pathLength="1000"` so no length is measured in JS | Signature visual |
| `.trace-ambient` | The one looping animation: opacity breathe on three sector markers | Signature visual |
| `.diagram-node` | Nodes arrive in logical order | Architecture + pipeline figures |
| `.diagram-connector-y` / `-x` | Connector rules scale from their origin, reading as lines being drawn | Architecture + pipeline figures |
| `.reading-progress` | Scroll-linked 1 px accent bar, `scroll(root block)` timeline | Case studies |
| `.rule-expand` | Hairline that scales in on hover **and** focus-visible | Project rows |
| `.utility-link` | Same hairline, as a pseudo-element, for the header's GitHub / LinkedIn | Header |

## 4. Files changed

| File | Change |
|---|---|
| `app/globals.css` | Token layer + all primitives above; removed the boot-keyframes dead CSS note is now accurate |
| `components/home/SignatureVisual.tsx` | Trace classes, `pathLength` on the paths, six-step scroll windows, the ambient breathe |
| `components/home/Hero.tsx` | `.seq` / `.seq-tight` on the identity column |
| `components/work/instrument-geometry.tsx` | `instrument` class on the SVG root (both renderings — site and social card stay structurally identical) |
| `components/work/ArchitecturePipeline.tsx` | `.diagram-node` / `.diagram-connector-y` |
| `components/work/figures/IntelligencePipeline.tsx` | `.diagram-node` / `.diagram-connector-x` |
| `components/work/figures/VersionWall.tsx`, `EvidencePanels.tsx`, `ProviderGraph.tsx`, `CapabilityMatrix.tsx` | `.diagram-node` |
| `components/work/CaseStudySection.tsx` | `.reveal` on every case-study section |
| `app/work/page.tsx`, `app/experience/page.tsx`, `app/about/page.tsx` | `.seq-page` |
| `app/work/[slug]/page.tsx` | `.seq-page`, `.reading-progress` |
| `components/work/ProjectIndex.tsx` | `.reveal-group` on the row list |
| `components/work/ProjectIndexRow.tsx` | `.rule-expand` trace, arrow step, token-driven durations |
| `components/layout/Header.tsx` | Nav indicator: `width` transition → `scale-x` with `origin-left` (layout property removed); `.utility-link` rules; token-driven hamburger |
| `components/ui/Button.tsx` | Token durations/easing, 1 px `active:` press, box never changes |
| `components/work/TechnicalDetail.tsx` | Disclosure caret on tokens |
| `components/home/ContactSection.tsx`, `components/work/FlagshipProject.tsx` | Arrow steps moved onto tokens |
| `lib/motion.test.ts` | **New.** The governance gate (§12) |

23 source files under `app/` and `components/`, plus `lib/motion.test.ts`
(new), plus this document and the audit it links to, plus the two reference
documents (`README.md`, `PRD.md`) that point at them. No route, no data file
and no component contract changed.

## 5. The signature moment

The circuit/speed-profile figure now draws itself, in six ordered windows of its
own entry phase:

1. grid → 2. registration marks → 3. the circuit draws across the full width →
4. sector markers surface as the trace passes them → 5. the speed profile draws
beneath, x-aligned to the track → 6. axis ticks and the distance label close the
figure. Then it holds, with one low-amplitude opacity breathe (6.4 s, three
circles) as its resting state.

Two decisions worth stating:

- **Scroll-driven, not time-driven.** Measured at 1440×900: the figure starts at
  y=792 of a 900 px viewport, so an entrance played on load would fire while
  four fifths of it is still below the fold. Driving it from the view timeline
  means it draws where the reader can actually see it, at every viewport height,
  with no fold arithmetic.
- **Order comes from `animation-range`, not from `animation-delay`.** Each step
  owns a window of the entry phase. The hero, which is fully on screen at load,
  is the one thing that is time-driven.

The figure is still labelled **"Schematic — Not Measured"** on the canvas. No
lap time, speed, delta, tyre or fuel number is drawn anywhere.

**Accessible restatement.** The figure is decorative schematic, and the
information it encodes is available in words — the same discipline every
engineering figure in the case studies follows (an `EngineeringFigure` with a
`<figcaption>`, an `aria-describedby` description, and a collapsible "read this
figure as text" restatement). The signature figure now carries the same shape:
the desktop SVG is `aria-describedby="signature-figure-desc"`, and a
`<details>` block labelled "Read this figure as text" restates the two-channel
drawing in prose, including the explicit "illustrative schematic, not measured
telemetry" honesty line. The mobile track-only SVG keeps its own
`aria-label`. Verified in browser at 1440: the disclosure expands to show the
figure text, and under forced `prefers-reduced-motion: reduce` the disclosure
and its text remain available (§8).

## 6. Nine projects, one system, nine expressions

Each motif is drawn by the shared geometry module and animated by the single
`.instrument` rule — the projects differ in *what* is drawn, not in how many
animation frameworks each got.

| Project | Motif | Motion |
|---|---|---|
| Live F1 Intelligence | Event ticks resolving into a continuous trace | Ticks → trace → marker, in draw order |
| F1 Lap-Time Simulator | Corner arc with apex and friction-circle balance | Arc → apex → balance |
| RaceMind-AI | Stint timeline with a pit-window gap | Stints → window |
| F1 Voice Engineer | Speech recognised → session context → spoken back through a radio console | Input → console → output |
| F1 Race Manager | Management board, hubs and spokes | Hubs → spokes |
| EA FC Player Intelligence | Feature space: two separated clusters | Clusters |
| Football Intelligence OS | Provider streams converging on a canonical core | Streams → core → storage |
| Sentinel AI | Nested governance scope: controls, evidence, one gap | Scope → controls → evidence |
| VyaparPulse | Forecast band widening along a time series | Series → band |

The case-study **diagrams** add the second layer: nodes arrive in order and the
connector rules draw between them, then the figure holds static. Nothing loops
there — motion explains the relationship once and gets out of the way.

## 7. Micro-interactions

- **Navigation.** The active-route rule now scales on X from the left instead of
  animating `width` (a layout property — this is the one compositor violation
  that existed before the pass). Hover shows the same rule at half strength, so
  pointer and keyboard read as one instrument. Marked `aria-current="page"`.
- **Project rows.** Hover and `focus-visible` both scale in the same hairline
  trace and step the arrow 4 px. Nothing resizes; no adjacent row moves. The
  number turns accent in both states, so the state is not carried by movement
  alone.
- **Buttons.** Colour and border only, at the fast token, plus a 1 px `active:`
  press. The click target is identical at rest, on hover and while pressed.
- **Utility links.** Same hairline, drawn as a pseudo-element under the label —
  the header now has one interaction language instead of two.
- **Route transitions: declined.** A cross-fade between App Router routes needs a
  client boundary for the outgoing page and either duplicate content or a blank
  frame while it drains. All three are named prohibitions in the brief
  ("no blank-screen delay", "no duplicate content", "no extra JS"). Instead the
  interior pages share one `.seq-page` header entrance, so moving between routes
  still feels like one system — without a router-level transition that would
  cost the third client component.

## 8. Reduced motion

Every animation is inside `prefers-reduced-motion: no-preference`, so reduced
motion gets static content with no animation at all — not a stripped-down
version of it. Hover and focus feedback survives as a static state (the trace
rule is simply present), because the state must not be carried by movement
alone. Measured, not assumed: 4 routes, 463 sampled elements, **0 hidden, 0
animating**.

## 9. Performance

Baseline (pre-pass) and final, same harness, 14 routes × 6 widths = 84 loads
each, production build:

| Width | Baseline FCP | Final FCP | CLS | First-load JS |
|---|---|---|---|---|
| 1440 | 242 ms | 175 ms | 0 → 0 | 136 KB → 136 KB |
| 1280 | 191 ms | 123 ms | 0 → 0 | 136 KB → 136 KB |
| 1024 | 179 ms | 139 ms | 0 → 0 | 136 KB → 136 KB |
| 768 | 173 ms | 122 ms | 0 → 0 | 136 KB → 136 KB |
| 390 | 163 ms | 121 ms | 0 → 0 | 136 KB → 136 KB |
| 375 | 170 ms | 125 ms | 0 → 0 | 136 KB → 136 KB |

Honest reading: **the motion layer costs no JS, no CLS and no layout shift**,
and the FCP figures are *not* claimed as an improvement — they are the same code
path and the difference is machine variance between two runs hours apart. The
numbers that belong to this pass are the invariants that did not move: 0 CLS,
136 KB JS, and long tasks averaging 1–2 per load totalling ≤ 9 ms at 1440
(baseline: 3 totalling ~18 ms).

Screenshot diff (46 matched viewport pairs, decoded in Chromium): mean 2.56 % of
pixels changed, **every pair identical in dimensions** — the motion did not move
a single box.

## 10. The two exceptions to compositor-only, measured

| Animation | Property | Cost measured |
|---|---|---|
| `.trace-draw` (signature) | `stroke-dashoffset` on two paths | 0 long tasks during the draw window; the draw is scroll-linked, so it only runs while visible. |
| `.diagram-connector-*` | `scale` on 1–2 px rules | No measurable long-task delta; the connector count per figure is 1–4. |

Both are named here because TR6 says transform/opacity "unless justified and
tested". They are tested; the justification is that neither property can be
replaced by a transform without changing the geometry the figures describe.

## 11. Browser QA

Chromium, production build, at the six viewport widths the brief names
(1440 / 1280 / 1024 / 768 / 390 / 375) × 14 routes, plus targeted interaction
runs. 84 viewport screenshots were captured (14 routes × 6 widths) and the
interaction sweep was run at **all six widths**, not only at the three it
initially covered — the report does not rest on a width that was never measured.

- **88/88 interaction checks pass at each of 1440, 1280, 1024, 768, 390 and
  375**: no-JS render; reveal settling on every route and width; reading progress
  at document end; no clipped text at any width; no over-long words at 390 and
  375; hover trace reaching `scaleX(1)`; `focus-visible` driving the same trace;
  visible focus outline on 14 tab stops; ambient loop scoped to the signature
  figure; ambient breathe measured at 0.383 opacity spread over 1.6 s; ambient
  motion paused when the page is frozen (drift 0.015 vs 0.338 control over the
  same 1.6 s).
- **Fallback (no scroll-driven animations):** 16 `@supports` blocks stripped from
  the served CSS — exactly what an unsupporting engine computes. 0 problems: no
  text hidden, no scroll-driven animation left running, the signature paths
  fully drawn (`stroke-dashoffset: 0px`), the reading bar invisible rather than
  a static line across the header.
- **84/84 load sweep: 0 problems** — no overflow, no console error, CLS 0 at
  every width.
- **Keyboard:** 14 tab stops on the homepage, every one with a visible focus
  outline; the project rows' trace is driven by `focus-visible`, not only hover.

## 12. Automated verification

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | pass (strict, no `any`, no suppression) |
| Lint | `npm run lint` | pass |
| Tests | `npm run test` | **165 pass, 8 files** (150 before this pass) |
| Build | `npm run build` | pass — 29 routes, 0 CSS optimiser warnings |
| Full gate | `npm run verify` | **exit 0** |

### `lib/motion.test.ts` — the gate

Twelve assertions, and why each exists:

1. **Tokens defined once, all fourteen present, none unused.** An unused token is
   dead CSS; a timing written into a component instead is the exact failure the
   brief rules out.
2. **No component hardcodes a duration or an easing.** Five components did
   before this pass; they now reference `--motion-*`.
3. **No `animation` declaration exists outside the reduced-motion opt-in.** This
   is the mechanical form of TR5, and it caught a real gap during
   implementation: the diagram rules had the reduced-motion gate but not the
   `@supports` gate, and were fixed because of it.
4. **Every scroll-driven timeline is inside `@supports (animation-timeline …)`.**
5. **No dead keyframes; no animation naming a keyframe that does not exist.**

The test also had to learn a lesson of its own: its first version printed a
Tailwind-looking example string, which Tailwind's class scanner picked up and
compiled into invalid CSS (4 optimiser warnings). It no longer prints bracketed
utilities, and `npm run build` is back to 0 warnings.

## 13. What is not in here, on purpose

- **No custom cursor.** Nothing in the existing tests or design demonstrated a
  benefit; the brief makes it optional and forbids hiding the native cursor.
- **No route transition.** §7.
- **No WebGL, no smooth scroll, no library.** §1.
- **No fake telemetry.** No clock, no simulated logs, no invented numbers. The
  only looping animation on the site breathes three sector markers.
- **No animations added to raise a count.** The homepage runs `reveal-rise`,
  `seq-rise`, `trace-draw`/`trace-fade` and `ambient-breathe`; that is the whole
  vocabulary.## 14. Remaining issues and limitations

- **Screenshots were captured but not inspected by eye.** The preview webview in
  this environment does not composite images, so every visual claim in this
  report comes from the live DOM, computed styles, or decoded PNG bytes — not
  from looking at a picture. The 46-pair pixel diff confirms the pages changed
  and did not resize; it does not confirm taste.
- **Reduced-motion and frozen-page behaviour were measured in Chromium only.**
  Firefox and WebKit are not installed here.
- **The FCP table is not a benchmark.** See §9. If a real comparison is wanted,
  run the harness twice on an idle machine against the same commit.
- **The scroll reveals reverse on the way out.** `animation-range` is the scroll
  position itself, so content recedes as it leaves the viewport. This is
  deliberate (nothing can be missed, nothing replays from the top) and is the
  one behaviour a reader may notice that has no static equivalent.
- **`.seq-page` gives interior pages a short entrance on every navigation.** It
  is 240 ms per item and capped at four items, so a reader moving quickly between
  case studies sees it once per navigation and it is already finished by the time
  the eye lands.

### Browser QA performed in this pass

Chromium (Playwright headless shell 156), production build on `next start`,
6 viewport widths the brief names (1440 / 1280 / 1024 / 768 / 390 / 375) × 6
routes (homepage, /work, Live F1 Intelligence, F1 Voice Engineer, Football
Intelligence OS, Sentinel AI) = 36 loads, each waited to `networkidle`.

- **0 console errors** across all 36 loads.
- **All 9 project titles present on the homepage** (LIVE F1 INTELLIGENCE,
  F1 LAP-TIME SIMULATOR, RACEMIND-AI, F1 RACE MANAGER, EA FC PLAYER
  INTELLIGENCE, FOOTBALL INTELLIGENCE OS, SENTINEL AI, VYAPARPULSE, F1 VOICE
  ENGINEER), and **9 rows on /work**.
- **Figures and accessible labels present at every width** on every route:
  homepage carries 3 `role="img"` figures and 7 `aria-label` attributes;
  each case study carries 1 figure and 7 accessible labels.
- **Signature figure accessibility verified at 1440:** the desktop SVG is
  `aria-describedby="signature-figure-desc"`, the description `<p>` exists, the
  "Read this figure as text" disclosure is present and expands on click to show
  the figure prose including the "illustrative schematic, not measured telemetry"
  honesty line. Under forced `prefers-reduced-motion: reduce` the disclosure and
  its text remain available.
- **Reduced-motion path verified end-to-end at 1440 with `prefers-reduced-motion:
  reduce` forced:** the instrument-row mask is `content: none` (motif shown static
  on the row), the signature track is fully drawn (`stroke-dashoffset: 0px`),
  the trace rule is at rest (`scaleX(0)`) and the disclosure is still present.
- **Hover reveals the motif on a real row:** after hovering the Live F1 Intelligence
  row, the mask opacity drops to ~0.14 (the surface tint compositing through) and
  the trace rule reaches `scaleX(1)` — both the mask and the trace respond to the
  row being entered, not only to the rail being hovered.
