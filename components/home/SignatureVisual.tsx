import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Signature visual — "Circuit / Speed Profile".
 *
 * WHAT CHANGED. The previous version was a decorative curve over an
 * arbitrary staircase on a grid: two arbitrary strokes that read as
 * telemetry only because they were thin and labelled. It encoded nothing.
 *
 * This is now a figure with actual internal logic — the composition a
 * race engineer would actually sketch:
 *
 *   1. TRACK MAP (accent). An original closed circuit — deliberately not
 *      a real Grand Prix, since tracing someone else's circuit implies a
 *      data source that does not exist here. Sector splits S1/S2/S3 sit
 *      on the geometry itself.
 *   2. SPEED PROFILE (cyan), directly beneath and x-aligned to the track.
 *      Because the two share a horizontal axis, the fast corners line up
 *      with the apexes above and the long straights line up with the
 *      profile's peaks. That alignment is what turns two unrelated
 *      squiggles into one readable chart.
 *
 * RESPONSIVE — two compositions, not one shrunk one. A single 1200x560
 * viewBox at a 360px viewport renders ~295x138, which shrinks the track to
 * an unreadable thread and the sector markers to sub-pixel dots. So the
 * track is cropped tight and drawn at a heavier stroke on small screens
 * (the track alone is the meaningful half), and the full two-channel
 * figure — track, profile, ticks, labels — appears from `md` up where
 * there is room for it. Same geometry in both; different framing.
 *
 * TRUTHFULNESS (spec §37). No lap time, no speed number, no delta, no tyre
 * or fuel figure is shown — none is measured. The profile is a schematic,
 * labelled "SCHEMATIC — NOT MEASURED" on the canvas itself rather than in
 * a caption nobody reads. Sector labels are structural positions, not
 * timed splits.
 *
 * MOTION — the site's authored moment. The figure draws itself: grid,
 * then registration marks, then the circuit traces across the width, the
 * sector markers surface as the trace reaches them, the speed profile
 * draws beneath, and the axis closes the figure. It then holds, with one
 * low-amplitude breathe on the sector markers as its resting state.
 *
 * Every step is a class from globals.css, and the order comes from the
 * view timeline's `animation-range` windows rather than from delays: the
 * figure is 478px tall and starts at y≈792 of a 900px viewport, so a
 * load-triggered entrance would play while four fifths of it is still
 * below the fold. The paths carry `pathLength="1000"` so one dash pair
 * draws any of them exactly once — no length is measured in JS, and there
 * is no JS here at all. Reduced motion gets the finished figure.
 *
 * The pulse is opacity only, on three small circles — the cheapest
 * possible loop. Nothing else on this page loops.
 */

/** Original circuit geometry — not a real Grand Prix. */
const TRACK_PATH =
  "M 92,232 L 268,232 L 300,96 L 430,96 L 470,214 L 596,214 L 742,322 L 906,322 L 946,232 L 1046,128 L 1120,128 L 1120,300 L 1010,300 L 950,392 L 742,392 L 620,300 L 470,300 L 430,392 L 232,392 L 168,300 L 92,300 Z";

/** Speed profile — x-aligned to TRACK_PATH so peaks line up with straights. */
const PROFILE_PATH =
  "M 92,58 L 268,58 L 300,14 L 430,14 L 470,44 L 596,44 L 742,64 L 906,64 L 946,30 L 1046,18 L 1120,18 L 1120,72 L 1010,72 L 950,80 L 742,80 L 620,52 L 470,52 L 430,80 L 232,80 L 168,72 L 92,72 Z";

const SECTORS = [
  { id: "S1", cx: 300, cy: 96, labelY: 62 },
  { id: "S2", cx: 742, cy: 322, labelY: 372 },
  { id: "S3", cx: 1046, cy: 128, labelY: 88 },
] as const;

const FIGURE_LABEL =
  "Schematic circuit map with three marked sectors, and an aligned speed profile beneath it. Corners of the profile align vertically with the apexes of the circuit above.";

