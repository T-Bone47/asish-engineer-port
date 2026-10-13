# Godlevel Visual Audit — Asish Oliver M Portfolio

Audit of the **current implementation**, performed against the running
production build and the source. Not a plan — a record of what is actually
there, what is actually weak, and what is worth doing about it.

---

## Current strengths

- **Token system is genuinely three-layer** and the accent now carries a real
  semantic job (papaya = hierarchy, cyan = data, green = live). This is rarer
  than it sounds and worth protecting.
- **Content truth discipline is the strongest thing about the project.**
  Unknowns are `TODO(owner)` in code, never rendered. No invented metric,
  employer, client or academic score. Everything measured is labelled.
- **The signature figure works.** Track (accent) and speed profile (cyan) on a
  shared horizontal axis — the alignment is what makes it a chart instead of
  two squiggles. It is labelled `SCHEMATIC — NOT MEASURED` on the canvas.
- **Two client components total** (`error.tsx`, `Header.tsx`). Server-first is
  genuinely intact, not aspirational.
- **Quality gates are real.** 25 unit tests, 179 live-site assertions across
  12 routes, all green against a production build.
- **Section rhythm already varies** (py-14 → py-36) and adjacent sections no
  longer share grid geometry.

## Current weaknesses

The dominant problem is the one named in the brief: **content quality exceeds
visual expression.** The repository contains genuinely good technical
material — a 9-stage pipeline, a 5-stage solver, a 3-pass numerical loop, real
measured telemetry figures — and the interface renders nearly all of it as
`heading → paragraph → hairline → next section`.

Specifically:

1. **All six projects look identical.** `/work` distinguishes them by a number,
   a title and a status dot. A telemetry pipeline, a numerical solver, a team
   management game and a voice-to-ledger ML pipeline are rendered with the same
   components in the same layout. Nothing about *what kind of system* each one
   is survives into the visual layer.
2. **The data model cannot hold the depth that exists.** `Project` has no
   `thesis`, `tradeoffs`, `nextIteration`, `constraints`, or
   `visualizationType`. `limitations` exists but is populated for **zero**
   projects. So the case-study template has nothing to render for the
   PROBLEM → DECISION → IMPLEMENTATION → VALIDATION → LIMITATION →
   NEXT ITERATION spine the brief requires.
3. **Case studies open with a title then a wall of text.** The strongest
   evidence (five measured metrics) is present, but the page's first screen is
   typographic, not technical.
4. **Architecture diagrams are uniform.** Every project's pipeline renders with
   the same vertical rail. Real architectures differ in shape — a
   many-to-one normalisation fan-in looks nothing like a linear solver loop.
5. **No figures, no captions.** Nothing is numbered `FIG. 01`. There is no
   engineering-publication register.
6. **The hero's right column is thin.** A three-row boot readout occupies a
   5-column slot. It does not carry the "personal engineering system" idea.

## Visual hierarchy issues

- **The homepage has one rhythm problem left:** too many sections share the
  *same* typographic entry point (small mono label → condensed heading → prose).
  Six sections in a row all open that way.
- **Accent is under-used in the hero.** Papaya is the differentiator and the
  hero — the highest-attention surface — uses it almost nowhere.
- **`MetricGrid` is competent but flat.** Five equal-weight numbers in a row
  read as a stat strip rather than as evidence with hierarchy.

## UX issues

- **Project differentiation cost** — §80's test ("can someone distinguish
  telemetry / simulation / AI / game / data within seconds?") currently fails.
- **The `/work` flagship block is strong but static**; the five remaining rows
  are text.
- **No active-route indicator in the header.** You cannot tell which section
  you are in.
- **Hero CTAs** are `View Systems` / `Experience`. The brief asks for
  `View Selected Systems` / `Engineering Profile`.

## Motion opportunities

Current motion is: a section reveal (CSS scroll-driven) and the boot readout.
Correctly minimal. But there are three *purposeful* additions available that
would communicate system behaviour rather than decorate:

1. **A signal that travels a path** — the "orange engineering signal" motif.
   It can appear in the hero instrument, architecture diagrams, and on project
   hover, turning decoration into a system state indicator.
2. **Architecture flow** — data visibly traversing the pipeline on scroll.
   Static arrows under reduced motion.
3. **Hover previews on project rows** — a small deterministic instrument per
   project that activates on hover/focus.

All three must be CSS/SVG, deterministic, and reduced-motion safe. No library.

## Content expression gaps

- No `thesis` (one-sentence engineering claim) anywhere.
- `limitations` populated for 0/6 projects — the brief requires limitations be
  visible, and this is the single strongest honesty signal available.
