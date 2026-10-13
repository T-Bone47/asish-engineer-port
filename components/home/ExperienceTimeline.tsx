import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";

/**
 * Experience — an engineering timeline instrument.
 *
 * WHAT CHANGED. This was a divided list: organisation, role, period, then
 * a wrapped row of bullet words. It did not read as a career or as
 * engineering work — it read as two records in a table.
 *
 * Now the timeline itself carries the information: a continuous rail with
 * a node per role, the period printed large against the node, and the
 * responsibilities beneath. The rail is what makes two periods read as one
 * trajectory rather than two unrelated entries.
 *
 * The `isPersonalProject` flag is deliberately NOT rendered as a badge.
 * Everything listed here is professional experience and is kept strictly
 * separate from self-directed projects — a "personal project" chip would
 * blur exactly the distinction the data model maintains.
 *
 * Server Component. No timeline events are invented; every node is a real
 * role from `data/experience.ts`.
 */
export function ExperienceTimeline({
  headingLevel = "h3",
}: {
  /** h2 on /experience (entries sit directly under the page h1), h3 on
   *  the homepage (they sit under the "Experience" section h2). */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <ol className="relative">
      {experience.map((entry, i) => {
        const isLatest = i === 0;
        return (
          <li key={entry.id} className="relative grid grid-cols-1 gap-x-10 gap-y-3 pb-12 sm:grid-cols-[7rem_1fr] last:pb-0">
            {/* ---- period + node on the rail ---- */}
            <div className="flex items-start gap-3 sm:flex-col sm:items-end sm:gap-2 sm:text-right">
              <span
                className={cn(
                  "font-technical text-sm tabular-nums leading-none",
                  isLatest ? "text-accent" : "text-foreground-faint"
                )}
              >
                {entry.period.split("—")[0]?.trim()}
              </span>
              <span className="hidden sm:block" aria-hidden="true">
                <span
                  className={cn(
                    "block h-2.5 w-2.5 rounded-full",
                    isLatest ? "bg-accent" : "border border-border-strong bg-surface"
                  )}
                />
              </span>
            </div>

            {/* ---- role ---- */}
            <div className="border-l border-border-subtle pl-6 sm:border-l-0 sm:pl-0">
              <Heading className="font-display text-2xl uppercase tracking-tight md:text-3xl">
                {entry.organization}
              </Heading>

              <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-body text-sm text-accent">{entry.role}</span>
                <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                  {entry.period}
                </span>
                {isLatest && (
                  <span className="inline-flex items-center gap-1.5 font-technical text-[11px] uppercase tracking-[0.15em] text-live">
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-live" />
                    Current
                  </span>
                )}
              </div>

              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {entry.focus.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-body text-sm text-foreground-muted"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-border-strong" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}