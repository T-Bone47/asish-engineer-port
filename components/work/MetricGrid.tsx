import type { Metric } from "@/types/project";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { cn } from "@/lib/utils";

/**
 * Metric readout.
 *
 * These are the only verified figures on the entire site, so they are
 * treated as instrument readouts rather than as stat cards: hairline
 * separators instead of boxes, tabular figures, and the unit typeset
 * smaller than the number so the eye lands on the magnitude first.
 *
 * `1,067,193` → value, no unit
 * `~0.10 ms`  → value `~0.10`, unit `ms` set smaller and dimmer
 * `99 MB`     → value `99`,    unit `MB`
 *
 * The `band` variant is a single horizontal strip for the case-study hero,
 * where the evidence must be visible before the reader scrolls. The `grid`
 * variant is the in-section presentation.
 *
 * NOTE: these values are rendered verbatim from `data/projects.ts`. There
 * is no client-side formatting, rounding, or "improvement" — an
 * instrument that adjusts its own readings is not an instrument.
 */

const METRIC_PATTERN = /^([~≈<>]*\s?)([\d.,]+)(\s*[a-zA-Z/%°µ]*)$/;

function splitMetric(value: string): { number: string; unit: string } {
  const match = METRIC_PATTERN.exec(value.trim());
  if (!match) return { number: value, unit: "" };
  return {
    number: `${match[1] ?? ""}${match[2] ?? ""}`.trim(),
    unit: (match[3] ?? "").trim(),
  };
}

export function MetricGrid({
  metrics,
  variant = "grid",
  className,
}: {
  metrics: Metric[];
  /** "band" — single horizontal strip (hero). "grid" — in-section. */
  variant?: "band" | "grid";
  className?: string;
}) {
  if (metrics.length === 0) return null;

  if (variant === "band") {
    return (
      <dl
        className={cn(
          "grid grid-cols-2 gap-x-6 gap-y-6 border-y border-border-subtle py-8 sm:grid-cols-3 lg:grid-cols-5",
          className
        )}
      >
        {metrics.map((metric) => {
          const { number, unit } = splitMetric(metric.value);
          return (
            <div key={metric.label}>
              <dd className="font-technical text-2xl leading-none tabular-nums text-accent md:text-3xl">
                {number}
                {unit && (
                  <span className="ml-1 text-base text-foreground-faint md:text-lg">{unit}</span>
                )}
              </dd>
              <dt className="mt-2.5 font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
                {metric.label}
              </dt>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3",
        className
      )}
    >
      {metrics.map((metric) => {
        const { number, unit } = splitMetric(metric.value);
        return (
          <div
            key={metric.label}
            className="border-t border-border-strong pt-4"
          >
            <dd className="font-technical text-3xl leading-none tabular-nums text-accent md:text-4xl">
              {number}
              {unit && (
                <span className="ml-1 text-lg text-foreground-faint md:text-xl">{unit}</span>
              )}
            </dd>
            <dt className="mt-3">
              <TechnicalLabel>{metric.label}</TechnicalLabel>
            </dt>
            {metric.note && (
              <p className="mt-1.5 font-body text-xs text-foreground-faint">{metric.note}</p>
            )}
          </div>
        );
      })}
    </dl>
  );
}