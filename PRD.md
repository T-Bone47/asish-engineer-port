# PRD — Asish Oliver M Portfolio

**Product Requirements Document · v1.0**

Supersedes the earlier framing in `PRODUCT.md` (product truth) and `DESIGN.md`
(visual constitution). This document is the *why* and the *what must be
true when finished*. Design specifics live in [DESIGN.md](./DESIGN.md);
audit evidence lives in [docs/](./docs/).

---

## 1. Product summary

A personal engineering portfolio for **Asish Oliver M** — Motorsport Software
Engineer · AI/ML Engineer — whose purpose is to convert a sceptical technical
reader into someone who believes, in under ninety seconds, that this person
builds real, validated systems and can be contacted.

**Not** a design showcase. **Not** an AI-effects demo. The interface is
evidence of engineering taste, not the subject of the page.

## 2. Goals and success signals

| # | Goal | How we know it worked | How it is measured |
|---|---|---|---|
| G1 | Immediate identity | First screen answers who/what | H1 + role visible without scroll at 390 and 1440 |
| G2 | Recruiter fast path | Projects, experience, contact ≤ 2 clicks from any route | Header nav + inline CTAs; no route dead-ends |
| G3 | Technical credibility | Evidence, not adjectives | Verified metrics render; limitations visible |
| G4 | Truth | No fabricated claim anywhere | `data/projects.test.ts` invariants + content policy |
| G5 | Distinctiveness | Not templated | Anti-pattern detector + design variance rules |
| G6 | Performance | Fast on real devices | LCP < 2.5 s, CLS < 0.1, INP < 200 ms |
| G7 | Accessibility | Usable by everyone | WCAG 2.2 AA; keyboard, focus, reduced motion |
| G8 | Maintainability | Next person can change it | Typed, lint-gated, tested, documented |

## 3. Audience (priority order)

1. **Engineering recruiters** — need projects, evidence, contact. Fastest path.
2. **Motorsport / race engineers** — need domain rigour and credibility.
3. **Software & AI/ML engineers** — need architecture, validation, trade-offs.
4. **Technical collaborators / hiring managers** — need scope and honesty.

## 4. Content truth policy (hard requirement)

The portfolio's credibility depends on truth. **Never invent** metrics, test
results, experience, employers, technologies, users, clients, social proof, or
academic scores of any kind (no CGPA, grades, marks, semesters).

Unknowns are `TODO(owner)` comments in `data/projects.ts`, never rendered.
Synthetic or illustrative visuals must be visibly labelled as such.

**Currently verified evidence — Live F1 Intelligence only:**
1,067,193 canonical events · 0 malformed records · ~2,650 events/s ·
~0.10 ms p50/event · 99 MB peak memory · 50-test suite against real fixtures.

## 5. Functional requirements

| ID | Requirement | Status |
|---|---|---|
| FR1 | Routes `/`, `/work`, `/work/[slug]`, `/experience`, `/about`, `/contact`, 404 | ✅ |
| FR2 | Case-study system renders sections only where real content exists | ✅ |
| FR3 | Single source of truth in `data/`, typed, validated | ✅ |
| FR4 | GitHub / LinkedIn / email links from one data source, conditionally rendered | ✅ |
| FR5 | Explicit content states (ACTIVE · NEAR COMPLETION · IN DEVELOPMENT · …) | ✅ |
| FR6 | Every route has unique metadata, canonical, OG image | ✅ |
| FR7 | `robots.txt` + `sitemap.xml` generated from route and project data | ✅ |
| FR8 | Recruiter fast path from every route | ✅ |
| FR9 | Project index conveys depth through layout, never a rating score | ✅ |

## 6. Design requirements

| ID | Requirement |
|---|---|
| DR1 | Identity legible in the first viewport at every breakpoint |
| DR2 | Accent communicates **hierarchy**, never decoration |
| DR3 | No repeated section geometry; deliberate rhythm variation |
| DR4 | Three distinct type roles; no single-font sites |
| DR5 | Engineering diagrams encode real information — every node means something |
| DR6 | Signature visual is purposeful, not a decorative squiggle |
| DR7 | Every visual enhancement has a content equivalent |
| DR8 | Banned: gradient text, glassmorphism, nested cards, side-tab accents, emoji icons, kicker-above-every-heading, uniform spacing |

## 7. Technical requirements

| ID | Requirement | Status |
|---|---|---|
| TR1 | `npm run verify` = typecheck + lint + test + build, all passing | ✅ |
| TR2 | No unused dependencies | ✅ (5 removed) |
| TR3 | Server Components by default; minimal client JS | ✅ (2 client files) |
| TR4 | Content renders without JavaScript | ✅ |
| TR5 | Reduced motion honoured at component and global level | ✅ |
| TR6 | Animations compositor-only (transform / opacity) | ✅ |
| TR7 | Strict TypeScript, no `any`, no suppression | ✅ |
| TR8 | No secrets; no PII beyond published contact details | ✅ |

