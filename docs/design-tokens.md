# Design Tokens — Rationale

This spec (§8–9) intentionally leaves two decisions open: which single
accent color, and which three typefaces. Both are chosen here — flagged,
not silent, per §73 of the spec ("Claude must not make major
architectural decisions silently"). Swap any of it if it's not right.

## How this was decided

Ran the `ui-ux-pro-max` design-system search against this brief first.
Worth recording honestly: the top aggregate matches were off-target —
one returned a light-mode luxury-fashion "Liquid Glass" system (gold
accent, serif display face), the closest `style`-domain matches were
`hud-sci-fi-fui` and `cyberpunk-ui` (neon cyan/magenta, "iron man,
sci-fi" — precisely what spec §7 says to avoid). A catalog tuned for
SaaS/e-commerce/dashboard archetypes doesn't have an entry for
"motorsport engineering HUD," and forcing one on would violate the
skill's own instruction not to persist an unverified match. Retried
once with narrower terms per the skill's guidance; the `typography` and
`gsap` domain queries did return directly usable results (below), so
those are used as-is. Color and overall style direction come from the
spec's own explicit instructions (§8), applying standard dark-mode
contrast/accessibility practice on top.## Colors

> **SUPERSEDED — see below.** This section originally chose telemetry green
> as the single accent. That decision has been reversed. The original
> reasoning is kept so the change is auditable rather than silent.

Near-black background and off-white text are specified directly (§8).

**Original choice — telemetry green (#34E27A).** Reasoning: it matched the
"TELEMETRY ONLINE" / "SYSTEM STATUS: ONLINE" vocabulary the spec itself used,
and avoided the neon of §7. It was defensible.

**Why it changed.** Rendered in a real browser, green at that saturation
read as *generic developer terminal* — the category the brief explicitly
rules out — rather than as motorsport engineering. The palette was correct;
the accent was not carrying the identity.

**New choice — papaya (#FF7A18)**, the pit-wall warning-lamp orange. Green
was not discarded but **demoted to a single reserved meaning** (`--color-live`
= "running right now"), which is what stops a status chip competing with a
heading for attention. A cyan secondary (`--color-data`) carries secondary
data series only.

```
--color-background      #0A0B0D   near-black, cool-neutral
--color-surface         #121317   raised rows / hover fills
--color-foreground      #F1F2F4   primary text (off-white, not pure white)
--color-foreground-muted #B8BBC2   secondary text
--color-foreground-faint #8B8F98  technical metadata
--color-accent          #FF7A18   papaya — hierarchy, CTAs, primary trace
--color-data            #47C7E0   telemetry cyan — secondary data channel ONLY
--color-live            #3DDC84   live/active status ONLY
--color-critical        #F0453E   errors only
```

Measured contrast against `#0A0B0D` in a real browser (not estimated):
heading `17.58:1`, body `10.24:1`, 12px metadata `6.08:1`, accent `8.18:1` —
all above WCAG AA.

## Typography

Three roles per spec §9. The `typography` domain search returned two
directly relevant, verified pairings instead of one invented from
scratch:

- **Display — Barlow Condensed.** From the catalog's "Sports/Fitness"
  pairing (condensed, energetic, built for impact headlines) — used for
  the wordmark, section titles, project titles.
- **Body — Inter.** Diverges from the catalog's suggested body partner
  (Barlow) in favor of Inter, which is purpose-built for long-form UI
  reading at small sizes — this site's case-study prose is dense, and
  Inter's hinting holds up better there than a condensed-family sibling.
- **Technical — JetBrains Mono.** From the catalog's "Developer Mono"
  pairing. Chosen over the alternative match (Fira Code) because its
  design goal — maximum character distinction, especially digits — is
  a closer fit for telemetry values than Fira Code's ligature-focused,
  code-editor orientation.

## Motion

**Resolved without an animation library.** The earlier note here proposed
seeding `lib/motion/` from GSAP presets. Instead the one scroll effect was
built in plain CSS (`animation-timeline: view()`), and the boot sequence's
keyframes were later removed outright along with `SystemBoot.tsx` — four
animated progress bars claiming a system state that did not exist. See
[FINAL_EXPERIENCE_REPORT.md](./FINAL_EXPERIENCE_REPORT.md). No animation
dependency is installed or justified — `gsap`, `lenis` and the Three.js
stack were removed as unused. See [../DESIGN.md](../DESIGN.md#motion).

## Spacing

No custom scale was defined — Tailwind v4's single `--spacing: 0.25rem`
base already multiplies out to the 4/8/12/16/24/32/48/64/96px scale
used throughout, so overriding it would just be restating the default.

## Still open

- **Resolved:** accent choice → papaya (#FF7A18). See above.
- Real product screenshots/diagrams will likely want 1–2 accent-adjacent
  neutrals added once they exist (e.g., a chart palette) — not guessed
  at here since no chart content exists yet to design against.
