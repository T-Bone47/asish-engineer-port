# Final Experience Audit — Asish Oliver M Portfolio

**Stage A–B of the Final Experience Excellence Pass.**
Audit only — what was found, how it was checked, and what it was ranked
against. What was actually changed is in
[FINAL_EXPERIENCE_REPORT.md](./FINAL_EXPERIENCE_REPORT.md).

Everything below is a measurement or a read of the source. Nothing here is
an impression. Where a check could not be run, it says so.

---

## 1. Repository baseline

The project is a Next.js 16.3.8 / React 19 / TypeScript 6 portfolio with
Tailwind v4, root-level `app/`, seven projects in one typed data module, and
no runtime dependency beyond `next`, `react` and `react-dom`.

There is **no git repository** in this working copy — `git status` returns
`fatal: not a git repository`. No history was inspected because none exists
here, and nothing was reset or discarded.

### Baseline gate (before any edit)

| Gate | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | pass |
| Lint | `npm run lint` | pass |
| Tests | `npm run test` | **57 passed** (2 files) |
| Build | `npm run build` | pass — 18 routes (11 static, 7 SSG) |
| Live audit | `node tests/site-audit.mjs` | **194 assertions, 13 routes, all pass** |

The build was already green. This pass was therefore an *improvement* pass,
not a repair pass — findings had to be argued against a working site, not
against a broken one.

### Content inventory verified

Seven distinct projects, all present in `data/projects.ts` and all rendering
at their own route:

`live-f1-intelligence` · `f1-lap-time-simulator` · `racemind-ai` ·
`f1-race-manager` · `ea-fc-intelligence` · `football-intelligence-os` ·
`vyaparpulse`

No academic score metadata (CGPA / GPA / marks / semester) appears anywhere
in `data/` or in rendered output. Education renders as institution and
program only.

---

## 2. Design-skill availability

All four named skills were **already installed** in the working tree. Nothing
was reinstalled.

| Skill | Location | State |
|---|---|---|
| impeccable | `.agents/skills/impeccable/` (+ `.claude` `.grok` `.kiro` `.pi` `.opencode` `.gemini` `.agent`) | **invocable — verified** |
| taste (`design-taste-frontend`) | `.agents/skills/design-taste-frontend/` | present; markdown reference, no launcher |
| ui-ux-pro-max | `.agents/skills/ui-ux-pro-max/` | present; ships Python scripts (`search.py`, `design_system.py`) — not run |
| motion (AI Kit) | `.agents/skills/motion/` | present; `best-practices/`, `css-spring/`, `performance-audit/` |

**impeccable was actually invoked**, which satisfies the brief's requirement
that a skill be *usable*, not merely installed:

```
./.agents/skills/impeccable/scripts/impeccable.cmd context --target components/home/Hero.tsx
→ exit 0, 335 lines
→ RESOLVED_CONTEXT: designPath DESIGN.md, productPath PRODUCT.md,
  hasVisualImplementation true, platform null
```

The launcher resolved the target and loaded the project's own `PRODUCT.md`
and `DESIGN.md` as the governing context, then pointed at
`reference/craft-floor.md` as required reading before UI edits. That file was
read and its checks were applied in the final review (report §5).

**Environment limits on the skills.** The hosted Motion MCP servers remain
unconfigured (`npx motion-ai` needs an interactive TTY), so MotionScore,
the transition editor and spring generation are unavailable. No shipped
effect depends on them — both site animations are plain CSS. The impeccable
skill's own interview step was not run: the brief for this pass explicitly
directs autonomous execution, and the skill instructs that a substitution be
stated rather than silently skipped. Stated here.

**Skill conflicts.** The brief treats the existing spec and verified project
facts as authoritative. The one live conflict —
ui-ux-pro-max's generated `#7C3AED` AI-purple palette and "AI-Native UI"
style — was already rejected during the earlier pass for the reason the brief
names as an anti-reference. It stayed rejected. `DESIGN.md` records the
accepted/rejected split; it was not reopened.

---

## 3. Prioritized problem list

Ranked by user impact × risk × effort, before implementation. Severity is
against the brief's acceptance criteria, not against taste.

### P1 — HIGH · Art direction · the first viewport was held by a fake instrument

