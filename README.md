# Asish Oliver M — Portfolio

Next.js 16 + TypeScript 6 portfolio for **Asish Oliver M** — Motorsport
Software Engineer · AI/ML Engineer.

Design constitution: **[PRD.md](./PRD.md)** (goals, requirements, acceptance
criteria, tooling decisions), **[PRODUCT.md](./PRODUCT.md)** (identity,
audience, voice, content-truth policy) and **[DESIGN.md](./DESIGN.md)**
(palette, type, layout, motion, accessibility contract). Audits live in
[docs/](./docs/).

## Status

| Gate | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | pass |
| Lint | `npm run lint` | pass |
| Tests | `npm run test` | 162 pass |
| Build | `npm run build` | pass — 29 routes (11 static + 18 SSG) |
| Live site audit | `npm run audit:site -- http://localhost:3000` | 277 assertions / 15 routes |

`npm run verify` runs the first four. `npm run audit:site` checks a **running**
server (dev or production) for semantics, headings, landmarks, images, links
and SEO.

**Runtime dependencies: `next`, `react`, `react-dom`. Nothing else.** No
animation library, no WebGL, no smooth-scroll library — the two effects the
site needs are plain CSS. Five unused dependencies (`gsap`, `lenis`, `three`,
`@react-three/fiber`, `@react-three/drei`) were removed.

See [docs/GODLEVEL_FINAL_REPORT.md](./docs/GODLEVEL_FINAL_REPORT.md) for the
latest transformation write-up and measured results, and
[docs/godlevel-visual-audit.md](./docs/godlevel-visual-audit.md) for the audit
that drove it.

> The build **had never passed** before this pass. It failed on a
> `noUncheckedIndexedAccess` error, and `npm run lint` was crashing before
> linting a single file. Both are fixed; see
> [docs/godlevel-audit.md](./docs/godlevel-audit.md).

## Running it

```bash
npm install
npm run dev       # http://localhost:3000
npm run verify    # typecheck + lint + test + build
```

Set `NEXT_PUBLIC_SITE_URL` in the deploy environment to the production
origin; canonical URLs, `robots.txt` and `sitemap.xml` all derive from it.

## Design tooling (optional)

Regenerate the agent skill harnesses with:

```bash
npx impeccable install --project --yes
npx skills add https://github.com/Leonxlnx/taste-skill -s design-taste-frontend -y --copy
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill -s ui-ux-pro-max -y --copy
npx motion-ai          # requires an interactive terminal
```

These write into gitignored directories and are excluded from lint. **None
of them are runtime dependencies** — the site ships no design-system or
animation library.

## Content policy

No invented metrics, experience, technologies, clients or academic scores.
Unknowns are `TODO(owner)` comments in `data/projects.ts`, never rendered.
Synthetic visuals must be labelled illustrative. Verified figures are
attributed to their source in `data/projects.ts` and on the case-study
pages themselves — across Live F1 Intelligence, EA FC Player Intelligence,
Football Intelligence OS, and Sentinel AI.

## Phase 2 progress

- [x] **2A — Foundation visual system.** Nav, footer, buttons, badges,
      technical labels, container, responsive shell.
- [x] **2C — Project index ("Selected Systems").** `/work` — all nine
      projects, flagship rows with more visual weight.
- [x] **2D/2E — Case-study page system.** `/work/[slug]` — one reusable
      template covering all nine projects; sections render only where
      real content exists.
- [x] **2B — System Boot, Hero, Signature Engineering Visual** (SVG
      version — see the WebGL decision below). Built and visually verified
      in a real Chromium browser (via Playwright) before being ported to
      React — caught 3 real bugs this way that reading the code wouldn't
      have.
