import type { PipelineStage } from "@/types/project";
import { EngineeringFigure } from "./EngineeringFigure";
import { cn } from "@/lib/utils";

/**
 * Intelligence pipeline — the dominant visual for a player-intelligence
 * system.
 *
 * Interaction is CSS-only (`group-hover` + `focus-within`), deliberately:
 * the portfolio allows exactly two client components and a scatter plot
 * that needs hydration to explain itself is not worth a third. Every row
 * is also readable without hovering, so nothing is gated behind a pointer
 * and the whole thing degrades to a static diagram under
 * `prefers-reduced-motion`.
 *
 * The figure is the claim the project actually makes: raw attributes are
 * not intelligence, and every step between them is named.
 */
export function IntelligencePipeline({
  stages,
  figure,
  title = "Intelligence pipeline",
  caption,
  interactive = true,
}: {
  stages: PipelineStage[];
  figure: number;
  /**
   * Figure title, and the first half of its accessible name. Defaults to the
   * pipeline this component was built for. A project whose flow is not an
   * attribute pipeline names its own — F1 Voice Engineer's flow is a spoken
   * conversation, and labelling that figure "Intelligence pipeline" would
   * describe a shape the project does not have.
   */
  title?: string;
  caption?: string;
  interactive?: boolean;
}) {
  if (stages.length === 0) return null;

  return (
    <EngineeringFigure
      number={figure}
      title={title}
      caption={
        caption ??
        "Each stage is a distinct transformation. The intelligence layer queries a stable representation rather than re-deriving meaning from raw attributes on every call."
      }
      fallback={
        <ol className="space-y-1.5">
          {stages.map((s, i) => (
            <li key={s.label}>
              <span className="font-technical uppercase">{s.label}</span>
              {i < stages.length - 1 && <span aria-hidden="true"> → </span>}
              {s.detail ? ` — ${s.detail}` : ""}
            </li>
          ))}
        </ol>
      }
    >
      <ol className="flex flex-col">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          const role = i === 0 ? "Source" : isLast ? "Output" : "Transform";

          return (
            <li
              key={stage.label}
              className={cn("diagram-node group/stage", interactive ? "cursor-default" : undefined)}
            >
              <div
                className={cn(
                  "flex items-stretch gap-3 border-l-2 py-2.5 pl-4 transition-colors duration-(--motion-duration-fast) ease-(--motion-ease-standard)",
                  "group-hover/stage:border-accent group-focus-within/stage:border-accent",
                  isLast ? "border-data" : "border-border-strong"
                )}
              >
                {/* ---- stage index ---- */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 shrink-0 font-technical text-[10px] tabular-nums",
                    "text-foreground-faint group-hover/stage:text-accent group-focus-within/stage:text-accent"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* ---- label + role ---- */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="font-technical text-[12px] uppercase tracking-[0.14em] text-foreground">
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        "font-technical text-[9px] uppercase tracking-[0.2em] text-foreground-faint",
                        isLast && "text-data"
                      )}
                    >
                      {role}
                    </span>
                  </div>
                  {stage.detail && (
                    <p className="mt-1 font-body text-[13px] leading-relaxed text-foreground-muted">
                      {stage.detail}
                    </p>
                  )}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="connector-arrow mt-2 block font-technical text-[9px] leading-none text-border-strong"
                    >
                      ↓
                    </span>
                  )}
                </div>
              </div>

              {/* ---- connector ----
                  Two parts. The arrowhead now lives *inside* the stage's
                  node, so it rides that node's own `.diagram-node` entry
                  window and arrives with the stage it points away from —
                  direction is stated when the thing it departs from lands,
                  not one step early. The rule stays outside and draws on its
                  own window, so the line still reads as being drawn between
                  two points.

                  Brightness rather than movement: the glyph is 9px and
                  travelling would be unreadable. Hovering or focusing the
                  stage it belongs to brightens it to accent, so the reader's
                  attention and the direction cue are the same signal. */}
              {!isLast && (
                <div
                  className="group/stage-connector flex items-center gap-2 py-0.5 pl-[1.6rem]"
                  aria-hidden="true"
                >
                  <span className="diagram-connector-x h-px w-8 bg-border-subtle" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </EngineeringFigure>
  );
}

