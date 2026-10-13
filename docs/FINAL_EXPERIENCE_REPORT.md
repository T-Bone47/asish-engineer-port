# Final Experience Report — Asish Oliver M Portfolio

**Stages C–H of the Final Experience Excellence Pass.**
What was changed, why, and what was actually verified. Findings and severity
ranking live in [FINAL_EXPERIENCE_AUDIT.md](./FINAL_EXPERIENCE_AUDIT.md).

---

## 1. Summary

Six changes, all of them removals or corrections rather than additions. No
feature, page, dependency, route, or section was added. Two fake interfaces
were deleted, every interactive target was brought up to the site's own
44px floor, two sections were brought back inside the project's own layout
ban, and the hero's focal column was given real engineering content drawn
from the project data.

| # | Change | Class |
|---|---|---|
| 1 | Deleted the fake hero boot readout; replaced it with a real architecture figure | removal + substitution |
| 2 | Hero domain status band now derived from `data/projects.ts` | correctness |
| 3 | All interactive targets ≥44px | accessibility |
| 4 | Header's fake live status → truthful availability state | truthfulness |
| 5 | Removed the two remaining kicker-above-heading patterns | design doctrine |
| 6 | Themed scrollbar and caret from the palette; fixed two run-together heading names | craft + a11y |

The portfolio's architecture, routing, data model, project slugs, palette,
type roles and identity are untouched.

---

## 2. Changes, with rationale

### 2.1 — The hero no longer opens with a fake instrument

**Removed:** `components/home/SystemBoot.tsx` (deleted) and the
`.animate-boot-fade-in` / `.animate-boot-fill-bar` keyframes in
`app/globals.css`. No dead CSS was left behind.

**Added:** [components/home/HeroInstrument.tsx](../components/home/HeroInstrument.tsx)
— "Canonical Event Convergence": four providers fanning into one canonical
event model, with the flagship's verified figures printed beneath, and a
direct link into that case study.

**Why this is not just a swap.** The deleted element was the only thing on the
site that was *less* true than it looked: four progress bars filling for a
system that does not exist, in the single most valuable column on the site,
with `aria-hidden` so it was invisible to assistive tech as well. The
replacement is readable by everyone, and every value in it is read from
`data/projects.ts` at build time:

- the four input names come from `architecture.sources` — add a fifth
  provider there and it appears here;
- the heading metric is `metrics[0]` and the second line is `metrics[1]`, the
  same figures the flagship block and case study promote;
- the closing line restates the project's own recorded validation method
  ("verified by replay"), not a new claim.

Nothing animates, nothing counts up, nothing is labelled "live". It is a
figure describing an architecture.

**Layout outcome, measured.** The hero is unchanged at 1440×900:
y 65 → 687 against 65 → 681 before — six pixels, from the caption's tap-target
height. It still completes inside the first viewport. The figure sits at
y 205 → 480, so the hero's right column now shows real engineering content
where it previously showed a placeholder, without moving anything else.

**Responsive outcome, measured.** Text is inside the SVG, so sizes were chosen
against the two real render widths (~389px in the hero column at 1440, ~342px
at 390). Measured rendered text heights at 390: provider names **13.2px**,
node labels **12.5px**, headline metric **11.8px**, secondary metric 10.5px.
The first draft put a single 47-character evidence line at 9.7px; splitting it
across two lines and re-wording the second let both hold a legible size.

### 2.2 — The hero status band can no longer drift

`Hero.tsx` had a hand-written `DOMAINS` array of labels and states with a
comment claiming it was "taken from the actual project data". It was not. Each
domain now names the project that backs it and reads `STATUS_LABEL[status]`
from that project via `getProjectBySlug`. `STATUS_LABEL` was exported from
`components/ui/Badge.tsx` to make that the single source. A renamed slug drops
its row (`flatMap`) rather than rendering a blank.

Rendered result is unchanged and now correct by construction: `MOTORSPORT
ACTIVE · SIMULATION NEAR COMPLETION · TELEMETRY ACTIVE · AI / ML ACTIVE`.

### 2.3 — Every interactive target now meets the 44px floor

The design contract already promised ≥44px and the rendered boxes were 16–42px.
Fixed with real box growth (`min-h-11`, `inline-flex items-center`) — not
pseudo-element hit-area expansion, which would have made adjacent targets
overlap and mis-tap.

