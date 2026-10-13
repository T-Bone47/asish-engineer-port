# Motion System Audit

**Scope.** What motion infrastructure existed in this repository before the
"Engineering in Motion" pass, what was already implemented, what was
unfinished, and what the constraints on any new motion layer are. Measured
against a running production build, not read off the source.

Produced before any file was modified. Companion document:
[MOTION_SYSTEM_IMPLEMENTATION_REPORT.md](./MOTION_SYSTEM_IMPLEMENTATION_REPORT.md).

---

## 1. Animation libraries present

| Question | Finding |
|---|---|
| Runtime dependencies | `next`, `react`, `react-dom`. **Nothing else.** |
| `gsap` / `ScrollTrigger` | Not installed. Removed in an earlier pass. |
| `lenis` | Not installed. Removed. |
| `motion` / `framer-motion` | Not installed. Never was. |
| `three` / `@react-three/fiber` / `drei` | Not installed. Removed. |
| Animation code in the repository | One CSS class (`.reveal`) and its component. |

Verified from `package.json`, from `node_modules` on disk, and by grepping the
source tree for imports. The brief's instruction — *"do not assume that a
library is installed just because it appears in an earlier specification"* —
is answered: none is.

### The local motion skill

`.agents/skills/motion/` **is** present, with its `best-practices/` tree
(`react.md`, `performance.md`, and the rest) installed from the official
`motiondivision/ai-kit`. It was read in full before this pass.

What it contributes: the `motion/react` API surface, the transform-vs-layout
rule, the "no overshoot on dense data UI" rule, and the reduced-motion
patterns. What it cannot contribute here: the library itself. Motion for React
animates **client** components, and PRD TR3 caps this project at two client
files with everything else server-rendered. Its MCP tiers (docs search,
MotionScore, spring generation) are unconfigured in this environment.

**Conclusion: the skill is installed, the library is not, and nothing in this
pass needs either.** All nine project motifs, the signature trace, the scroll
reveals, the diagram connectors, the page headers and the reading indicator are
expressible in CSS with transforms, opacity and stroke offset. Where the skill's
advice conflicts with this codebase's architecture (Motion needs client
components; TR3 allows two), the codebase's architecture wins — the skill says
so itself: no tool may override performance, accessibility or architecture.

## 2. What was already implemented

| Surface | State before this pass |
|---|---|
| Section reveals (`components/ui/Reveal.tsx`, `.reveal`) | **Working and correct.** CSS `animation-timeline: view()`, gated behind `@supports` + `prefers-reduced-motion: no-preference`, no client JS. Left alone. |
| Hero entrance | None. Hero rendered fully static. |
| Signature visual (`SignatureVisual.tsx`) | Static SVG. Track map, speed profile, sector markers, registration marks all present; nothing moved. |
| Project instruments (9) | Static SVG, one shared geometry module. |
| Architecture / intelligence diagrams | Static. Nodes and connectors drawn, no entrance. |
| Header active-route indicator | `transition-[width,opacity] duration-300` — **animating `width`**, a layout property, on every nav render. |
| Header utility links (GitHub / LinkedIn) | Colour transition only. |
| Project index rows | `transition-colors`, no accent trace. Hover and keyboard both worked; neither was visually expressed. |
| Buttons | `transition-colors duration-150`. |
| Mobile menu + disclosure caret | `transition-transform duration-200`, default easing. |
| Reading progress | Did not exist. |
| Motion tokens / design system | Did not exist. Durations were written literally in **five** components. |
| Motion tests | None. Nothing prevented a component from inventing a timing value. |

## 3. Baseline measurements

Captured against a production build (`next start`) with Playwright/Chromium, 14
routes × 6 viewport widths = **84 loads**. Full data:
`motion-baseline/metrics.json`.

