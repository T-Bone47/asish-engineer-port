# Final Portfolio Report — Asish Oliver M Portfolio

Final report for the master prompt **FINAL PORTFOLIO POLISH, SIGNATURE MOTION & RECRUITER EXPERIENCE**.

What was done, what was already done, what was verified, and what was deliberately not done. Findings and severity ranking live in [FINAL_PORTFOLIO_AUDIT.md](./FINAL_PORTFOLIO_AUDIT.md).

---

## 1. What this turn actually produced

This turn's job was **Phase 9 — final report**, plus a re-verification that the Phase 5 motion work the brief asked for was actually present rather than assumed.

Two files were created:

- [`docs/FINAL_PORTFOLIO_AUDIT.md`](./FINAL_PORTFOLIO_AUDIT.md) — audit record: what was checked, how, the prompt-to-reality mapping, verification evidence, remaining limitations.
- [`docs/FINAL_PORTFOLIO_REPORT.md`](./FINAL_PORTFOLIO_REPORT.md) — this file: what was done, what was already done, what was verified, what was deliberately not done.

No source file, component, route, data file, or test was edited in this turn. The only motion artifact the user's request named — the Vitest Chromium-assisted reduced-motion test — **already existed** in the repo at `lib/reduced-motion.test.ts`, and was re-run this turn to confirm it still passes against the current tree.

---

## 2. What was already done before this turn (not claimed as new)

The brief's Phase 2–5 deliverables were implemented in earlier work and are present in the repo. This turn read the source and the running site to confirm that, and recorded it honestly in the audit rather than re-implementing what already works.

### 2.1 Homepage refinement (Phase 2)

The homepage is `app/page.tsx`. Its structure is already the brief's intent:

- Two-column hero (`components/home/Hero.tsx`): asymmetric 7/5 split; identity column on the left, instrumentation column on the right.
- The right column carries `HeroInstrument` — the flagship's real four-provider convergence figure with the flagship's own two verified metrics printed beneath it and a direct link into that case study. This replaced the old fake boot readout.
- Domain status band derived from `data/projects.ts` via `getProjectBySlug` — not a hand-written array.
- Below the hero: `SignatureVisual` (the authored motion moment), then scroll-reveal sections in a deliberate non-uniform rhythm.

**Telemetry-trace animation: already working.** `SignatureVisual` (`components/home/SignatureVisual.tsx`) is the site's authored moment: the circuit track draws across the full width in six ordered scroll-driven windows, the speed profile draws beneath it, sector markers ride the trace, and three sector markers breathe as the ambient resting state. The paths carry `pathLength="1000"`, so no length is measured in JS — there is no JS here at all. The hero identity text is the separate time-driven `.seq` sequence. The figure is labelled `SCHEMATIC — NOT MEASURED` on the canvas. No fake telemetry, no counting-up, no live claim.

### 2.2 Project discovery (Phase 3)

`data/projects.ts` holds nine projects. Each is on its own route and its own SSG build output. The project index (`components/work/ProjectIndex.tsx` + `ProjectIndexRow.tsx`) carries number, title, tagline, status, one-sentence hook, up to seven tech chips, one evidence item, and a "View Case Study →" action. The row's hover/focus language — `.rule-expand` hairline, arrow step, project motif drawn in a fixed 96×28 rail — is the same for pointer and keyboard. No fabricated metrics: every figure is read from `data/projects.ts`.

### 2.3 Case-study presentation (Phase 4)

`app/work/[slug]/page.tsx` already implements the brief's spine and progressive disclosure:

- Hero: number · status · tagline · year · title · thesis · 2–4 chips · one evidence item · two actions.
- 30-second read: Overview (`BriefGrid`), Problem, System (architecture summary + optional version wall + `ArchitecturePipeline`), Data Flow (`IntelligencePipeline`), Engineering (trade-offs as Problem/Decision/Result + engineering-decision list), Evidence (validation prose + test-run summary + `ValidationMatrix` + legend + results), Current State, Limitations, Next, Technologies, Links.
- Appendix as a native `<details>` "Technical Detail" panel, closed by default, no client JS — only the blocks the project actually has render; an empty appendix is not advertised.
- Reading progress: `reading-progress` 1px accent bar, `scroll(root block)` timeline, `aria-hidden` because it is orientation not content.

### 2.4 Meaningful motion (Phase 5)

All three layers are already present and CSS-only, with no animation library installed (only `next`, `react`, `react-dom` at runtime):

1. **Hero telemetry** — the signature trace above.
2. **Project interactions** — project rows: `.rule-expand` hairline on hover **and** focus-visible, arrow step, motif draw; buttons: colour/border + 1px active press; header nav indicator: `scale-x` from `origin-left` (the old `width` transition was removed by the motion pass); utility links: same hairline as a pseudo-element.
3. **Architecture diagrams** — `.diagram-node` nodes arrive in order, `.diagram-connector-y` / `.diagram-connector-x` connector rules scale from their origin, then the figure holds static.

Motion vocabulary on the homepage: `reveal-rise`, `seq-rise`, `trace-draw` / `trace-fade`, `ambient-breathe`. That is the whole vocabulary.

Every animation is gated behind `@supports (animation-timeline: view())` **and** `@media (prefers-reduced-motion: no-preference)`. Outside those blocks the selectors do not match and the element renders in its final visible state.

### 2.5 Visual evidence (Phase 6)

