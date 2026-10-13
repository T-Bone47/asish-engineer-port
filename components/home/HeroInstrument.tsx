import { getFlagshipProject } from "@/data/projects";

/**
 * Hero instrument — "Canonical Event Convergence".
 *
 * WHAT THIS REPLACED. The hero's right column previously held `SystemBoot`:
 * an `aria-hidden` readout with staggered *filling progress bars* labelled
 * "System Initialising" → "System Ready". It was decoration imitating
 * instrumentation. Two independent problems with that:
 *
 *   1. It claimed a system state that does not exist. Nothing is
 *      initialising; there is no live system behind the page. A fake
 *      progress indicator is exactly the kind of interface costume this
 *      design language rules out, and it is the one thing on the page that
 *      was *less* true than it looked.
 *   2. It occupied the single most valuable column on the site — the first
 *      viewport — while the real signature figure sat below the fold,
 *      starting at y≈786 in a 900px viewport.
 *
 * WHAT THIS IS INSTEAD. The convergence that the flagship project is
 * actually built on: four real providers (OpenF1, FastF1, Jolpica, F1
 * SignalR) normalising into one canonical event model, with the project's
 * two verified figures printed underneath.
 *
 * TRUTHFULNESS. Every element is read from a real source, not asserted:
 *
 *   - The provider names come from `architecture.sources` on the flagship
 *     project in `data/projects.ts`; introduce a fifth provider there and it
 *     appears here.
 *   - The heading metric is `metrics[0]` — the same value the flagship block
 *     and the case study promote — and the second line uses `metrics[1]`.
 *   - The replay claim restates the project's own recorded validation
 *     method, not a new one.
 *   - Nothing is animated, nothing counts up, nothing is "live". It is a
 *     labelled figure describing an architecture.
 *
 * RESPONSIVE. Text is inside the SVG, so it scales with the figure. Sizes
 * are chosen against the two real render widths: ~389px in the hero column
 * at 1440 (scale 0.88) and ~342px at 390 (scale 0.78), so the smallest
 * label still lands at ≈11px rather than shrinking to a sub-pixel thread.
 *
 * Server Component. Deterministic geometry, no measurement, no client JS.
 */

type Provider = { name: string };

const ROW_TOP = 56;
const ROW_GAP = 38;
/** Where the four connectors meet, in figure units. Mid-point of the rows. */
const BUS_Y = ROW_TOP + ROW_GAP * 1.5;
const BUS_X = 252;
const LABEL_X = 150;
const DOT_X = 166;
const CONNECTOR_X = 176;
const KINK_X = 206;

export function HeroInstrument() {
  const flagship = getFlagshipProject();

  // No flagship (or no providers recorded) means no figure at all — never a
  // hardcoded fallback list, which is how the two drift apart in the first
  // place.
  const providers: Provider[] =
    flagship?.architecture?.sources?.map((name) => ({ name })) ?? [];
  const headline = flagship?.metrics?.[0];
  const second = flagship?.metrics?.[1];

  if (providers.length === 0 || !headline) return null;

  const rows = providers.map((provider, i) => ({
    name: provider.name.toUpperCase(),
    y: ROW_TOP + i * ROW_GAP,
  }));

  const description = [
    `Schematic of the ${flagship?.title} ingestion layer: ${providers
      .map((p) => p.name)
      .join(", ")} all normalise into one canonical event model.`,
    headline ? `${headline.value} ${headline.label.toLowerCase()}.` : "",
    second ? `${second.value} ${second.label.toLowerCase()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 440 260"
      className="w-full"
      role="img"
      aria-label={description}
      focusable="false"
    >
      {/* ---------- Figure identity ---------- */}
      <text
        x="2"
        y="16"
        fontFamily="var(--font-technical)"
        fontSize="15"
        letterSpacing="2.2"
        fill="var(--color-foreground-faint)"
      >
        CANONICAL EVENT CONVERGENCE
      </text>

      {/* ---------- Inputs: the real providers ---------- */}
      {rows.map((row) => (
        <g key={row.name}>
          <text
            x={LABEL_X}
            y={row.y + 5}
            textAnchor="end"
            fontFamily="var(--font-technical)"
            fontSize="17"
            letterSpacing="0.8"
            fill="var(--color-foreground)"
          >
            {row.name}
          </text>
          <circle
            cx={DOT_X}
            cy={row.y}
            r="3"
            fill="var(--color-foreground-faint)"
          />
          {/* Straight run, then a curve fanning into the common bus. The
              geometry is the point: four sources, one destination. */}
          <path
            d={`M ${CONNECTOR_X},${row.y} L ${KINK_X},${row.y} C ${KINK_X + 22},${row.y} ${BUS_X - 20},${BUS_Y} ${BUS_X},${BUS_Y}`}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1.25"
          />
        </g>
      ))}

      {/* ---------- Destination: one canonical model ---------- */}
      <rect
        x={BUS_X}
        y={BUS_Y - 29}
        width="186"
        height="58"
        fill="var(--color-accent)"
        fillOpacity="0.08"
      />
      <rect
        x={BUS_X}
        y={BUS_Y - 29}
        width="186"
        height="58"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <text
        x={BUS_X + 16}
        y={BUS_Y - 4}
        fontFamily="var(--font-technical)"
        fontSize="16"
        letterSpacing="1.8"
        fill="var(--color-accent)"
      >
        CANONICAL
      </text>
      <text
        x={BUS_X + 16}
        y={BUS_Y + 16}
        fontFamily="var(--font-technical)"
        fontSize="16"
        letterSpacing="1.8"
        fill="var(--color-foreground)"
      >
        EVENT MODEL
      </text>

      {/* ---------- Evidence, printed from the project's own figures ---------- */}
      <line
        x1="0"
        y1="196"
        x2="440"
        y2="196"
        stroke="var(--color-border-subtle)"
        strokeWidth="1"
      />
      <text
        x="2"
        y="228"
        fontFamily="var(--font-technical)"
        fontSize="15"
        fill="var(--color-foreground)"
      >
        {headline.value} {headline.label.toLowerCase()}
      </text>
      {/* Two lines rather than one long run. Concatenated, the two metrics
          needed ~431 of the 440 available units, which forced the second
          line down to a size that rendered under 10px on a 390px viewport.
          Split and worded to fit, both lines hold a legible size at the
          narrowest real viewport. */}
      {second && (
        <text
          x="2"
          y="249"
          fontFamily="var(--font-technical)"
          fontSize="15"
          fill="var(--color-foreground-faint)"
        >
          {second.value} {second.label.toLowerCase()} · verified by replay
        </text>
      )}
    </svg>
  );
}
