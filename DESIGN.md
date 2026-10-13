# DESIGN — Asish Oliver M Portfolio

The visual constitution. Product truth lives in [PRODUCT.md](./PRODUCT.md).
Token rationale and history: [docs/design-tokens.md](./docs/design-tokens.md).

**Mode: Experience** (Impeccable) — the visitor is inside the work itself.
Let the artefact lead; the interface recedes.

**Design read (Taste v2):** *portfolio for recruiters and engineers, with an
editorial / instrumentation language, leaning toward native CSS + SVG and a
restrained dark palette.* Dials: **DESIGN_VARIANCE 7 · MOTION_INTENSITY 5 ·
VISUAL_DENSITY 5** — variance high enough to avoid a template, motion low
enough that nothing competes with the engineering.

**Tooling hierarchy:** Taste → Impeccable → UI UX Pro Max → Motion →
engineering judgement. No tool overrides performance, accessibility, content
truth or architecture. See [PRD.md §8](./PRD.md#8-tooling-decisions-and-what-was-rejected)
for exactly what was accepted and rejected from each — including the UI UX
Pro Max generated palette (`#7C3AED` AI purple + cyan, "AI-Native UI" with
typing indicators), which is the precise anti-reference this brief names and
was therefore **overridden**. Its pre-delivery checklist was kept.

---

## Palette

Restrained, warm near-black. Not OLED pure-black; not grey-on-grey.

| Role | Token | Value | Used for |
|---|---|---|---|
| Background | `--color-background` | `#0A0B0D` | page base (cool near-black) |
| Surface | `--color-surface` | `#121317` | raised rows, hover fills |
| Foreground | `--color-foreground` | `#F1F2F4` | headings, primary text |
| Muted | `--color-foreground-muted` | `#B8BBC2` | body copy |
| Faint | `--color-foreground-faint` | `#8B8F98` | technical metadata |
| **Accent** | `--color-accent` | `#FF7A18` | **papaya** — hierarchy, CTAs, primary trace |
| Data | `--color-data` | `#47C7E0` | telemetry cyan — **secondary data channel only** |
| Live | `--color-live` | `#3DDC84` | **"running right now" only** |
| Critical | `--color-critical` | `#F0453E` | errors only |

### Why papaya replaced green as the accent

The previous accent was telemetry green, chosen (see `design-tokens.md`) to
match "SYSTEM STATUS: ONLINE". It worked, but it read as *generic dev
terminal* rather than *motorsport engineering* — the exact category the brief
rules out. Papaya is the pit-wall / race-control warning lamp. Green was not
discarded: it was **demoted to a single meaning** (`--color-live`), which is
what stops "active" and "heading emphasis" competing as the same signal.

Measured contrast on `#0A0B0D`: heading `17.58:1`, body `10.24:1`, 12px
metadata `6.08:1` — all above WCAG AA. Accent on background `8.18:1`.

### Colour discipline

Accent communicates **hierarchy**, not decoration. A section is not more
important because it has a coloured label. Cyan never appears as an accent.
Green appears only on live status and the header status lamp.

---

## Typography

Three roles, three different voices. Never one font for everything.

- **Display — Barlow Condensed.** Wordmark, hero name, section titles,
  project titles. Condensed and motorsport-adjacent; `uppercase`,
  `tracking-tight`, `leading-[0.92]`.
- **Body — Inter.** All prose. Neutral, excellent at small sizes, holds up for
  dense case-study text where a condensed sibling would fatigue.
- **Technical — JetBrains Mono.** Status, metrics, categories, coordinates,
  section labels. Uppercase, `tracking-[0.15em]`–`[0.2em]`, `text-xs`.

Scale is fluid via `clamp()` (`--text-display-xl/lg/md`). Body measure stays
~65ch. Metrics use `tabular-nums` so digits don't jitter.

---

## The signature figure

The site's strongest artefact, and the one that had to earn it.

**"Circuit / Speed Profile"** — two channels that share a horizontal axis:

1. **Track map (accent).** An *original* closed circuit, deliberately not a
   real Grand Prix — tracing a real circuit would imply a data source that
   does not exist here. Sector splits S1/S2/S3 sit on the geometry.
2. **Speed profile (cyan)**, directly beneath and x-aligned to the track, so
   fast corners line up with apexes above and straights line up with peaks.

The alignment is the entire point. It is what turns two unrelated squiggles
into one readable chart, and it is why cyan is a data channel rather than a
second accent.

**Truthfulness.** No lap time, speed, delta, tyre or fuel figure appears —
none is measured. The figure is labelled `SCHEMATIC — NOT MEASURED` *on the
canvas*, where it cannot be missed by someone who skips the caption. Sector
labels are structural positions, not timed splits.

**Responsive = two compositions, not one shrunk one.** A single 1200×560
viewBox at 360px renders ~295×138, shrinking the track to an unreadable
thread. So below `md` the track is cropped tight and drawn at a heavier
stroke (measured 295×91); from `md` up the full two-channel figure appears.
Same geometry, different framing.

## Layout

**The grid is a compositional instrument, not a container.**

- `Container` is the *default* width tool, not the only one. The hero domain
  band and the signature visual are allowed to run to the viewport edge.
- **Varied section rhythm.** Vertical padding is *not* uniform — it encodes
  density so the page has a narrative: quiet around the statement
  (`py-24 md:py-36`), dense around systems and arsenal (`py-14 md:py-20`),
  a pause before human sections (`py-20 md:py-28`), and the heaviest spacing
  reserved for contact as closure (`py-20 md:py-32`).
- **Asymmetric hero** — 7/5 split, not a single centred column.
- Hairline `border-border-subtle` rules separate sections; they are
  structure, not decoration.

### Banned

- a kicker/eyebrow stacked above the heading it labels (the single loudest
  "AI generated" tell — see the Phase-2 changes)
- the same card repeated N times; card grids as page structure
- nested cards
- three equal columns everywhere
- **two adjacent sections sharing the same grid geometry.** `EngineeringDomains`
  is an editorial two-column spec table with hairline-separated rows;
  `TechnicalArsenal` is a four-column numbered index with per-item rules.
  They were previously the identical `lg:grid-cols-3` block, twice on one
  screen — repeated structure is louder than any single bad choice.
- identical section geometry repeated down the page

---

## Motion

Purposeful, mechanical, controlled. Motion communicates hierarchy,
continuity, system state and depth — never to prove the site can animate.

**Preferred stack: CSS first.** No animation library is currently installed,
and none is justified: the one scroll effect is plain CSS and degrades by
construction.

| Effect | Implementation | Notes |
|---|---|---|
| Section reveal | CSS `animation-timeline: view()` | scroll-driven, no JS, no hydration |
| Hover / focus | `transition-colors` / `transform` | 150ms |

**The boot readout is gone.** Its keyframes were removed along with
`SystemBoot.tsx` in the final experience pass. It was four animated
*progress bars* claiming a system was initialising — a fake progress
indicator, which this design language bans — and it held the hero's focal
column while the real signature figure sat below the fold. The hero's right
column now carries an information-bearing figure instead. See
[FINAL_EXPERIENCE_REPORT.md](./docs/FINAL_EXPERIENCE_REPORT.md).

Rules: transform + opacity only (compositor-friendly). Never `top/left/
width/height` animation. No bounce, elastic, floating loops, or attention
loops. One authored moment beats ten scattered ones.

**Rejected from the Motion skill's own guidance:** the `back.out(1.4)` stagger
preset. Its own note says the overshoot reads as sloppy on dense
informational UI — which is most of this site — and the brief bans bounce
outright. Exponential ease-out from an already-visible default is used
instead.

**Motion+ / MCP note.** The hosted Motion MCP servers were not configured
(`npx motion-ai` requires an interactive TTY). That gates the transition
editor, MotionScore audits and spring generation. **None of it is required**:
both effects here are plain CSS and degrade correctly. Premium features are
explicitly not depended upon.

**Reduced motion:** honoured at two levels — the global CSS override and
component-level opt-in. The `.reveal` animation exists only inside
`@supports (animation-timeline: view())` *and* `@media
(prefers-reduced-motion: no-preference)`, so under `reduce` the selector is
never applied and content renders in its final visible state rather than
being hidden pending an animation that will not run.

---

## Accessibility contract

WCAG 2.2 AA. Every visual enhancement has a content equivalent.

- exactly one `<h1>` per page; no skipped heading levels
- skip-to-content link first in tab order
- `:focus-visible` ring: 2px solid `--color-accent`, 2px offset — never
  removed without replacement
- decorative SVG `aria-hidden`; meaningful SVG `role="img"` + `aria-label`
- all external links `rel="noopener noreferrer"`
- touch targets ≥44px

---

## Anti-pattern bans

Never ship: gradient text · glassmorphism as decoration · coloured
side-border accents on cards · hard offset shadows · sparklines or progress
rings standing in for content · monospace as costume · emoji as icons ·
AI-purple gradients · glowing blobs · fake terminals · meaningless stats ·
uniform section spacing · a kicker above every heading.

---

## Files

- Tokens: `app/globals.css` (primitive → semantic → component)
- Signature figure: `components/home/SignatureVisual.tsx`
- Architecture diagram: `components/work/ArchitecturePipeline.tsx`
- `Reveal` — `components/ui/Reveal.tsx`
- Audits: [docs/godlevel-audit.md](./docs/godlevel-audit.md),
  [docs/design-system-audit.md](./docs/design-system-audit.md)

## Verification gate

Nothing here is asserted from reading the source. Every claim was measured
against a running server: contrast from computed styles, heading structure
from rendered HTML across eight routes, figure dimensions and channel
presence from the live DOM, overflow at 360/390/1440, focus rings from real
keyboard input. `npm run verify` gates types, lint, tests and build.