- No `nextIteration` — "Currently Building" is vague where it could be specific.
- No `tradeoffs` — the brief is explicit that an iterative-solver→closed-form
  decision is worth more than marketing prose.
- Owner-supplied material **not yet in the data**: the simulator's three-pass
  solver, Python/NumPy reference validation, the corner-speed divergence
  discovery and closed-form correction; EA FC's 16,228-player dataset scope;
  VyaparPulse's 7-day forecast and team/hackathon identity.

## Project storytelling gaps

Per §81's test, a reader should get what / why / how / evidence / limitations
in ~60 seconds. Currently: **what** (description) and partial **how**
(architecture pipeline). Missing: **why** (thesis), **evidence context**
(validation exists for 1/6), **limitations** (0/6).

## Responsive risks

- The architecture rail and figure captions are desktop-first; at 360 px the
  pipeline is long and linear.
- Hover previews must be `focus`-reachable and must not be the only way to get
  information (§50).
- 320 px has not been measured this session.

## Accessibility risks

- Any hover preview must also render/announce on focus.
- Any continuous motion must stop under `prefers-reduced-motion`.
- SVG instruments need `role="img"` + `aria-label` or `aria-hidden`; a purely
  decorative animated layer must be hidden from AT.
- Adding an active-route indicator must not replace the accessible name.

## Performance risks

- Per-project hover previews = 6 small inline SVGs. Fine if server-rendered
  and CSS-only on hover; expensive if each mounts a client component.
- A travelling-signal motif must use `transform`/`opacity` only, and must not
  run an infinite `requestAnimationFrame` loop.
- Any new client component must be justified against the current total of 2.

---

## Top 20 high-value improvements

| # | Improvement | Value | Risk |
|---|---|---|---|
| 1 | Extend `Project` model with `thesis`, `tradeoffs`, `limitations`, `nextIteration`, `visualizationType` | Unblocks the entire storytelling spine | Low |
| 2 | Populate depth for all 6 projects from owner-supplied facts | Closes §81's test | Low |
| 3 | Per-project **visual identity instrument** (deterministic SVG) | Closes §15/§80 | Med |
| 4 | Populate `limitations` for 6/6 | Strongest honesty signal | Low |
| 5 | Case-study hero: number, domain, status, thesis, technical visual | Stops "big title then wall of text" | Med |
| 6 | Architecture diagrams shaped by role (fan-in / linear / branched) | Real architecture looks different | Med |
| 7 | `FIG. NN` numbered figures with captions | Engineering-publication register | Low |
| 8 | Evidence composition replacing the flat 5-number row | Metrics read as evidence | Low |
| 9 | Project hover/focus preview per system | "Browsing engineering systems" | Med |
| 10 | Hero signature instrument (track + telemetry + state transitions) | Highest-attention surface | Med |
| 11 | The travelling "signal" motif, reused across surfaces | Recognisable signature | Med |
| 12 | Header active-route indicator with smooth transition | Orientation | Low |
| 13 | Hero CTA copy → `View Selected Systems` / `Engineering Profile` | Matches IA language | Low |
| 14 | Hero density pass (reduce dead space, add tension) | §8 occupancy target | Low |
| 15 | Experience page → engineering timeline instrument | "Currently too sparse" | Low |
| 16 | Technical Arsenal regrouped per brief §36 | More scannable | Low |
| 17 | About page structured as IDENTITY / FOCUS / DIRECTION / EDUCATION | Avoids biography | Low |
| 18 | Vertical rhythm alternation TEXT/VISUAL/DATA/ARCHITECTURE | Kills heading-paragraph-line | Med |
| 19 | Mobile architecture treatment (vertical flow, no overflow) | §49 | Low |
| 20 | Extend live-site audit to cover new invariants | Keeps gates honest | Low |

**Not doing, and why:** custom cursor (§43 optional; no navigational value
here, and it risks text obstruction), page transitions (§41; any entrance
animation delays LCP — declined previously on the same grounds), WebGL (§53;
the SVG instrument is already convincing, and the brief says remove it if less
convincing), command palette (5 routes don't need one).

---

## The five design tests, current status

| Test | Status |
|---|---|
| §79 Hero — identity + signature visual understood at a glance | **Pass** |
| §80 `/work` — distinguish telemetry / sim / AI / game / data in seconds | **Fail** → improvement #3 |
| §81 Live F1 case study — what/why/how/evidence/limits in ~60s | **Partial** → #1, #2, #5 |
| §82 Looks like something Asish built | **Partial** → #3, #11 |
| §83 Works without JS animation / reduced motion | **Pass** |
| §84 Keyboard-only completion | **Pass** |