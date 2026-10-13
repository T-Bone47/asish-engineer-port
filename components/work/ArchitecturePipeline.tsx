import type { ArchitectureShape, PipelineStage } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Architecture pipeline — a directional diagram whose SHAPE reflects the
 * architecture rather than a uniform numbered list.
 *
 * Every project's pipeline used to render with one identical vertical rail,
 * which erased the most interesting structural fact available: real systems
 * differ in shape. Four providers collapsing into one canonical model does
 * not look like a linear numerical solver, and the diagram should not claim
 * that it does.
 *
 *   converge   many sources → one canonical stage. Rendered as a fan-in,
 *              because the many-to-one collapse IS the architecture.
 *   sequential one linear run, no branching.
 *   fanout     one stage expands into many parallel subsystems.
 *   branched   several stages each expand.
 *
 * Node roles are labelled Source / Process / Output rather than left to
 * inference, and the whole figure is numbered (`FIG. NN`) with a caption —
 * the register of an engineering document rather than a web page.
 *
 * Rendered as an <ol>, so flow order is conveyed semantically and not only
 * visually. Server Component; no client JS.
 */
export function ArchitecturePipeline({
  stages,
  shape = "sequential",
  sources,
  figure,
}: {
  stages: PipelineStage[];
  shape?: ArchitectureShape;
  /** Upstream providers, drawn above the pipeline in the `converge` shape. */
  sources?: string[];
  /** Global figure number, e.g. 1 → "FIG. 01". */
  figure?: number;
}) {
  if (stages.length === 0) return null;

  const lastIndex = stages.length - 1;
  const showSources = shape === "converge" && sources && sources.length > 0;

  return (
    <figure className="max-w-3xl">
      <ol
        className="relative"
        aria-label={`Data flow: ${stages.length} stages, from ${stages[0]?.label ?? "source"} to ${stages[lastIndex]?.label ?? "output"}`}
      >
        {/* ---- converge: upstream sources fan in to the first stage ---- */}
        {showSources && (
          <li className="mb-6">
            <ul className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <li
                  key={source}
                  className="border border-border-strong px-2.5 py-1 font-technical text-[11px] uppercase tracking-wide text-foreground-muted"
                >
                  {source}
                </li>
              ))}
            </ul>
            {/* the collapse itself, made visible */}
            <div className="mt-3 flex items-center gap-2" aria-hidden="true">
              <span className="h-px w-full bg-border-strong" />
              <span className="font-technical text-[10px] leading-none text-foreground-faint">
                ▼ normalise
              </span>
            </div>
          </li>
        )}

        {stages.map((stage, i) => {
          const isSource = i === 0;
          const isOutput = i === lastIndex;
          const children = stage.children ?? [];
          const role =
            shape === "fanout" && children.length > 0
              ? "Expand"
              : isSource
                ? "Source"
                : isOutput
                  ? "Output"
                  : "Process";

          return (
            <li
              key={stage.label}
              className="diagram-node group/stage relative flex gap-5 pb-8 last:pb-0"
            >
              <div className="relative flex w-8 shrink-0 flex-col items-center">
                {!isOutput && (
                  <span
                    aria-hidden="true"
                    className="diagram-connector-y absolute top-9 h-[calc(100%-2.25rem)] w-px bg-border-strong"
                  />
                )}

                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-technical text-[11px] tabular-nums",
                    isSource && "border-accent bg-accent text-background",
                    isOutput && "border-data bg-data text-background",
                    !isSource && !isOutput && "border-border-strong bg-surface text-foreground-muted"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {!isOutput && (
                  <span
                    aria-hidden="true"
                    className="connector-arrow absolute top-[4.6rem] z-10 font-technical text-[10px] leading-none text-border-strong"
                  >
                    ↓
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 pt-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-technical text-sm uppercase tracking-wide text-foreground">
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      "font-technical text-[10px] uppercase tracking-[0.2em]",
                      isSource
                        ? "text-accent"
                        : isOutput
                          ? "text-data"
                          : "text-foreground-faint"
                    )}
                  >
                    {role}
                  </span>
                </div>

                {children.length > 0 && (
                  <ul className="relative mt-3 space-y-1.5 pl-5">
                    {children.map((child) => (
                      <li key={child} className="relative flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="diagram-connector-x absolute -left-5 top-1/2 h-px w-3.5 bg-border-strong"
                        />
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-border-strong"
                        />
                        <span className="font-body text-sm text-foreground-muted">{child}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
        {figure !== undefined && <span className="text-accent">Fig. {String(figure).padStart(2, "0")}</span>}
        <span>
          {shape === "converge" ? "Converging" : shape === "fanout" ? "Fan-out" : shape === "branched" ? "Branched" : "Sequential"}{" "}
          architecture · {stages.length} stages
        </span>
      </figcaption>
    </figure>
  );
}