| Width | FCP (avg) | LCP (avg) | max CLS | JS (avg) | Long tasks / load |
|---|---|---|---|---|---|
| 1440 | 242 ms | 242 ms | 0 | 136 KB | 3 (`~18 ms`) |
| 1280 | 191 ms | 191 ms | 0 | 136 KB | 4 (`~20 ms`) |
| 1024 | 179 ms | 179 ms | 0 | 136 KB | 3 (`~14 ms`) |
| 768 | 173 ms | 173 ms | 0 | 136 KB | 4 (`~23 ms`) |
| 390 | 163 ms | 163 ms | 0 | 136 KB | 2 (`~13 ms`) |
| 375 | 170 ms | 170 ms | 0 | 136 KB | 3 (`~18 ms`) |

- **84/84 loads: no horizontal overflow, no console error, CLS 0.**
- Reduced motion (4 routes, 463 sampled elements): **0 hidden, 0 animating.**
- Distinct animations running on the homepage at 1440: `["reveal-rise"]`, 9
  elements. That was the entire motion layer of the site.
- FCP = LCP on every route: the H1 is the largest paint and there is no
  deferred content in front of it. Any new entrance had to preserve that.

## 4. What needed work

1. **No signature moment.** The homepage's most distinctive element — the
   circuit/speed-profile figure — did not draw. Nothing about the site was
   memorable in motion.
2. **A layout-property transition in the header.** `width` on the nav rule.
3. **No shared timing language.** Five components each wrote their own
   duration; no easing token anywhere.
4. **Diagrams explained nothing through motion.** Nodes and connectors were
   correct but arrived as one static slab.
5. **No reading orientation on long case studies**, which run 7,000–8,600 px
   tall at 1440.
6. **Nine projects, one visual treatment.** The motifs were already distinct
   *drawn*; nothing sequenced them.

## 5. Hard constraints any implementation must honour

These are the reasons the answers above are CSS rather than a library, and they
are not negotiable in this repository:

| Constraint | Source | Consequence for motion |
|---|---|---|
| `npm run verify` = typecheck + lint + test + build, all green | PRD TR1 | A motion change that breaks any gate is not an option. |
| No unused dependencies | PRD TR2 | Adding a library needs a demonstrated need. |
| Server Components by default; minimal client JS | PRD TR3 | Motion cannot add a client boundary. |
| **Content renders without JavaScript** | PRD TR4 | The hidden state of any animation must be *unreachable* by default, not merely survivable. |
| Reduced motion honoured at component and global level | PRD TR5 | Every animation gated, verified in a real browser. |
| Animations compositor-only (transform / opacity) | PRD TR6 | `width`, `height`, `filter`, `box-shadow` are out unless justified and measured. |
| No animation library unless justified | PRD §8 | GSAP/Lenis/Motion stay uninstalled. |
| No bounce / elastic / overshoot | PRD §8 (UI UX Pro Max check, style catalogue) | One exponential ease-out family. |
| No invented data in any visual | PRODUCT.md content-truth policy | A telemetry figure may be a schematic. It may not be labelled as live. |
| Content must not shift (CLS 0 in the baseline) | Measured above | Nothing may change a box after paint. |

## 6. Browser support picture

- `animation-timeline: view()` and `scroll()`: supported in the Chromium and
  WebKit versions available here; **not** in a browser without scroll-driven
  animations, where the `@supports` blocks are simply dropped.
- That failure mode was tested directly, by serving the stylesheets with every
  `@supports (animation-timeline …)` block removed — exactly what an
  unsupporting engine computes. See §7 of the implementation report.
- No JavaScript fallback exists or is needed: there is no JavaScript.

## 7. Audit conclusion

The site needed a **motion system**, not an animation library: one token layer,
a small set of named CSS primitives built on transform/opacity/stroke-offset,
one authored moment (the signature trace), nine motifs sequenced from a single
rule, and a test that fails the build if any of that is bypassed. The existing
`.reveal` mechanism was already the correct pattern and became the template for
the rest rather than being replaced.