| File | Change |
|---|---|
| `components/ui/Button.tsx` | `min-h-11` on the shared base — fixes both hero CTAs and every other Button at once |
| `components/layout/Header.tsx` | nav items, wordmark, desktop + mobile utility links |
| `components/layout/Footer.tsx` | repo link, contact links |
| `components/home/SelectedSystemsPreview.tsx` | "View Archive →" |
| `components/home/AboutPreview.tsx` | "Full Page →" |
| `components/home/ContactSection.tsx` | email link, social links |
| `app/work/[slug]/page.tsx` | "← Back to Systems", "Back to Systems", "Explore the system ↓", index button |
| `app/error.tsx` | retry control |
| `components/work/figures/EngineeringFigure.tsx` | "Read this figure as text" disclosure summary |

One structural point: the header's active-route underline was moved onto an
inner `<span>` so the outer link could grow to 44px without the rule dropping
to the bottom edge of a taller box. The visual position of the underline is
unchanged.

Two flex rows that were `items-baseline` became `items-center` with wrapping
(`SelectedSystemsPreview`, `AboutPreview`) because a 44px inline-flex child no
longer baseline-aligns predictably against a 12px label.

**No inline link inside a running paragraph was touched** — WCAG 2.5.8 exempts
those, and inflating them would have wrecked the text measure.

### 2.4 — The header states something true