/**
 * Feature space — a deterministic SVG scatter.
 *
 * Every coordinate is a hard-coded constant. No `Math.random()`, no
 * `Date.now()`, no `useId()`: the same figure must render byte-identically
 * on the server and the client, on every build, or React will report a
 * hydration mismatch. The points are illustrative by construction and the
 * caption says so.
 */
export function FeatureSpace({
  figure,
  caption,
}: {
  figure: number;
  caption?: string;
}) {
  // Fixed lattice with a deterministic jitter pattern, so the cloud looks
  // organic but is identical on every render.
  const points: Array<[number, number, number]> = [];
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const jx = ((row * 7 + col * 13) % 9) - 4;
      const jy = ((row * 5 + col * 11) % 9) - 4;
      points.push([44 + col * 25 + jx * 0.9, 26 + row * 21 + jy * 0.9, 1.4 + ((row + col) % 3) * 0.5]);
    }
  }
  const clusters = [
    { cx: 92, cy: 62, r: 52, label: "Attack" },
    { cx: 196, cy: 48, r: 46, label: "Build-up" },
    { cx: 258, cy: 118, r: 44, label: "Defence" },
  ];

  return (
    <EngineeringFigure
      number={figure}
      title="Feature space"
      caption={
        caption ??
        "Illustrative only — a schematic of where attributes land once normalised, not a plot of real player coordinates. Each player's representation is queried downstream as a fixed vector rather than re-derived from raw attributes."
      }
      fallback={
        <p>
          A schematic showing three overlapping clusters — attack, build-up and
          defence — in a normalised attribute space, with roughly seventy
          illustrative points distributed across them. Positions are fixed
          constants chosen for legibility, not derived from any dataset.
        </p>
      }
    >
      <svg
        viewBox="0 0 330 170"
        className="h-auto w-full"
        role="img"
        aria-label="Illustrative scatter of roughly seventy player points grouped into three overlapping clusters labelled attack, build-up and defence"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Illustrative feature space</title>
        <desc>
          Schematic, not measured data. Three translucent cluster regions
          labelled attack, build-up and defence, with a fixed lattice of
          player points distributed across and between them.
        </desc>

        {/* grid */}
        <g stroke="var(--color-border-subtle)" strokeWidth="1">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`gx${i}`} x1={30 + i * 70} y1={10} x2={30 + i * 70} y2={160} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`gy${i}`} x1={20} y1={20 + i * 40} x2={320} y2={20 + i * 40} />
          ))}
        </g>

        {/* cluster regions */}
        {clusters.map((c) => (
          <ellipse
            key={c.label}
            cx={c.cx}
            cy={c.cy}
            rx={c.r}
            ry={c.r * 0.66}
            fill="none"
            stroke="var(--color-data)"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.5"
          />
        ))}

        {/* points */}
        {points.map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="var(--color-foreground-muted)"
            opacity="0.34"
          />
        ))}

        {/* the one player being scored */}
        <circle cx="92" cy="62" r="5" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
        <circle cx="92" cy="62" r="1.8" fill="var(--color-accent)" />

        {/* cluster labels */}
        {clusters.map((c) => (
          <text
            key={c.label}
            x={c.cx}
            y={c.cy - c.r * 0.66 - 4}
            textAnchor="middle"
            fill="var(--color-foreground-faint)"
            fontSize="7"
            letterSpacing="1.4"
            style={{ fontFamily: "var(--font-technical)", textTransform: "uppercase" }}
          >
            {c.label}
          </text>
        ))}

        {/* axes */}
        <text
          x="20"
          y="166"
          fill="var(--color-foreground-faint)"
          fontSize="7"
          letterSpacing="1.2"
          style={{ fontFamily: "var(--font-technical)" }}
        >
          NORMALISED ATTRIBUTE SPACE
        </text>
      </svg>
    </EngineeringFigure>
  );
}