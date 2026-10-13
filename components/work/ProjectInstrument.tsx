import type { VisualizationType } from "@/types/project";
import { INSTRUMENT_PALETTE_CSS_VARS, InstrumentSvg } from "./instrument-geometry";

/**
 * Project instrument — the DOM (site) rendering of the shared geometry.
 *
 * This is deliberately a thin wrapper. The shapes themselves live in
 * `./instrument-geometry.tsx` because they are now drawn in two places: here,
 * coloured with the site's semantic tokens, and on the generated social card,
 * which runs in satori and needs literal hex. Keeping one copy of the paths is
 * what stops a case study's page and its shared preview from diverging.
 *
 * Responsibilities kept here, and nowhere else:
 *   - colouring the geometry with `var(--color-*)`, so the figure follows the
 *     theme rather than freezing today's palette into a component;
 *   - defaulting to `aria-hidden` (see `labelled`), because the schematic is
 *     decorative unless a figcaption asks for it.
 *
 * The sizing contract is unchanged: `h-full w-full` plus whatever the caller
 * passes, so the figure stays fully responsive in the hero, on index rows and
 * in hover previews.
 */

export function ProjectInstrument({
  type,
  className,
  labelled = false,
}: {
  type: VisualizationType;
  className?: string;
  /** When true the figure is exposed to assistive tech with a description. */
  labelled?: boolean;
}) {
  return (
    <InstrumentSvg
      type={type}
      palette={INSTRUMENT_PALETTE_CSS_VARS}
      className={className}
      labelled={labelled}
    />
  );
}

/** Human-readable description, used for figcaptions and aria labels. */
export { instrumentLabel } from "./instrument-geometry";