## 8. Tooling decisions (and what was rejected)

Tooling order: **Taste → Impeccable → UI UX Pro Max → Motion → engineering
judgement.** No tool may override performance, accessibility, content truth or
architecture.

### Accepted from UI UX Pro Max
- Pre-delivery checklist: no emoji as icons, 150–300 ms hover, 4.5:1 contrast,
  visible keyboard focus, reduced motion, responsive at 375/768/1024/1440.
- `editorial-grid-magazine` style (`risk:low`, `cost:low`) — asymmetric grid,
  editorial typography, reveal-on-scroll. Confirms the chosen direction.
- "Don't use `back.out` on dense data tables" — overshoot reads as sloppy on
  informational UI.

### Rejected from UI UX Pro Max (with reasons)
| Generated output | Why rejected |
|---|---|
| Primary `#7C3AED` (AI purple) + cyan | The brief names "purple gradient AI site" as an explicit anti-reference |
| Style "AI-Native UI" | Typing indicators / streaming text / chatbot chrome — a conversational-product idiom, wrong for an engineering archive |
| Inter-only typography | Brief requires three distinct type roles |
| `back.out(1.4)` stagger | Brief bans bounce/elastic; overshoot is not "mechanical, precise" |
| `hud-sci-fi-fui` style | Catalog marks it `risk:high` accessibility; brief bans sci-fi HUD |

The generator is an **intelligence layer, not the design owner**. Its palette
was overridden; its checklist was kept. This is the correct division.

### Motion decision
`npx motion-ai` requires an interactive TTY; the skill and its
`best-practices/` content were installed directly from the official
`motiondivision/ai-kit` package (source of the kit, per motion.dev). Only the
hosted MCP servers are unconfigured, which gates Motion+ features
(transition editor, MotionScore, spring generation). **No premium feature is
required**: the two effects the site needs are done in plain CSS.

**No animation library is justified.** The motion layer of this site is CSS and
only CSS: one token layer (durations, easings, distances, stagger) plus named
primitives in `app/globals.css`, applied as classes on server components. The
first-load JS figure is unchanged at 136 KB and no client boundary was added for
motion. GSAP/Lenis/Motion remain uninstalled by decision, not by omission.

The contract that makes TR4 and TR5 true by construction: **the hidden state of
every animation exists only inside
`@media (prefers-reduced-motion: no-preference)`, and every scroll-driven one
additionally inside `@supports (animation-timeline: view())`.** Outside those
blocks the selectors do not match and the element renders in its final, visible
state — so reduced-motion readers get static content, browsers without
scroll-driven animations get static content, and a browser with neither gets
both. `lib/motion.test.ts` enforces it in the build: it fails if any
`animation` declaration escapes the gates, if a component hardcodes a duration or
easing of its own, if a motion token is defined but unused, or if a keyframe is
dead. The first version of that test caught a real gap during implementation —
the diagram rules had the reduced-motion gate but not the `@supports` one — and
the fix is in the shipped CSS.

The boot readout's keyframes were removed in the final experience pass along with
`SystemBoot.tsx` — it was a fake progress indicator, not motion that served
comprehension. What replaced it and what it costs is documented in
[MOTION_SYSTEM_IMPLEMENTATION_REPORT.md](./docs/MOTION_SYSTEM_IMPLEMENTATION_REPORT.md);
the state before that pass is in
[MOTION_SYSTEM_AUDIT.md](./docs/MOTION_SYSTEM_AUDIT.md).

## 9. Acceptance criteria

- [x] One meaningful `<h1>` per route; no skipped heading levels
- [x] Skip-to-content first in tab order; visible focus on every focusable
- [x] Contrast ≥ 4.5:1 body, ≥ 3:1 large (measured: 17.58 / 10.24 / 6.08)
- [x] Reduced motion honoured; content visible without JS
- [x] All eight projects represented accurately; evidence and limits visible
- [x] `npm run verify` green; no unused dependencies
- [x] Unique metadata + canonical + OG image per route
- [x] robots.txt, sitemap.xml, icon, social preview present
- [x] No invented content anywhere

## 10. Out of scope (deliberate)

- **WebGL / Three.js** — declined. The SVG signature visual is expressive;
  the brief forbids a 3D homepage "just because WebGL is available".
- **Lenis smooth scroll** — native scroll is not measurably insufficient.
- **Command palette** — no search surface large enough to justify one.
- **GitHub project links per project** — owner has not supplied them; inventing
  URLs is forbidden.

## 11. Known gaps (owner input required)

Repo/demo/documentation links for all eight projects; technologies for
F1 Lap-Time Simulator and EA FC Intelligence; year + status for
EA FC Intelligence / VyaparPulse; real project media; `NEXT_PUBLIC_SITE_URL`
at deploy time.