**Evidence.** At 1440×900 the hero occupied y 65 → 681. Its right column held
`components/home/SystemBoot.tsx`: a `aria-hidden` block of three animated
*filling progress bars* with the labels `SYSTEM INITIALISING` and
`SYSTEM READY`. The real signature figure (`SignatureVisual`) began at
**y = 786** — 114px of it visible in a 900px viewport, i.e. effectively below
the fold.

Two independent defects:

1. **It asserted a system state that does not exist.** Nothing initialises
   and nothing is running; four progress bars were filling regardless. The
   brief bans fake progress indicators and fake live status outright.
2. **It occupied the most valuable column on the site** while the genuine
   engineering figure sat beneath the fold. The brief requires the hero to
   carry *one distinctive visual composition* and to use the existing
   signature visual where it is effective.

**Also found while reading the same file.** `Hero.tsx` hardcoded the domain
status band (`Motorsport / ACTIVE`, `Simulation / NEAR COMPLETION`, …) with a
comment claiming the states were "taken from the actual project data rather
than asserted". They were not — they were a hand-written `as const` array
that would silently drift the moment any project's status changed.

### P2 — HIGH · Accessibility · 11 interactive targets under the site's own 44px floor

**Evidence.** Measured from `getBoundingClientRect()` on the rendered page at
390px, filtering `a[href]`, `button` and `summary`:

| Control | Rendered height |
|---|---|
| Hero CTA "View Selected Systems" | 36px |
| Hero CTA "Engineering Profile" | 38px |
| Desktop nav items (WORK/EXPERIENCE/ABOUT/CONTACT) | 24px |
| Header GitHub / LinkedIn | 32px |
| Footer GitHub / LinkedIn / email | 32px |
| "View Archive →", "Full Page →" | 16px |
| Case-study "Explore the system ↓" | 42px |
| Case-study "← Back to Systems" / "Back to Systems" | 40px |
| Contact social links | 32px |

`DESIGN.md` states the contract as **"touch targets ≥44px"**, so the two most
important controls on the site missed the project's own bar. Against WCAG 2.2
AA (2.5.8, 24×24 minimum) the 16px standalone links were the real violation;
the rest were contract breaches and genuine tap-difficulty on mobile.

### P3 — MEDIUM · Truthfulness · the header asserted a live system status

**Evidence.** `Header.tsx` rendered a green lamp beside `SYSTEM STATUS:
ONLINE`. No status is transmitted by anything. This is the same
fake-live-status problem as P1 in a second location, and it was the only
nav-adjacent element not required by the brief's own nav list.

### P4 — MEDIUM · Design doctrine · two sections still shipped the banned kicker pattern

**Evidence.** Counting the homepage sections: eight use
`<TechnicalLabel as="h2">` — the label *is* the heading. Two stacked a label
*above* a separate heading:

- `AiMlSection` — label `AI / ML ENGINEERING` above
  `<h2>Models are tools. / Engineering is the objective.</h2>`
- `ContactSection` — label `Contact` above
  `<h1>Let's talk about the engineering.</h1>`

