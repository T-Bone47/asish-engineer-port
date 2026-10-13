import Link from "next/link";
import type { Project } from "@/types/project";
import { StatusBadge } from "@/components/ui/Badge";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { MetricGrid } from "@/components/work/MetricGrid";
import { ProjectInstrument } from "@/components/work/ProjectInstrument";

/**
 * Flagship block — the strongest visual treatment on /work.
 *
 * WHY A DEDICATED BLOCK. Spec §66 weights the flagship by demonstrated
 * technical depth, and the only honest proxy for that in the data is:
 * is this project backed by measured, verified numbers? Today that is
 * Live F1 Intelligence alone. It is selected by `getFlagshipProject()`,
 * which requires BOTH `featured` AND verified metrics — so this is
 * weighted by evidence, not by hand.
 *
 * WHAT IS *NOT* HERE ANY MORE. The block used to repeat the project's
 * description, its architecture summary and its stack list. All three now
 * live on the case study, and duplicating them here meant the same three
 * paragraphs appeared twice within one click. What remains is what
 * justifies a featured treatment at all: the hook, the thesis, the full
 * evidence band and the project's own instrument.
 */
export function FlagshipProject({
  project,
  index,
}: {
  project: Project;
  /** Catalogue position, so the block's number matches its case study. */
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="border border-border-strong bg-surface/40">
      <div className="p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-technical text-sm tabular-nums text-accent">{number}</span>
          <StatusBadge status={project.status} />
          <TechnicalLabel className="text-foreground-faint">{project.tagline}</TechnicalLabel>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-tight md:text-5xl">
              {project.title}
            </h2>

            <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-foreground">
              {project.hook}
            </p>

            {project.thesis && (
              <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-foreground-muted">
                {project.thesis}
              </p>
            )}
          </div>

          {project.visualizationType && (
            <div className="lg:col-span-5">
              <figure className="border border-border-subtle bg-background/50 p-4">
                <div className="h-[76px] w-full">
                  <ProjectInstrument
                    type={project.visualizationType}
                    labelled
                    className="h-full w-full"
                  />
                </div>
                <figcaption className="mt-3 font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
                  Illustrative schematic
                </figcaption>
              </figure>
            </div>
          )}
        </div>

        {project.metrics && project.metrics.length > 0 && (
          <MetricGrid metrics={project.metrics} variant="band" className="mt-8" />
        )}
      </div>

      <Link
        href={`/work/${project.slug}`}
        className="group flex items-center justify-between border-t border-border-strong px-6 py-5 transition-colors hover:bg-surface md:px-10"
      >
        <span className="font-technical text-xs uppercase tracking-[0.2em] text-foreground">
          View Case Study
        </span>
        <span
          aria-hidden="true"
          className="font-technical text-xl text-foreground-faint transition-[transform,color] duration-(--motion-duration-fast) ease-(--motion-ease-standard) group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          →
        </span>
      </Link>
    </article>
  );
}
