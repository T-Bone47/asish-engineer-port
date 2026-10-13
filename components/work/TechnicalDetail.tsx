import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { cn } from "@/lib/utils";

/**
 * Progressive disclosure for level-4 engineering detail (spec §11).
 *
 * WHY A NATIVE <details>. The brief allows exactly two client components in
 * this portfolio (`app/error.tsx` and the header's menu), and an accordion
 * is not a good enough reason to spend a third. `<details>` is keyboard
 * operable, announced by screen readers as a disclosure widget, works with
 * JavaScript disabled, and can be opened by fragment link in browsers that
 * support `#id` on `details` — all for free, with no hydration boundary.
 *
 * WHY THIS IS A COMPONENT AT ALL. The case-study template has seven
 * figure families that only matter to a reader who already decided this
 * project interests them: provider matrices, capability registries, data
 * lineage, endpoint tables, algorithm write-ups, subsystem state and test
 * runs. Rendering them inline made two of the seven case studies read like
 * internal documentation — the exact failure the brief is correcting.
 *
 * WHAT IS DELIBERATELY *NOT* HIDDEN. Verified evidence stays in the main
 * view: headline metrics, the version wall, validation claims, limitations
 * and current state. Only implementation complexity moves in here. A
 * portfolio that hides its evidence is hiding its substance.
 */
export function TechnicalDetail({
  label = "Technical Detail",
  summary,
  children,
  className,
}: {
  /** Panel heading. Kept configurable so a project can say what is inside. */
  label?: string;
  /** One line under the heading, shown only while the panel is closed. */
  summary?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      className={cn(
        // border-t only: the panel joins the section rhythm rather than
        // sitting inside it as another bordered card.
        "group border-t border-border-strong",
        className
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-6 py-6",
          "marker:hidden [&::-webkit-details-marker]:hidden",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        )}
      >
        <span className="min-w-0">
          <span className="flex items-center gap-3">
            <TechnicalLabel as="span" className="text-accent">
              {label}
            </TechnicalLabel>
            {/* Pure CSS rotation, so the affordance costs no script and
                collapses to a static "+" under reduced motion. */}
            <span
              aria-hidden="true"
              className="font-technical text-lg leading-none text-foreground-faint transition-transform duration-(--motion-duration-instant) ease-(--motion-ease-standard) group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </span>
          {summary && (
            <span className="mt-2 block max-w-2xl font-body text-sm leading-relaxed text-foreground-muted">
              {summary}
            </span>
          )}
        </span>
      </summary>

      {/* No grid-rows animation: it would need `interpolate-size` to be
          smooth and would silently truncate overflow in browsers that
          lack it. A plain block reveal is instant, always correct, and
          lets the page below move naturally. */}
      <div className="pb-10">{children}</div>
    </details>
  );
}

/**
 * A titled sub-block inside an open Technical Detail panel.
 *
 * These are the smallest units of the collapsed content — one registry, one
 * table, one paragraph — so the open panel is still navigable rather than a
 * single undifferentiated wall.
 */
export function DetailGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border-subtle pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-technical text-xs uppercase tracking-[0.2em] text-foreground">
        {label}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