export function SignatureVisual() {
  return (
    <section aria-labelledby="signature-heading" className="border-y border-border-subtle">
      <Container className="py-12 md:py-16">
        <div className="flex items-baseline justify-between gap-6">
          <TechnicalLabel id="signature-heading">Circuit / Speed Profile</TechnicalLabel>
          <TechnicalLabel className="hidden md:inline">Schematic — Not Measured</TechnicalLabel>
        </div>

        {/* ---------- MOBILE: cropped track only, heavier stroke ---------- */}
        <svg
          viewBox="64 76 1092 336"
          className="mt-6 w-full md:hidden"
          role="img"
          aria-label="Schematic circuit map with three marked sectors."
        >
          <defs>
            <pattern id="sig-grid-sm" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border-subtle)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect
            className="trace-step trace-step-1 trace-fade"
            x="64"
            y="76"
            width="1092"
            height="336"
            fill="url(#sig-grid-sm)"
          />
          <path
            className="trace-step trace-step-3 trace-draw"
            pathLength={1000}
            d={TRACK_PATH}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          {SECTORS.map((s) => (
            <g key={s.id} className="trace-step trace-step-4 trace-fade">
              <circle
                className="trace-ambient"
                cx={s.cx}
                cy={s.cy}
                r="11"
                fill="var(--color-background)"
                stroke="var(--color-accent)"
                strokeWidth="6"
              />
            </g>
          ))}
        </svg>

        {/* ---------- DESKTOP: full two-channel figure ---------- */}
        <svg
          viewBox="0 0 1200 560"
          className="mt-6 hidden w-full md:block"
          role="img"
          aria-label={FIGURE_LABEL}
          aria-describedby="signature-figure-desc"
        >
          <defs>
            <pattern id="sig-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1" />
            </pattern>
            <linearGradient id="sig-profile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-data)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-data)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <rect className="trace-step trace-step-1 trace-fade" width="1200" height="560" fill="url(#sig-grid)" />

          {/* registration marks */}
          <g
            className="trace-step trace-step-2 trace-fade"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            fill="none"
          >
            <path d="M 20,20 L 20,44 M 20,20 L 44,20" />
            <path d="M 1180,20 L 1180,44 M 1180,20 L 1156,20" />
            <path d="M 20,400 L 20,376 M 20,400 L 44,400" />
            <path d="M 1180,400 L 1180,376 M 1180,400 L 1156,400" />
          </g>

          {/* 1. TRACK MAP (accent) */}
          <path
            className="trace-step trace-step-3 trace-draw"
            pathLength={1000}
            d={TRACK_PATH}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* sector markers, anchored on the geometry */}
          {SECTORS.map((s) => (
            <g key={s.id} className="trace-step trace-step-4 trace-fade">
              <circle
                className="trace-ambient"
                cx={s.cx}
                cy={s.cy}
                r="5"
                fill="var(--color-background)"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
              />
              <text
                x={s.cx}
                y={s.labelY}
                textAnchor="middle"
                fontFamily="var(--font-technical)"
                fontSize="13"
                letterSpacing="1.5"
                fill="var(--color-foreground-faint)"
              >
                {s.id}
              </text>
            </g>
          ))}

          {/* 2. SPEED PROFILE (cyan), x-aligned to the track */}
          <g transform="translate(0,432)">
            <path className="trace-step trace-step-5 trace-fade" d={PROFILE_PATH} fill="url(#sig-profile)" />
            <path
              className="trace-step trace-step-5 trace-draw"
              pathLength={1000}
              d={PROFILE_PATH}
              fill="none"
              stroke="var(--color-data)"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <line
              className="trace-step trace-step-5 trace-fade"
              x1="80"
              y1="80"
              x2="1130"
              y2="80"
              stroke="var(--color-border-strong)"
              strokeWidth="1"
            />
            <text
              className="trace-step trace-step-6 trace-fade"
              x="80"
              y="98"
              fontFamily="var(--font-technical)"
              fontSize="11"
              letterSpacing="2"
              fill="var(--color-foreground-faint)"
            >
              DISTANCE →
            </text>
          </g>

          {/* axis ticks tying profile x-positions back to the track */}
          <g
            className="trace-step trace-step-6 trace-fade"
            stroke="var(--color-border-subtle)"
            strokeWidth="1"
            strokeDasharray="2 4"
          >
            {SECTORS.map((s) => (
              <line key={s.id} x1={s.cx} y1="404" x2={s.cx} y2="432" />
            ))}
          </g>          </svg>

        <p id="signature-figure-desc" className="mt-6 max-w-2xl font-body text-sm leading-relaxed text-foreground-muted">
          Telemetry, simulation and race intelligence built around a canonical
          event model — every stage validated against real captured session data
          rather than assumed.
        </p>

        {/* Accessible restatement of the figure, for the same reason every
            engineering figure in the case studies carries one: the drawing is
            decorative schematic, and the information it encodes is available
            in words. §7 (Accessibility). */}
        <details className="mt-4 border-l-2 border-border-strong pl-4">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint transition-colors hover:text-foreground">
            Read this figure as text
          </summary>
          <div className="mt-2 font-body text-sm leading-relaxed text-foreground-muted">
            {FIGURE_TEXT}
          </div>
        </details>
      </Container>
    </section>
  );
}

/** Accessible restatement of the desktop figure. The mobile figure is a cropped
 * track-only schematic and is described by its own aria-label; this text covers
 * the two-channel figure that the desktop SVG draws. */
const FIGURE_TEXT =
  "Schematic circuit map of an original closed circuit with three sectors marked S1, S2 and S3, drawn in papaya orange above a cyan speed profile on a shared horizontal axis. The speed profile is higher over the long straights and lower through the corners, and the corners line up vertically with the apexes of the circuit above. The figure is an illustrative schematic, not measured telemetry — no lap time, speed, delta, tyre or fuel figure is shown.";