- [x] **2F — Engineering Domains, AI/ML section, Experience, Currently
      Building, Technical Arsenal, About, Contact.** Completes the
      homepage (spec §7's full section order) and adds the dedicated
      `/experience`, `/about`, `/contact` pages the nav already linked
      to. New data transcribed verbatim from the spec, not invented:
      `data/engineering-domains.ts`, `data/ai-ml-flows.ts`. Verified
      the highest-layout-risk new patterns (the responsive domains
      grid, experience row wrapping) against real Chromium screenshots
      at desktop/tablet/mobile — lighter-touch than 2B's pass since
      these are plain grid/flexbox layouts, not bespoke composition.
- [x] **2G — Motion system, resolved without a library.** Both effects are
      plain CSS: the boot readout uses keyframes and now renders *inline in
      the hero* instead of as a `fixed inset-0` overlay that covered the LCP
      element for 2.4s; section reveal uses `animation-timeline: view()`,
      replacing an IntersectionObserver client component that shipped
      `opacity-0` in server HTML. No GSAP, Lenis, ScrollTrigger or Motion —
      see [DESIGN.md](./DESIGN.md#motion) for why none is justified.
- [x] **2H — Hardening.** The build now actually passes. Added a 17-test
      Vitest suite over project-data integrity, `npm run verify`
      (typecheck → lint → test → build), robots/sitemap/icon/OG image,
      per-route canonicals, a skip link, and a heading/landmark/contrast/
      focus audit run against a live server at 1440 and 390.
- [x] **3A — Final experience pass.** `SystemBoot` (the fake boot readout)
      was **deleted**, not restyled: four filling progress bars in the
      hero's most valuable column, `aria-hidden`, asserting a system state
      that does not exist. Replaced by `HeroInstrument` — the flagship's
      real four-provider convergence, with its verified figures read from
      `data/projects.ts`. The hero's domain status band is now derived from
      the same data instead of hardcoded. Every interactive target raised
      to the 44px the design contract already promised (11 were below it,
      including both hero CTAs at 36/38px). The header's `SYSTEM STATUS:
      ONLINE` became `AVAILABLE FOR WORK`, which is true. The last two
      kicker-above-heading patterns were removed. Scrollbar and caret are
      now themed from the palette. See
      [docs/FINAL_EXPERIENCE_AUDIT.md](./docs/FINAL_EXPERIENCE_AUDIT.md)
      and [docs/FINAL_EXPERIENCE_REPORT.md](./docs/FINAL_EXPERIENCE_REPORT.md).
- [x] **3B — Sentinel AI added as the eighth project.** Sourced from its own
      repository rather than from a brief: technologies, per-feature states,
      the test result, the coverage figure and the limitations are all read
      from its source and its handoff documents (artifacts dated 2026-10-07).
      Catalogue position **07**, which shifts VyaparPulse to **08** —
      verified in the rendered index, where Sentinel AI appears exactly once.
      Its architecture is a *containment* hierarchy (policies contain
      controls, controls carry evidence), so it got a new `governance`
      instrument rather than reusing a flow shape, and a new
      `enterprise-grc` category rather than being filed as AI/ML. Every
      figure is attributed where it is shown, and its four unsourced-when-
      tempting claims — deployment, users, certification, live model output —
      are stated as absent. See
      [docs/SENTINEL_AI_ADDITION.md](./docs/SENTINEL_AI_ADDITION.md).
- [x] **3C — F1 Voice Engineer added as the ninth project.** Catalogue
      position **04**, immediately after RaceMind-AI, which shifts F1 Race
      Manager to 05 and Sentinel AI to 08. Sourced from the project's own
      specification and recorded status rather than from a repository — it
      has *not* been published, so its entry carries
      `links.visibility: "unpublished"` with no URL (and none invented), and
      the page renders "Explore the system" rather than "View Source". Its
      defining claim is a boundary: 3,313 tests / 20 skipped / 0 failed and
      five quality gates are reported with their provenance attached, while
      live-game telemetry decoding is recorded as **not run** because F1 25
      and the F1 2026 Season Pack were unavailable. It got a new `voice`
      instrument, a new `voice` category, and the template gained two
      project-authored flow-figure labels. See
      [docs/F1_VOICE_ENGINEER_PORTFOLIO_INTEGRATION.md](./docs/F1_VOICE_ENGINEER_PORTFOLIO_INTEGRATION.md).
- [x] **3C-fix — two defects found while adding it.** The links block
      rendered the `visibility` control field as a link (`href="unpublished"`)
      on every unpublished project; the appendix summary promised provider
      contracts, a capability registry, data lineage and an API surface to
      projects that have none. Both are fixed in the shared template —
      details and evidence in the integration doc.
- [x] **3D — Signature motion system ("Engineering in Motion").** One CSS
      token layer (durations, easings, distances, stagger) and fifteen
      named primitives replace the single `.reveal` class. The homepage's
      circuit/speed-profile figure now draws itself in six ordered windows
      of its own scroll entry, then holds with one low-amplitude breathe;
      the hero enters identity → roles → statement → actions; the nine
      project motifs and every case-study diagram arrive in draw order
      from shared rules; interior pages share one header entrance; case
      studies carry a scroll-linked reading bar. The header's nav
      indicator stopped animating `width` (a layout property) and now
      scales a hairline, and hover *and* keyboard focus drive the same
      traces on project rows. Zero client JavaScript was added — first-load
      JS is unchanged at 136 KB, CLS 0 at every width, and every animation
      is gated behind `prefers-reduced-motion: no-preference` (plus
      `@supports` for the scroll layer). Enforced mechanically by
      `lib/motion.test.ts`, which fails the build if a component hardcodes a
      duration, if a token is defined but unused, if a keyframe is dead, or
      if any animation escapes the reduced-motion gate. See
      [docs/MOTION_SYSTEM_AUDIT.md](./docs/MOTION_SYSTEM_AUDIT.md) and
      [docs/MOTION_SYSTEM_IMPLEMENTATION_REPORT.md](./docs/MOTION_SYSTEM_IMPLEMENTATION_REPORT.md).
- [ ] **WebGL enhancement layer — declined, not deferred.** The signature
      visual is SVG and fully expressive; the spec makes WebGL an
      enhancement to be *measured* before building and forbids a 3D homepage
      "just because WebGL is available". `three`, `@react-three/fiber` and
      `@react-three/drei` were removed from `package.json` as unused.

The homepage (`app/page.tsx`) is now fully assembled per spec §7's
order. `/work`, `/work/[slug]`, `/experience`, `/about`, `/contact` all
exist and are reachable from the nav.

## Social cards

Every case study generates its own preview image at
`/work/<slug>/opengraph-image`, so eight different systems no longer arrive in
a timeline as eight links that look like the same page. The card is the
case-study hero compressed to 1200×630: catalogue number, status lamp,
category, tagline, title, and the project's key evidence beside its own
instrument motif.

- **Composed from the data, not drawn by hand.** `lib/og/project-card.tsx`
  builds each card from `data/projects.ts` at build time, so a preview cannot
  go stale against the project it advertises. All nine are prerendered; the
  pages that are *about the portfolio* (`/`, `/work`, `/about`,
  `/experience`, `/contact`) deliberately keep the site card.
- **One copy of each motif.** `components/work/instrument-geometry.tsx` holds
  the nine shapes once. The page colours them with `var(--color-*)`; the card
  colours them with literal hex, because satori renders outside the CSS
  cascade and resolves nothing from `globals.css`.
  `components/work/instrument-geometry.test.ts` asserts the two renderings
  differ by colour values alone — same elements, same attributes, same
  coordinates.
- **The palette stays single-source.** `lib/og/palette.ts` contains the only
  literal hex outside `globals.css`, and `lib/og/palette.test.ts` parses
  `globals.css` and fails if the two ever disagree.
- **Per-project alt text** lives with the card in `projectCardAlt()` and
  travels on the page's metadata, because a static `alt` export on the image
  route cannot read the route's params.

`tests/site-audit.mjs` derives its case-study routes from
`data/projects.ts` rather than listing them, so a new project is audited —
and card-checked — the moment it exists.

## Verification note

This pass ran against a live dev server with a real browser, so the previous
"no network here, nothing has been compiled" limitation no longer applies.
Everything asserted in the docs was measured: contrast ratios from computed
styles, heading structure from rendered HTML across eight routes, focus
rings from real keyboard focus, and overflow at 1440 and 390.

## What was verified for real

- A real Chromium binary (via Playwright, already present in this
  sandbox) rendered the boot sequence, hero, and signature visual as a
  static HTML/CSS/SVG prototype, screenshotted at multiple timepoints
  and viewports, actually reviewed — not assumed correct from reading
  the source. Caught and fixed: a `:nth-of-type` selector bug that
  silently reordered the boot sequence, a hardcoded desktop padding
  value that broke mobile layout, and SVG text that shrank to
  illegible size on mobile instead of adapting. The reduced-motion
  path was tested too, including combined with Phase 1's existing
  global reduced-motion rule (not assumed compatible).
- The Tailwind `hidden`/`md:inline` utility approach on SVG elements
  was checked by hand-writing the equivalent CSS Tailwind v4 would
  generate and testing that exact mechanism, since Tailwind itself
  isn't installed here.
- Next.js 16 requires `params` to be awaited as a `Promise` on every
  page/layout/`generateMetadata` — verified via search rather than
  assumed, since it postdates most models' training data (this one
  included). `/work/[slug]/page.tsx` uses the correct async form.
- Every `@/` import across the whole repo was cross-checked against a
  real export in its target file (not just that the file exists).
- A nested `<footer>`-in-`<footer>` semantic-HTML bug and a CSS
  variable collision between `next/font` and the token system were
  both caught by hand review before committing.
- Social cards were verified from the bytes rather than by eye: all eight
  `/work/<slug>/opengraph-image` responses were fetched, decoded from the PNG
  (signature, `IHDR`, inflate, per-row un-filter) and checked pixel by pixel —
  1200×630, distinct content per project, palette-correct background and panel,
  accent ink present, the reserved live green only on `active` projects,
  nothing inside the outer 16px margin, and an identical band structure across
  all eight. The *painting* is the one thing that could not be checked by
  looking: the preview webview does not composite in this environment, so
  screenshots were unavailable and the cards were measured instead.
- Extracting the shared instrument geometry was proved non-destructive rather
  than assumed: all eight rendered instrument `<svg>` blocks were diffed
  against a capture taken before the refactor, and all eight are byte-identical.

## What's still needed from the owner

Reconciled against the current source. GitHub is now resolved; the rest are
genuine gaps that must not be invented away:

- **Publication status is independent of completion status.** Three projects
  have `links.visibility: "unpublished"`: F1 Lap-Time Simulator (completed
  MATLAB implementation, repository not yet published), Sentinel AI (active
  development, canonical repository not public under T-Bone47) and F1 Voice
  Engineer (standalone prototype whose repository has not been published).
  None is downgraded or dropped from the catalogue. When a repository is
  published, set `links.visibility: "public"` and add the URL — no other
  change needed, and the case study's "Explore the system" button becomes
  "View Source" automatically.
- **F1 Voice Engineer's live-game telemetry** is the one verification this
  repository cannot perform: it needs F1 25 or the F1 2026 Season Pack in a
  test environment. Until then the page states the boundary rather than
  implying the integration works.
- `NEXT_PUBLIC_SITE_URL` for production.
- Real media for every project. Sentinel AI is the exception: **21 real
  screenshots plus written alt text exist** in its own project folder. They
  are deliberately NOT imported here — this project ships no asset directory
  by design, and adding media for one project is a media-pipeline decision
  (optimisation, aspect handling, alt-text conventions) rather than a
  data-entry one. Flagged as an owner decision, not forgotten.

Resolved in the project-intelligence expansion: EA FC Player Intelligence and
Football Intelligence OS previously carried placeholder copy written from the
portfolio brief alone. Both are now derived from their actual repositories —
architecture documents, ADRs, schema migrations and, where the environment
allowed, their own executed test suites. Their technologies, years, statuses,
architecture, provider lists, capability registries, API surfaces and test
counts are all read from source, with per-claim evidence status recorded on the
page itself.

See `data/projects.ts`'s header comment for the full list with reasons.

## Repository structure (current)

```
app/
  layout.tsx, page.tsx, error.tsx, not-found.tsx, globals.css
  icon.svg, opengraph-image.tsx, robots.ts, sitemap.ts
  work/page.tsx, work/[slug]/page.tsx
  work/[slug]/opengraph-image.tsx  (per-project social card)
  experience/page.tsx, about/page.tsx, contact/page.tsx
components/
  ui/        Button, Badge, TechnicalLabel, Container, FlowSteps, Reveal
  layout/    Header, Footer
  work/      ProjectIndex, ProjectIndexRow, ArchitecturePipeline,
             MetricGrid, CaseStudySection, ProjectInstrument,
             instrument-geometry (the nine motifs, palette-agnostic)
  home/      Hero, HeroInstrument, SignatureVisual, EngineeringStatement,
             SelectedSystemsPreview, EngineeringDomains, AiMlSection,
             ExperienceTimeline, CurrentlyBuilding, TechnicalArsenal,
             AboutContent, AboutPreview, ContactSection
lib/         utils.ts (cn helper), metadata.ts (pageMetadata)
             motion.test.ts (motion-system governance gate)
             og/  palette.ts (literal hex for satori), project-card.tsx
types/       Project, Experience, Education, Skill, Site
data/        site.ts, navigation.ts, projects.ts, experience.ts,
             education.ts, skills.ts, engineering-domains.ts,
             ai-ml-flows.ts, projects.test.ts,
             projects-validation.test.ts (build-time content gate),
             projects-f1-voice-engineer.test.ts (project 09's own rules)
tests/       site-audit.mjs (live structural audit)
docs/        design-tokens.md, design-system-audit.md,
             godlevel-audit.md, godlevel-visual-audit.md,
             GODLEVEL_FINAL_REPORT.md, GODLEVEL_PORTFOLIO_FINAL_REPORT.md,
             FINAL_EXPERIENCE_AUDIT.md, FINAL_EXPERIENCE_REPORT.md,
             SENTINEL_AI_ADDITION.md,
             F1_VOICE_ENGINEER_PORTFOLIO_INTEGRATION.md,
             MOTION_SYSTEM_AUDIT.md, MOTION_SYSTEM_IMPLEMENTATION_REPORT.md
```

No `lib/motion/` and no `public/`: there is no motion library (CSS does it
all) and no static asset directory — the icon, OG image, robots and sitemap
are all generated from `app/`. The motion *system* is a token layer plus named
primitives in `app/globals.css`, applied as classes on server components, and
`lib/motion.test.ts` is the gate that keeps it from being bypassed.