`DESIGN.md` bans this pattern explicitly ("a kicker/eyebrow stacked above the
heading it labels — the single loudest 'AI generated' tell"), and impeccable's
craft floor is stronger still: *"A kicker or eyebrow above a heading. This one
is a ban, not a default: no brief earns it back."* The site was violating its
own constitution in two places.

### P5 — LOW · Accessibility · `<br />` flattened two heading accessible names

**Evidence.** Read from the live accessibility tree:

- Contact h1 → `"Let's talk aboutthe engineering."` (missing space)
- AI/ML h2 → `"Models are tools.Engineering is the objective."`

A `<br />` contributes no whitespace to the text content assistive technology
announces, so both headings rendered visually correctly but were announced as
run-together words.

### P6 — LOW · Craft · browser surfaces left at platform defaults

The site themed `::selection` and `:focus-visible` from its palette but not
the scrollbar or the text caret, so a bright OS scrollbar sat against a
`#0A0B0D` surface and the caret was the platform default. The craft floor
calls these "the cheapest signal that a page was built rather than assembled,
and the one models skip most reliably". The site has a horizontally
scrollable code block, so this is visible in normal use.

---

## 4. What was checked and found **already sound**

Recorded so the report does not re-claim credit for existing work.

- **Seven distinct per-project motifs.** `ProjectInstrument` renders seven
  genuinely different geometries keyed by `visualizationType` (telemetry trace
  / corner geometry + friction circle / stint timeline with pit window /
  management board / feature space / provider convergence / forecast with
  confidence band). The brief's §07 requirement is met; the same abstract
  network diagram is not reused.
- **Heading structure.** One `<h1>` per route, no skipped levels, on all 13
  audited routes (automated) and confirmed by structure on the homepage, `/work`,
  `/contact`, `live-f1-intelligence` and `football-intelligence-os` by hand.
- **No horizontal overflow** at 1440 / 1024 / 768 / 390 / 375 before *and*
  after the changes, measured element-by-element against the viewport with
  `overflow-x: auto` containers correctly excluded.
- **Contrast.** Measured from computed styles on the rendered production
  build: `#B8BBC2` on `#0A0B0D` = **10.24:1**, `#8B8F98` on `#0A0B0D` =
  **6.08:1**, `#F1F2F4` = **17.58:1**. All ≥ 4.5:1 for normal text.
- **SEO surface.** `robots.txt`, `sitemap.xml` (13 URLs), per-route canonical,
  `og:image`, unique title and description, and a real 404 all present and
  correct on the production build.
- **Console.** Clean — no errors, no hydration warnings, no failed requests on
  the production build (dev console shows only the React DevTools notice).
- **Scroll reveal resolves.** All 9 `.reveal` wrappers reach computed
  `opacity: 1` when scrolled into view (`animation-timeline: view()` is
  supported in the test browser). No content is permanently hidden.
- **No fabricated metrics in the changed areas.** The hero figure reads its
  providers and figures from `data/projects.ts`; no number was introduced.

## 5. Risks recorded but deliberately **not** actioned

- **Client JS baseline.** The homepage loads ~191 KB gzip of JS+CSS across 10
  files plus 124 KB of `woff2`, measured by summing the assets referenced in
  the production HTML. Most of that is the Next 16 / React 19 App Router
  runtime, not site code — the site itself has two client files. Removing the
  header's hydration boundary was considered and rejected: `aria-current`
  needs `usePathname()`, and a root layout cannot read the pathname on the
  server in Next 16. Measured, not fixed; documented instead.
- **Raw HTML weight.** 145.8 KB uncompressed for the homepage; the inlined RSC
  flight payload dominates. Not gzipped in that measurement, so it is not
  comparable to a transfer size.
- **`--text-display-xl` clamps to 6.5rem**, above the craft floor's 6rem
  display ceiling. It only reaches that at ~2250px viewport width (72px at
  1440). Left alone rather than churn a fluid type scale for an unreachable
  desktop case.
- **Section numbers (`01`–`09`).** The craft floor questions numbering unless
  the sequence carries information. Here the numbers are the reading position
  in the documented case-study order and match the catalogue position used by
  the project index; removing them would break a deliberate cross-page
  correspondence. Kept by decision.
- **Monospace for section labels.** The craft floor warns against monospace as
  costume. The committed visual world assigns JetBrains Mono to "status,
  metrics, categories, section labels" as one of three documented type roles.
  Kept, because a pinned brief overrides the floor and this is the site's
  established voice.

## 6. Verification limitation — read this before trusting §4

**Pixel-level screenshot QA was not possible in this environment.**
`preview_screenshot` failed on every attempt with *"it produced no frames,
which means the preview webview is not being composited"*, across two
separately created tabs and after an explicit reload.

Every geometry, contrast, target-size, heading and overflow claim in this
audit therefore comes from **DOM measurement in a real Chromium browser**
(`getBoundingClientRect`, `getComputedStyle`), the **accessibility tree**, and
the project's own **live site audit** — not from looking at a picture.

What that means honestly: layout *geometry* is verified (positions, sizes,
overflow, wrapping at five widths). Visual *appearance* — colour harmony,
optical alignment, whether a figure reads well as an image — was **not**
inspected and is not claimed. No screenshots exist from this pass.