`SYSTEM STATUS: ONLINE` → `AVAILABLE FOR WORK`, with the lamp moved from the
brand accent to `--color-live` (which the token system reserves for "currently
available / running"). The claim is already published on `/contact` ("Open to
motorsport software, simulation and applied AI/ML work"), so nothing new is
asserted. Same visual slot, same instrument idiom, no invented liveness.

### 2.5 — The last two kickers removed

- **`AiMlSection`** — the label is now the `<h2>` (`AI / ML Engineering`) and
  the sentence became a `<p>` at the same display size. This matches the eight
  sections that already did it this way, and it gives the section a heading
  that actually names it.
- **`ContactSection`** — the `Contact` label was deleted outright and the
  heading's top margin removed. It repeated the nav item and labelled a
  heading that already says what it is.

Verified in the rendered heading sequence: `h1` → all `h2` → all `h3`, with
`AI / ML Engineering` present as an `h2` and no skipped level.

### 2.6 — Browser surfaces, and two heading names

- `scrollbar-width: thin` + `scrollbar-color` from the palette, plus
  `::-webkit-scrollbar-*` for engines that ignore those properties. Measured
  resolved value: `rgb(43,46,53)` thumb on `rgb(10,11,13)` track — the site's
  own `--color-border-strong` on `--color-background`. This is visible in
  normal use because the technical appendix has a horizontally scrollable
  code block.
- `caret-color: var(--color-accent)` — measured `rgb(255,122,24)`.
- A `{" "}` before two `<br />`s so the accessible names read
  `"Let's talk about the engineering."` and `"Models are tools. Engineering is
  the objective."` instead of running together.

---

## 3. Files materially changed

**Deleted (1):** `components/home/SystemBoot.tsx`

**Added (1):** `components/home/HeroInstrument.tsx`

**Modified (13):**
`app/globals.css` · `components/home/Hero.tsx` ·
`components/home/AiMlSection.tsx` · `components/home/ContactSection.tsx` ·
`components/home/SelectedSystemsPreview.tsx` · `components/home/AboutPreview.tsx` ·
`components/layout/Header.tsx` · `components/layout/Footer.tsx` ·
`components/ui/Button.tsx` · `components/ui/Badge.tsx` ·
`components/work/figures/EngineeringFigure.tsx` ·
`app/work/[slug]/page.tsx` · `app/error.tsx`

**Not touched:** routing, `data/projects.ts` content, `types/`, palette and
type tokens, `SignatureVisual`, `ProjectInstrument`, `ArchitecturePipeline`,
`TechnicalDetail`, all seven project slugs, `lib/`, `sitemap`, `robots`, OG
image, `DESIGN.md`, `PRODUCT.md`, `PRD.md`.

---

## 4. Verification actually executed

### 4.1 Static gates — run on the final tree

```
npm run typecheck   → pass
npm run lint        → pass
npm run test        → 57 passed (2 files, vitest 5.0.3)
npm run build       → pass, 18 routes (11 static + 7 SSG)
```

The build compiles with Turbopack, runs TypeScript as part of the build, and
prerenders all 18 routes. **One type error was introduced and fixed during
this pass**, not suppressed: the derived `DOMAINS` array failed
`noUncheckedIndexedAccess` narrowing (`TS2677`), fixed by switching from
`.filter(predicate)` to `flatMap`. No `any`, no `@ts-expect-error`, no
lint-disable was added anywhere.

### 4.2 Live structural audit — against the running production server

```
node tests/site-audit.mjs http://localhost:<prod port>
→ ALL CHECKS PASS — 194 assertions across 13 routes
```

Covers: status codes, exactly one `h1`, no skipped heading levels, header /
nav / main / footer landmarks, skip link, image `alt`, `rel="noopener"` on
external links, title, duplicated title suffix, meta description, canonical,
`og:image`.

### 4.3 Route table on the production build

All **200**: `/` · `/work` · `/experience` · `/about` · `/contact` ·
`/work/live-f1-intelligence` · `/work/f1-lap-time-simulator` ·
`/work/racemind-ai` · `/work/f1-race-manager` · `/work/ea-fc-intelligence` ·
`/work/football-intelligence-os` · `/work/vyaparpulse` · `/robots.txt` ·
`/sitemap.xml` · `/icon.svg` · `/opengraph-image`
Unknown route → **404**. `/work/does-not-exist` → **404**.

### 4.4 Browser inspection — viewports actually driven

Real Chromium tabs. Viewport changed through the browser, results read from
the live DOM.

| Width | Routes inspected | Overflow | Targets <44px | Notes |
|---|---|---|---|---|
| 1440×900 | `/`, `/work`, `live-f1-intelligence`, `football-intelligence-os` | none | 0 | hero 65→687, completes in first viewport |
| 1024×800 | `/` | none | 0 | `lg` boundary: nav + utility cluster both visible, no collision |
| 768×1024 | `/` | none | 0 | menu toggle 44×44 |
| 390×844 | `/`, `/work`, `/contact`, `live-f1-intelligence`, `football-intelligence-os` | none | 0 | h1 41px, one line |
| 375×812 | `/`, `vyaparpulse` | none | 0 | thinnest case study: sections 01–07 contiguous, no index section invented |

Overflow was measured element-by-element against the viewport with
`overflow-x: auto | scroll` containers and fixed-position elements excluded —
so the intentional local scroll container in the technical appendix is not
counted as a page-level overflow, and no page-level overflow was suppressed
with `overflow: hidden`.

**Accessibility-tree reads:** homepage (full tree, all landmarks, both nav
occurrences, the skip link first in tab order), `/work`, `/contact`,
`live-f1-intelligence`. Heading levels confirmed as `h1` → `h2` → `h3`
throughout with no skipped level.

**Keyboard/disclosure:** the six `<details>` panels on
`football-intelligence-os` were opened and re-measured — 0 targets under 44px
open or closed; summary heights 44px and 120px.

### 4.5 Contrast — measured on the production build

From `getComputedStyle` on rendered text against the computed body background
`rgb(10,11,13)`:

| Token | Measured | Requirement |
|---|---|---|
| `--color-foreground` `#F1F2F4` | **17.58:1** | 4.5:1 ✅ |
| `--color-foreground-muted` `#B8BBC2` | **10.24:1** | 4.5:1 ✅ |
| `--color-foreground-faint` `#8B8F98` (11px metadata) | **6.08:1** | 4.5:1 ✅ |

### 4.6 Motion / reduced motion

The scroll-reveal was driven for real: all **9** `.reveal` wrappers reach
computed `opacity: 1` when scrolled into view; `animation-timeline: view()`
reports supported in the test browser. No content is permanently hidden.

Reduced motion is honoured by construction, and this is a **code-level**
verification rather than a measured one: the `.reveal` animation exists only
inside `@supports (animation-timeline: view())` **and**
`@media (prefers-reduced-motion: no-preference)`, so under `reduce` the
selector is never applied and content renders in its final visible state. The
media query was not emulated in the browser during this pass — the tool
available only emulates colour scheme. Reported as unmeasured, not as passed.

### 4.7 Console and network — production build

`preview_logs` on the production build: **no console errors, no warnings, no
hydration messages, no failed requests.** (The dev server showed only the
standard React DevTools notice.)

### 4.8 Payload measurement — homepage, production build

Method: parse the homepage's production HTML for `/_next/static/...` `.js`,
`.css` and `.woff2` references, then `curl` each and sum
`%{size_download}`, with a second pass sending `Accept-Encoding: gzip`.

- HTML: **145,796 bytes raw** (uncompressed; dominated by the inlined RSC
  flight payload — this is *not* a transfer size).
- Referenced JS + CSS: **10 files**, totalling **772,113 bytes raw /
  ~191,000 bytes gzip** including the Next 16 + React 19 App Router runtime.
- Fonts: **5 `.woff2` files, 124,184 bytes** (Barlow Condensed, Inter 400/500/600,
  JetBrains Mono; already compressed).

**These are lab measurements of asset bytes on a local production server.**
No LCP, CLS or INP figure is reported: nothing in this pass measured runtime
timing, and no field/RUM data exists for this project. The brief's G6 targets
are therefore **not** claimed as met.

---

## 5. Final review against the acceptance criteria

| Criterion | Status | Basis |
|---|---|---|
| Existing architecture preserved | ✅ | Next 16 / root `app/` / typed `data/` / 7 slugs unchanged |
| All seven projects distinct | ✅ | 7 routes, 7 distinct instruments, all 200 |
| No academic score information | ✅ | none in `data/` or rendered output |
| Hero clearly identifies Asish and his focus | ✅ | name + both roles + statement in first viewport at every width |
| Distinctive visual identity | ✅ | hero now leads with the project's own convergence architecture, not a placeholder |
| Every project easy to understand quickly | ✅ | hook + thesis + status + evidence above the fold on each case study |
| Technical depth still available | ✅ | appendix `<details>` panels intact and keyboard-operable |
| No fabricated metrics or capabilities | ✅ | hero figures read from `data/projects.ts`; nothing invented; fake readout deleted |
| No fake links or live-data claims | ✅ | the one fake live claim removed; links still rendered only when a real URL exists |
| Motion restrained and reduced-motion safe | ⚠️ code-verified, not emulated | see §4.6 |
| Keyboard and accessibility verified | ✅ | 0 targets <44px at all five widths, heading order, a11y tree, 194 assertions |
| Desktop and mobile layouts reviewed | ⚠️ geometry only | see §6 — no screenshots available |
| All public routes checked | ✅ | 16 routes + 404 on the production build |
| Type checking and linting pass | ✅ | §4.1 |
| Tests pass | ✅ | 57/57 |
| Production build passes | ✅ | 18 routes |
| Performance risks measured or documented | ✅ | payload measured (§4.8); JS baseline, raw HTML and display clamp documented as risks |
| SEO and social metadata verified | ✅ | 194-assertion audit incl. canonical + `og:image` |
| No console, hydration or broken-resource errors | ✅ | §4.7 |
| Documentation accurate | ✅ | this file + the audit; every number traceable to a command in this session |
| Work stops at the criteria | ✅ | nothing further was added |

---

## 6. Remaining limitations and owner input required

### Limitations of this pass — stated plainly

1. **No screenshots.** `preview_screenshot` could not composite in this
   environment. All layout verification is DOM geometry and computed styles.
   **Optical** quality — colour relationships, figure legibility as an image,
   alignment by eye — was not inspected. If visual confirmation matters, the
   running production preview is registered in the thread and the site should
   be looked at directly.
2. **Reduced-motion not emulated** (§4.6). Verified structurally, not by
   rendering under the media query.
3. **No runtime performance timing.** No LCP/CLS/INP; no field data.
4. **Accessibility scanning was structural, not exhaustive.** No axe/Lighthouse
   run and no screen-reader session. Landmarks, heading order, target sizes,
   contrast, labels and external-link rel were checked; form semantics are
   vacuous here (there is no form).
5. **Skill interview step not run** — superseded by this brief's explicit
   autonomous-execution instruction; stated in the audit §2.

### Still required from the owner (unchanged, none invented)

- **Repository / demo / documentation URLs for all seven projects.** Every
  project's `links` object is empty, so each case study falls back to the
  honest "Explore the system ↓" action rather than linking nowhere. This is
  the single largest remaining gap for a technical reviewer.
- **`NEXT_PUBLIC_SITE_URL`** for the production origin. Canonical URLs,
  `robots.txt` and `sitemap.xml` currently resolve to `http://localhost:3000`.
  Not fabricated; the code is already configurable.
- **`technologies` for F1 Lap-Time Simulator** beyond the three named in its own
  copy (MATLAB, Python, NumPy).
- **`year` and `status` for VyaparPulse** — `year` is `"TBD"` and is filtered
  out by every consumer, so it renders without a year.
- **Real project media.** No screenshots or captured diagrams exist; the
  labelled SVG instruments remain the interim visuals and are captioned as
  illustrative.
- **Confirmation that "Available for work" is correct** now that it is stated
  in the header rather than on the contact page alone.

### Deliberately not done

No blog, CMS, auth, backend, database, analytics, chatbot, fake telemetry
service, extra project category, dashboard widget, extra animation or extra
page was added. WebGL remains declined. No new dependency was installed.
