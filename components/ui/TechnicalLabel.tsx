import { cn } from "@/lib/utils";

/**
 * Small uppercase monospace caption — the recurring "instrumentation"
 * label used for section eyebrows, categories, coordinates, and other
 * short technical metadata. Spec §6: technical type role is for
 * "telemetry, metrics, metadata, coordinates, system labels."
 *
 * Forwards `id` and ARIA attributes so a label can be wired to the
 * section it names via `aria-labelledby` — previously impossible, which
 * meant a labelled section had to duplicate its heading as plain text.
 */
export function TechnicalLabel({
  children,
  className,
  as: Tag = "span",
  id,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
  id?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-technical text-xs uppercase tracking-[0.2em] text-foreground-faint",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}