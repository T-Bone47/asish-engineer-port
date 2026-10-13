# Godlevel Audit — Asish Oliver M Portfolio

Audit conducted against the source of truth, not from imagination. Every claim
below was verified by compiling, running, or measuring — not by reading code
and assuming.

**Headline finding: this project had never successfully built.** The README
stated that `npm install && npm run build` was "still the first real test".
That test had never been run. When it was, it failed — and so did lint, in a
way that had been silently reporting success.

---

## Current strengths

- **Token architecture is genuinely three-layer** (primitive → semantic →
  component) with a documented rationale. Rare and worth preserving.
- **Content truth discipline is real.** `data/projects.ts` marks every unknown
  with `// TODO(owner)` rather than a plausible placeholder, and consumers
  filter the `"TBD"` year sentinel. No invented metric, client or result
  exists anywhere in the repo.
- **Server-first.** Only three files were `"use client"` across the whole app;
  every data-driven list and page is a Server Component.
- **`/work/[slug]` is a genuine data-driven case-study system** that renders
  sections only where content exists, rather than padding to a template.
- **Reduced-motion was considered at authoring time**, not bolted on.

## Current weaknesses

- **No working build.** `TS18048: 'nextProject' is possibly undefined` under
  `noUncheckedIndexedAccess` aborted `next build` outright.
- **Lint was a no-op.** `FlatCompat` against flat-only `eslint-config-next`
  16 threw "Converting circular structure to JSON" during config
  normalisation, aborting before a single file was checked. Fixed by
  consuming the package's native flat exports — which then immediately
  surfaced three more real bugs.
- **Five unused dependencies.** `gsap`, `lenis`, `three`, `@react-three/
  fiber`, `@react-three/drei` were declared and imported *nowhere*. Roughly
  200 MB of dead install, and a standing temptation to build the WebGL layer
  the brief explicitly says not to build blind.
- **The boot overlay blocked the LCP element.** `SystemBoot` was
  `fixed inset-0 z-[60] bg-background`, covering the hero `<h1>` for 2.4 s on
  every homepage load, replaying on every client-side navigation home, and
  leaving the header nav tabbable underneath.
- **`Reveal` shipped `opacity-0` in server HTML.** Nine below-the-fold
  sections rendered invisible until hydration; any JS failure left the page
  permanently blank.
- **`/contact` had no `<h1>` at all** — `ContactSection` hard-coded `h2`
  because it is a section on the homepage and a page on `/contact`.
- **Every route inherited `canonical: "/"`** from the root layout, telling
  crawlers that /work, /about and all six case studies were duplicates of the
  homepage.
- **Case studies had no `og:image`** — the route replaced `openGraph`
  wholesale rather than merging, discarding the file-convention image.
- **Titles double-suffixed**: "Work — Asish Oliver M — Asish Oliver M".
- **The About page duplicated the homepage** — the same `FlowSteps` chain and
  the same two sentences, on two routes, answering nothing about who Asish is.
- **Uniform section rhythm**: nine sections shared `py-16 md:py-20`.
- **The kicker pattern.** A `TechnicalLabel` sat above essentially every
  heading — the single most repeated "AI portfolio" tell.

## Technical risks

- No tests and no CI gate existed; the only way to catch a build break was to
  run a build.
- `noUncheckedIndexedAccess` was enabled but the code didn't satisfy it —
  meaning strictness was declared and unenforced.
- No `public/` directory: favicon, robots.txt and sitemap all 404'd.

## Visual risks

- Telemetry-green accent read as *generic dev terminal*, not motorsport.
- Signature visual was a decorative squiggle + staircase with no encoded
  information — two arbitrary strokes, not two data series.

## UX risks

- Hero offered exactly one destination ("View Systems"); there was no route
  to Experience from the first screen, for the audience that most needs it.
- Header's "System Status: Online" competed for attention using the same
  colour as section headings.

## Performance risks

- 2.4 s opaque overlay over the LCP element — the budget was forfeited before
  first paint.
- `Reveal` forced a client boundary around nine sections for an effect CSS
  now performs natively.

## Accessibility risks

- Missing `<h1>` on `/contact`; heading-level skips (`h1 → h3`) on `/`,
  `/work`, `/experience`.
- No skip-to-content link despite a sticky header.
- Focus rings existed but were never verified.

## Content risks

- `"TBD"` sentinel and empty `technologies: []` were correctly filtered, but
  two projects render with no technology list at all — visually thin.
- No GitHub link anywhere (now resolved by the owner).

## Motion opportunities

- Section reveal → CSS scroll-driven (`animation-timeline: view()`): removes
  JS, hydration, and the no-JS invisible-content failure mode.
- Boot sequence → inline in the hero, keeping the identity but costing no LCP.
- No animation library is warranted. CSS covers both cases.

## Architectural opportunities

- Single metadata builder (`lib/metadata.ts`) so title/canonical/OG can't
  drift per route.
- Sitemap generated from the same `projects` array the routes render from, so
  a project cannot exist without being listed.
- `getNextProject()` as a guarded, testable helper rather than inline index
  arithmetic.

## WebGL decision

**No.** The signature visual is SVG and is fully expressive without a 3D
layer. The brief makes WebGL an enhancement that must be measured before it
is built, and it explicitly forbids a 3D homepage "just because WebGL is
available". No WebGL layer is installed or planned; `three`,
`@react-three/fiber` and `@react-three/drei` were removed as unused.