- Where a project has a `visualizationType`, it gets its own SVG motif on the case-study hero and as the row hover/focus preview, labelled "illustrative schematic".
- The signature figure is the honest schematic — no lap time, speed, delta, tyre or fuel number; the canvas says `SCHEMATIC — NOT MEASURED`.
- The hero instrument is the honest convergence schematic built from the flagship's own provider list and verified metrics.
- No project screenshots exist in the repo. **This is a real remaining gap the owner must close; the site's fallback — a clearly labelled schematic — is what the brief explicitly permits.**

### 2.6 Experience and navigation (Phase 7)

Experience timeline present. Header active-route indicator present (`aria-current="page"`). Link feedback, focus states, contact links, mobile navigation present. Sections that already worked well were not given animation.

---

## 3. What was verified this turn

### 3.1 The requested reduced-motion test

`lib/reduced-motion.test.ts` — the exact test the user asked for — re-run this turn, in isolation:

- Starts `next start` on an ephemeral port (3456), drives it with Playwright/Chromium.
- Loads the homepage at 1440×900.
- Emulates `prefers-reduced-motion: reduce`.
- Asserts three invariants:
  1. signature circuit track `stroke-dashoffset === "0px"` (fully drawn, static, not mid-draw);
  2. `.instrument-row::after` `content === "none"` (motif mask absent, motif shown as static figure);
  3. "Read this figure as text" disclosure is present.
- Cleans up browser + server in a `finally`; 45s timeout; fails fast with a clear message if Chromium cannot launch; skips rather than breaks the suite when Playwright is absent.

Result this turn: **passed** — `✓ lib/reduced-motion.test.ts (1 test) 3586ms`.

That is the live complement to the CSS gate in `lib/motion.test.ts` (which asserts the stylesheet form: no `animation` outside the reduced-motion opt-in; every scroll-driven timeline inside `@supports (animation-timeline: …)`). The CSS gate proves the rule exists; this test proves the composed page computes the right values under the emulated preference.

### 3.2 The full gate

`npm run verify` this turn — typecheck + lint + test + build — **exit 0**.

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run test` — reduced-motion test passed this turn; the full suite's other files are unchanged and were not re-run in isolation (the gate covered them, and the only file touched this turn is a new report doc).
- `npm run build` — pass, 29 routes (11 static, 18 SSG across `/work/[slug]` and `/work/[slug]/opengraph-image`).

### 3.3 Live inspection

The running production server was inspected through the shared browser this turn:

- Homepage: real DOM and accessibility tree — header/nav/main/footer landmarks, skip link first in tab order, both CTAs, domain status band derived from project data, signature figure present with its disclosure.
- Live F1 Intelligence case study: full accessibility tree read — one `h1`, correct heading order through the section labels, the 9-stage architecture figure rendered with figure number and caption, the evidence figure, the disclosure, the case-study navigation, the contact links.

### 3.4 What was NOT re-measured this turn

The full 6-width × many-route sweep (84 loads) was performed in the prior motion pass and was not repeated here because the only files touched this turn are two new report docs. It is carried forward: 0 horizontal overflow, 0 console errors, CLS 0 at every width, 0 targets under 44px at the widths measured, heading order correct throughout, reduced-motion measured at 4 routes / 463 elements: 0 hidden, 0 animating.

---

## 4. What was deliberately not done

1. **No animation library was added.** The brief says use existing dependencies and not add overlapping frameworks unnecessarily. There is no framework at all; motion is CSS-only. Adding one would violate TR2 (no unused dependencies) and TR3 (server components by default) for an effect that is already expressible in CSS.
2. **No re-implementation of the motion pass.** The signature trace, project micro-interactions, diagram reveals, token layer, reduced-motion gate and live test all already exist. Re-implementing them would churn the working tree for no user-facing change.
3. **No fabricated project media.** No screenshots, simulator plots, or application screenshots were invented. The site uses labelled SVG instruments and a labelled schematic. Real media, when supplied by the owner, would replace the schematic.
4. **No per-project card redesign was forced.** The index is one consistent scanning surface; the per-project visual differentiation lives in the SVG motif and the case-study hero instrument, which is the correct trade against the brief's own constraint.
5. **No weakening of the validation gate.** `lib/motion.test.ts` and `lib/reduced-motion.test.ts` both remain present and green. The gate was not touched or relaxed.
6. **No attempt to fake a performance benchmark.** No LCP/CLS/INP measured this turn; none exists from any prior pass; no field data. The brief's performance targets are not claimed as met.

---

## 5. Honest remaining limitations

1. **No project screenshots or captured diagrams exist.** The site uses labelled SVG instruments and a labelled schematic signature figure. That is the correct fallback when authentic media has not been supplied; it is not the same as having real media. The owner is the only source for real media.
2. **No runtime performance timing.** No LCP/CLS/INP measured; none exists from any prior pass; no field data. The brief's performance targets are not claimed as met.
3. **Visual/optical QA by eye was not possible in this environment.** The preview webview does not composite images, so every visual claim comes from DOM geometry and computed styles, not from looking at a picture.
4. **Project depth is gated by the project data the owner supplies.** The template can render thesis, trade-offs, limitations, next iteration, provider matrix, capability registry, full test runs and data lineage; whether a given case study shows them depends on `data/projects.ts`. The remaining work is content, not code.

---

## 6. Closing statement

The master prompt's Phase 2–7 motion and presentation work was already implemented and integrated into the gate before this turn. This turn confirmed that by reading the source and the running site, re-ran the exact reduced-motion browser test the user's request named (it passes), re-ran the full gate (exit 0, 29 routes), and inspected the homepage and one case study live.

Phase 9's two deliverables — `docs/FINAL_PORTFOLIO_AUDIT.md` and `docs/FINAL_PORTFOLIO_REPORT.md` — are new in this turn.

Work stops at the criteria. Nothing further was added.
