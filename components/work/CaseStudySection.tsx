import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/** Consistent eyebrow + heading + content wrapper for every case-study
 *  section — spec §13's sections "may be omitted when verified content
 *  does not exist," which callers handle by simply not rendering this.
 *
 *  `.reveal` gives every case-study section the same scroll-driven arrival
 *  the homepage sections already had (globals.css), so a reader moving from
 *  `/` into a case study meets one motion language rather than two. It is a
 *  CSS class on a server component: no client boundary, and content is
 *  visible by default because the hidden state only exists inside the
 *  `@supports` + reduced-motion opt-in blocks. */
export function CaseStudySection({
  label,
  index,
  id,
  children,
}: {
  label: string;
  /** Two-digit position in the standard case-study order (spec §09). */
  index?: string;
  /** Anchor target, so the hero's primary action can deep-link a section. */
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="reveal border-t border-border-subtle py-12 first:border-t-0 first:pt-0"
    >
      <h2 className="flex items-baseline gap-3">
        {index && (
          <span
            aria-hidden="true"
            className="font-technical text-xs tabular-nums text-foreground-faint"
          >
            {index}
          </span>
        )}
        <TechnicalLabel as="span" className="text-accent">
          {label}
        </TechnicalLabel>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
