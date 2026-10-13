# Final Report — Asish Oliver M Portfolio

Generated against a running **production** build (`next build` + `next start`),
not a dev server. Every number below was measured, not estimated.

---

## Executive summary

The repository's own README claimed `npm install && npm run build` was "still
the first real test." **That test had never been run.** When it was, the build
failed on a strict-mode type error and `npm run lint` was crashing before
linting a single file — while reporting success.

The first substantive act of this work was therefore not visual at all: it was
making the project's own quality gates real. Once the gates worked, they
immediately found five more genuine defects. Only then did design work begin,
on a codebase that could finally be trusted to compile.

## What was already strong (and preserved)

- **Three-layer token architecture** (primitive → semantic → component) with a
  documented rationale. Genuinely good; refined, not replaced.
- **Content truth discipline.** Unknowns are `TODO(owner)` comments, never
  rendered placeholders. No invented metric, client, employer or academic
  score exists anywhere. This was the single strongest thing about the project
  and it was left intact.
- **Server-first architecture** — only two client components ship.
- **Data-driven case-study system** that renders sections only where real
  content exists.

## What changed

### Correctness (all found by making the gates work)
| Fix | Impact |
|---|---|
| `TS18048` build-blocking type error | Build now passes for the first time |
| ESLint `FlatCompat` crash | Lint actually runs; found 3 more bugs |
| 5 unused deps removed | ~200 MB dead install eliminated |
| `nextProject` possibly-undefined | Replaced with tested `getNextProject()` |
| 3 lint errors (unused imports, unescaped `'`) | Fixed |

### Performance & resilience
- **SystemBoot no longer blocks the LCP element.** It was `fixed inset-0
  z-[60]` covering the hero `<h1>` for 2.4 s on every load, replaying on
  client-side navigation home, with the header nav tabbable underneath. Now an
  inline readout in the hero.
- **`Reveal` no longer ships `opacity-0` in server HTML.** Nine sections were
  invisible until hydration; any JS failure left the page blank. Replaced with
  `animation-timeline: view()` — pure CSS, no client boundary, and the failure
  mode is "no animation" rather than "no content".

### Accessibility
- `/contact` had **no `<h1>`** at all.
- Heading-level skips (`h1 → h3`) on `/`, `/work`, `/experience`.
- Every route inherited `canonical: "/"` — six case studies advertised as
  duplicates of the homepage.
- Case studies had **no `og:image`** (route replaced `openGraph` wholesale).
- Titles double-suffixed: "Work — Asish Oliver M — Asish Oliver M".
- Added skip-to-content; verified focus rings on 8 focusables.

### Design
- **Accent: telemetry green → papaya (`#FF7A18`).** Green read as generic dev
  terminal. Green was *demoted*, not discarded — it now means exactly one
  thing ("running right now") via `--color-live`.
- **Signature figure** rebuilt: was a decorative squiggle encoding nothing, now
  a **Circuit / Speed Profile** — track (accent) and speed profile (cyan) on a
  shared horizontal axis, so fast corners align with apexes. Labelled
  `SCHEMATIC — NOT MEASURED` on the canvas.
- **Responsive = two compositions.** One 1200×560 viewBox rendered 295×138 at
  360 px, shrinking the track to a thread. Mobile now gets a cropped, heavier-
  stroke track at 295×91; the full figure returns at `md`.
- **Architecture diagram** rebuilt from an undifferentiated numbered list into a
  directional rail with typed Source/Process/Output nodes.
- **Layout variance:** `EngineeringDomains` and `TechnicalArsenal` were the
  identical `lg:grid-cols-3` block twice on one screen. Now a spec table and a
  numbered index.
- **Eyebrow demotion** — the site's most repeated AI tell removed.
- **Case study:** metrics promoted from below-the-fold into a hero evidence
  band; `tagline` (present in data for all six projects, never rendered) now
  shows; **technologies** now render at all.
- **`/work` flagship block** — the project with verified metrics previously had
  identical visual weight to projects with no numbers.
- **About page** de-duplicated (it previously repeated the homepage statement
  verbatim).

## Verification results

| Gate | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run test` | **25 pass** (2 files) |
| `npm run build` | pass — 17 static routes |
| `node tests/site-audit.mjs` | **179/179 assertions, 12 routes** |
| Impeccable anti-pattern detector | 2 findings, both false positives |

Measured in-browser:

| Metric | Value |
|---|---|
| Contrast (headings / body / 12px meta) | 17.58:1 · 10.24:1 · 6.08:1 |
| Horizontal overflow @ 360 / 390 / 1440 | 0 |
| Client components shipped | 2 (`error.tsx`, `Header.tsx`) |
| Homepage HTML (gzipped) | 16.2 KB |
| Homepage JS (gzipped) | 174.9 KB — all React/Next runtime baseline |

### A bug in my own audit script
The first audit run reported "external links use noopener — FAIL, 9 unsafe" on
`/`. The links were correct. My check matched `rel="noopener"` **with a closing
quote**, but the code uses `rel="noopener noreferrer"` — the character after
`noopener` is a space. Every safe link was flagged. Fixed to match the
attribute prefix. Recorded because a test that is wrong is worse than no test.

## Test results

`data/projects.test.ts` (21) — unique ids/slugs, url-safe slugs, valid status
and category enums, https-only links, non-empty required copy, the `"TBD"`
sentinel never treated as content, metrics well-formed, and the content-truth
invariant that a project cannot claim `completed` while its own `currentState`
reads unfinished. Plus `getNextProject` ordering/self-link/fallback and
flagship selection (featured **and** evidence-backed).

`app/work/[slug]/page.test.ts` (4) — **no case-study section may render an empty
body.** This shipped a real bug: once metrics moved to the hero,
"Performance / Results" rendered as a bare heading over nothing.

## Content audit

No fabricated content was introduced. Metrics are rendered verbatim — no
client-side rounding or "improvement". Verified evidence remains Live F1
Intelligence only; a test asserts no other project currently carries metrics, so
adding them becomes a deliberate reviewed decision.

## WebGL status

**Declined, not deferred.** The SVG figure is expressive; the brief forbids a 3D
homepage "just because WebGL is available." `three`, `@react-three/fiber` and
`@react-three/drei` removed as unused.

## Known limitations

- **This is not a git repository.** Nothing has been committed.
- `NEXT_PUBLIC_SITE_URL` must be set at deploy time or canonicals resolve to
  localhost.
- Two projects render thinner than the rest — no technologies, `"TBD"` year.
  Deliberate honesty pending owner input.
- LCP/CLS/INP were reasoned about (no overlay over the h1, no client JS for
  reveals, no layout-animating properties) but **not** measured with a
  field/lab profiler. Do not claim the numbers.
- Motion+ MCP servers unconfigured (`npx motion-ai` needs a TTY). Nothing
  depends on them.
- Route transitions were **declined**: an entrance animation delays LCP, and the
  brief's own priority order puts performance above motion.