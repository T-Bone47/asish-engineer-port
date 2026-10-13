# Design System Audit — Asish Oliver M Portfolio

Challenge against [PRODUCT.md](../PRODUCT.md) and [DESIGN.md](../DESIGN.md).
Recommendations were accepted only where they improved this specific
portfolio; generated suggestions that conflicted with the existing identity
were rejected on purpose.

---

## Typography

| Check | Result |
|---|---|
| Distinct roles | **Pass** — Barlow Condensed / Inter / JetBrains Mono, three genuinely different voices |
| Display ceiling ≤ 6rem | **Pass** — `--text-display-xl` clamps to 6.5rem; measured 78px at 1440 |
| Body measure 65–75ch | **Pass** — measured 570px at 18px ≈ 63ch |
| Tabular numerals on metrics | **Pass** |
| Obvious scale/weight steps | **Pass** |

No change needed. The original pairing rationale holds; only the accent and
the *use* of the display face changed.

## Colour

| Check | Result |
|---|---|
| Body text ≥ 4.5:1 | **Pass** — measured 10.24:1 |
| 12px metadata ≥ 4.5:1 | **Pass** — measured 6.08:1 |
| Accent used for hierarchy, not decoration | **Fixed** — accent was on every section label; now reserved for CTAs, active states and the primary trace |
| Accent not colliding with "active" | **Fixed** — green demoted to `--color-live` |
| Error colour distinct from both | **Pass** — `#F0453E` vs accent vs live |

## Spacing

| Check | Result |
|---|---|
| Uniform vertical rhythm | **Fixed** — was `py-16 md:py-20` on nine sections; now density-encoded (14→36 range) |
| More space above a heading than below | **Pass** |
| Tight groups / generous separation | **Pass** |

## Components

| Component | Finding | Action |
|---|---|---|
| `Button` | Sound. Two variants, external-link aware. | Kept |
| `StatusBadge` | Only "active" was coloured, correctly. | Recoloured to `--color-live` |
| `TechnicalLabel` | **Was the site's most repeated anti-pattern** — stacked above nearly every heading. | Section-level instances promoted to real `h2` headings; decorative ones removed from the hero and interior page headers |
| `Container` | Honest, deliberately plain. | Kept; now one tool among several rather than universal |
| `FlowSteps` | Fine. | Kept |
| `Reveal` | Client component shipping `opacity-0` in SSR HTML. | Rewritten as CSS scroll-driven server component |
| `MetricGrid` | Good — real values only. | Kept |
| `ArchitecturePipeline` | Adequate. | Kept |
| `Header` | Correct conditional rendering. | Kept |
| `Footer` | Minimal. | Added technical signature linking the source repo |

## Anti-pattern detector

`impeccable detect --json app components` → **2 warnings**, both in
`app/opengraph-image.tsx`, both false positives: neutral `#2B2E35` 3px corner
crop marks being pattern-matched as coloured side-tabs. Zero findings across
`app/` and `components/` proper.

## Responsive verification

Measured at 1440 and 390 in a real browser.

| Check | 1440 | 390 |
|---|---|---|
| Horizontal overflow | 0 | 0 |
| Elements exceeding viewport | none | none |
| H1 fits | yes (570.66px in a 7-col span) | yes |
| Nav | inline | hamburger, 44×44 target |

## Accessibility verification

| Check | Result |
|---|---|
| Exactly one `<h1>` per route | **Pass** (8/8 routes; `/contact` fixed) |
| Heading level order | **Pass** (fixed h1→h3 skips) |
| Landmarks | **Pass** — header, nav, main, footer on every route |
| Skip to content | **Pass** — first tab stop |
| Focus ring | **Pass** — solid 1.6px accent, verified on 8 focusables |
| Images missing `alt` | 0 |
| `target="_blank"` without `noopener` | 0 |
| Reduced motion | **Pass** — CSS gates both reveals and boot readout |

## Rejected recommendations

- **A second accent for more "energy".** The brief bans decoration; one
  accent plus a data channel plus a reserved status colour is already the
  ceiling.
- **Card-based project grid.** Would have replaced the strongest asset — a
  typographic archive that scales and reads well — with the exact pattern the
  anti-slop rules name.
- **Smooth scrolling (Lenis).** Nothing indicated the native scroll was
  insufficient; it would have added a dependency and degraded keyboard and
  reduced-motion behaviour for no measured gain.
- **GSAP / ScrollTrigger / Motion.** The two effects that were actually
  wanted are now done in ~20 lines of CSS with better degradation than any
  library would provide.
- **WebGL / Three.js.** See the WebGL decision in the audit.

## Remaining known gaps

- Two projects (`ea-fc-intelligence`, `vyaparpulse`) have empty
  `technologies` and a `"TBD"` year, so they render thinner than the
  flagships. This is deliberate honesty pending owner input, not a defect.
- `NEXT_PUBLIC_SITE_URL` must be set at deploy time, or canonical URLs and
  the sitemap resolve to `http://localhost:3000`.