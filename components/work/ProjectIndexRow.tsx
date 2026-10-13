import Link from "next/link";
import type { Project } from "@/types/project";
import { StatusBadge } from "@/components/ui/Badge";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { ProjectInstrument } from "@/components/work/ProjectInstrument";
import { cn } from "@/lib/utils";

/**
 * Project index row — the portfolio's most-read component (spec §05).
 *
 * A card carries exactly eight things and nothing else:
 *
 *   01 · NAME · DOMAIN · STATUS · ONE-SENTENCE PURPOSE ·
 *   3–7 TECH CHIPS · ONE EVIDENCE ITEM · VIEW CASE STUDY →
 *
 * The previous row also rendered this project's instrument on hover, the
 * full year, a year sentinel check and a metric readout in the right
 * column. The instrument is now on the case-study hero and the flagship
 * block, where there is room for it; on an index row it was decoration
 * competing with the one thing the row exists to communicate.
 *
 * The row is a single link — the whole surface is clickable and the
 * "VIEW CASE STUDY →" text is the visible affordance rather than a bare
 * arrow, so the destination is legible without hovering.
 *
 * MOTION. Hover and keyboard focus get the same three responses, because
 * both are the row being "entered":
 *
 *   1. a hairline accent trace scales in along the row's bottom edge;
 *   2. the action's arrow steps forward;
 *   3. this project's own motif — the instrument that identifies it
 *      everywhere else on the site — draws itself in the right rail.
 *
 * All three are transforms and opacity on elements that already exist.
 * The motif occupies a fixed 96×28 box at every state, so revealing it
 * never resizes the row, never wraps the title and never shifts a
 * neighbouring row; it is present at rest with its glyphs held at zero
 * opacity, which is what makes it free.
 *
 * WHY IT CAN BE HERE AT ALL. The row is a server component and the motif
 * is pure CSS: the glyphs are plain children of the SVG, animated by the
 * shared `.instrument-row` rule, with the hidden state inside
 * `prefers-reduced-motion: no-preference` exactly like every other
 * primitive. A client component would have cost a hydration boundary on
 * the single most-read component in the portfolio to do what a
 * `:hover` selector does for free.
 *
 * `group-focus-visible` is what makes the keyboard path identical to the
 * pointer path; a row that only reacted to hover would make the primary
 * navigation of this site mouse-only.
 */
export function ProjectIndexRow({
  project,
  index,
  headingLevel = "h3",
}: {
  project: Project;
  index: number;
  /**
   * h2 on /work (rows sit directly under the page h1), h3 on the homepage
   * (they sit under the "Selected Systems" section h2).
   */
  headingLevel?: "h2" | "h3";
}) {
  const number = String(index + 1).padStart(2, "0");
  const chips = (project.keyTechnologies ?? project.technologies).slice(0, 7);
  const Heading = headingLevel;

  // The row's motif. `visualizationType` is optional in the data, so a
  // project without one is a real state rather than a bug — the motif is
  // rendered only where one exists. The rail's grid track is a fixed `96px`
  // rather than `auto`, which is what keeps the branch from changing the
  // row's layout for projects that have no motif.
  const motif = project.visualizationType;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group-row group relative grid grid-cols-[auto_1fr] items-center gap-x-5 border-b border-border-subtle py-7 transition-colors duration-(--motion-duration-instant) hover:bg-surface/50 focus-visible:bg-surface/50 sm:gap-x-7 lg:grid-cols-[auto_96px_1fr] lg:gap-x-7"
    >
      {/* The hover/focus trace. One pixel, accent, scaled from the left
          by the `.rule-expand` primitive — and present at rest (scaled
          flat) so it never changes the row's box. */}
      <span
        aria-hidden="true"
        className="rule-expand absolute bottom-0 left-0 h-px w-full bg-accent"
      />

      <span
        aria-hidden="true"
        className="font-technical text-sm tabular-nums text-foreground-faint transition-colors group-hover:text-accent group-focus-visible:text-accent"
      >
        {number}
      </span>

      {/* Project motif — revealed on hover and on keyboard focus.
          Decorative by construction (`aria-hidden`): the row already
          states the project's name, domain, status, purpose and one
          piece of evidence in text, so nothing here is information a
          reader can only get by looking. */}
      {motif && (
        <span aria-hidden="true" className="instrument-row hidden lg:block">
          <ProjectInstrument type={motif} className="h-[28px] w-[96px]" />
        </span>
      )}

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          <Heading className="font-display text-xl uppercase leading-tight tracking-tight transition-colors group-hover:text-accent md:text-2xl">
            {project.title}
          </Heading>
          <TechnicalLabel className="text-foreground-faint">{project.tagline}</TechnicalLabel>
          <StatusBadge status={project.status} />
        </div>

        {/* The one-sentence purpose. */}
        <p className="mt-2.5 max-w-2xl font-body text-[15px] leading-relaxed text-foreground-muted">
          {project.hook}
        </p>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {chips.map((tech) => (
              <li
                key={tech}
                className="font-technical text-[11px] uppercase tracking-wide text-foreground-faint"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground">
            View Case Study{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-(--motion-duration-fast) ease-(--motion-ease-standard) group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
            >
              →
            </span>
          </span>
          {/* The single evidence item. A measured figure where one exists,
              an evidence statement where one does not — never a number
              standing in for a number nobody has (§50). */}
          <span
            className={cn(
              "font-technical text-[11px] uppercase tracking-[0.15em]",
              // Evidence statements are words where a figure would go, and
              // some of them are long. Capping the width keeps a
              // consistent right rail instead of letting one row stretch
              // the whole column.
              "sm:max-w-[34ch] sm:text-right",
              project.metrics?.length ? "text-accent" : "text-data"
            )}
          >
            {project.metrics?.[0]?.value ?? project.evidence}
            {project.metrics?.[0] ? ` · ${project.metrics[0].label}` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
