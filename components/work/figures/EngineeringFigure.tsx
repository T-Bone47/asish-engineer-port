/**
 * The shell every engineering figure in the case-study template renders
 * inside.
 *
 * An architecture diagram with no text fallback is a picture of a system
 * to a screen-reader user, not a description of one. So this wrapper
 * forces three things on every figure: a real <figcaption>, an
 * aria-describedby description, and — where the visual carries meaning
 * the caption cannot — an explicit `fallback` list that renders the same
 * information as text.
 *
 * Figures are also numbered (`Fig. 03`), because that is the register an
 * engineering document uses and it lets prose reference them.
 */
export function EngineeringFigure({
  number,
  title,
  caption,
  fallback,
  children,
  className,
}: {
  /** Global figure number, e.g. 3 → "Fig. 03". */
  number: number;
  /** Short figure title, used as the accessible name. */
  title: string;
  /** Caption text under the figure. */
  caption?: string;
  /**
   * Plain-text restatement of whatever the drawing encodes. Rendered as a
   * <details> block so it stays available to assistive tech and to
   * everyone else without adding permanent visual noise.
   */
  fallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = `fig-${number}-title`;
  const descId = `fig-${number}-desc`;

  return (
    <figure
      className={className}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="border border-border-subtle bg-surface/40 p-4 sm:p-5">
        {children}
      </div>

      <figcaption className="mt-3">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-technical text-[11px] uppercase tracking-[0.2em]">
          <span className="text-accent">Fig. {String(number).padStart(2, "0")}</span>
          <span className="text-foreground-faint" id={titleId}>
            {title}
          </span>
        </span>
        {caption && (
          <p className="mt-1.5 max-w-2xl font-body text-sm leading-relaxed text-foreground-muted" id={descId}>
            {caption}
          </p>
        )}
        {!caption && (
          <p className="sr-only" id={descId}>
            {title}
          </p>
        )}
      </figcaption>

      {fallback && (
        <details className="mt-3 border-l-2 border-border-strong pl-4">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint transition-colors hover:text-foreground">
            Read this figure as text
          </summary>
          <div className="pb-2 font-body text-sm leading-relaxed text-foreground-muted">
            {fallback}
          </div>
        </details>
      )}
    </figure>
  );
}