import type { VersionEntry } from "@/types/project";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "./EvidenceBadge";

/**
 * Version wall — the dominant motif for version-aware systems.
 *
 * The failure this exists to prevent: describing FC26 and FC27 as one
 * undifferentiated "FC dataset". They are not. One is a completed 16,228-row
 * baseline the engine serves today; the other is active work with zero rows
 * imported and a deliberate HTTP 404 wall so nothing gets silently
 * substituted. Rendering them as two equal blocks would flatten exactly
 * the distinction that matters most.
 *
 * So the wall is asymmetric on purpose: the baseline is closed and settled,
 * the active line is open, and the seam between them is the subject of the
 * figure.
 */
export function VersionWall({
  versions,
  compact = false,
}: {
  versions: VersionEntry[];
  /**
   * Compact mode drops the shipped/in-progress/blocked buckets and keeps
   * the seam, the status and the measured stats.
   *
   * The full wall is fourteen bullet points of per-version bookkeeping, and
   * putting it above the fold is what made the EA FC page read as internal
   * documentation. Splitting it means the version story stays visible in the
   * main view and the detail sits in the technical appendix instead —
   * `VersionBuckets` renders the other half, with nothing repeated between
   * them.
   */
  compact?: boolean;
}) {
  if (versions.length === 0) return null;

  return (
    <ol className="space-y-0" aria-label={`Version history: ${versions.length} release lines`}>
      {versions.map((entry, i) => {
        const isBaseline = entry.role === "baseline";
        const isLast = i === versions.length - 1;

        return (
          <li
            key={entry.version}
            className="diagram-node relative grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8"
          >
            {/* ---------- the wall itself ---------- */}
            <div className="md:col-span-4">
              <div
                className={cn(
                  "border-l-2 py-3 pl-5",
                  isBaseline ? "border-live/60" : "border-accent"
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span
                    className={cn(
                      "font-display text-4xl uppercase leading-none tracking-tight md:text-5xl",
                      isBaseline ? "text-foreground" : "text-accent"
                    )}
                  >
                    {entry.version}
                  </span>
                  <span
                    className={cn(
                      "font-technical text-[11px] uppercase tracking-[0.2em]",
                      isBaseline ? "text-live" : "text-accent"
                    )}
                  >
                    {entry.role === "baseline" ? "Baseline" : "Active"}
                  </span>
                </div>

                <p className="mt-2 font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                  {entry.headline}
                </p>

                <div className="mt-3">
                  <EvidenceBadge status={entry.status} />
                </div>
              </div>
            </div>

            {/* ---------- what is actually true of that line ---------- */}
            <div className="md:col-span-8">
              <p className="max-w-xl font-body text-[15px] leading-relaxed text-foreground-muted">
                {entry.summary}
              </p>

              {entry.stats && entry.stats.length > 0 && (
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                  {entry.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
                        {stat.label}
                      </dt>
                      <dd
                        className={cn(
                          "mt-1 font-display text-2xl leading-none tabular-nums",
                          isBaseline ? "text-foreground" : "text-accent"
                        )}
                      >
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {!compact && (
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                  <VersionBucket
                    title="Shipped"
                    items={entry.completed}
                    tone="live"
                    empty={isBaseline ? undefined : "Nothing shipped on this line yet."}
                  />
                  <VersionBucket title="In progress" items={entry.active} tone="accent" />
                  {entry.planned && entry.planned.length > 0 && (
                    <VersionBucket title="Defined, not executed" items={entry.planned} tone="faint" />
                  )}
                  {entry.blocked && entry.blocked.length > 0 && (
                    <VersionBucket title="Blocked" items={entry.blocked} tone="critical" />
                  )}
                </div>
              )}
            </div>

            {/* ---------- the seam ---------- */}
            {!isLast && (
              <div className="col-span-1 md:col-span-12" aria-hidden="true">
                <div className="flex items-center gap-3 py-4">
                  <span className="h-px flex-1 bg-border-strong" />
                  <span className="font-technical text-[10px] uppercase tracking-[0.25em] text-foreground-faint">
                    ↓ version wall · data never crosses
                  </span>
                  <span className="h-px flex-1 bg-border-strong" />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The bookkeeping half of the version wall — what shipped, what is in
 * progress, what is defined but deliberately not executed, and what is
 * blocked. Rendered inside the technical-detail panel so the version story
 * itself can stay in the main view.
 */
export function VersionBuckets({ versions }: { versions: VersionEntry[] }) {
  if (versions.length === 0) return null;

  return (
    <div className="space-y-8">
      {versions.map((entry) => (
        <div key={entry.version}>
          <p className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground">
            {entry.version} · {entry.headline}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <VersionBucket
              title="Shipped"
              items={entry.completed}
              tone="live"
              empty={entry.role === "baseline" ? undefined : "Nothing shipped on this line yet."}
            />
            <VersionBucket title="In progress" items={entry.active} tone="accent" />
            {entry.planned && entry.planned.length > 0 && (
              <VersionBucket title="Defined, not executed" items={entry.planned} tone="faint" />
            )}
            {entry.blocked && entry.blocked.length > 0 && (
              <VersionBucket title="Blocked" items={entry.blocked} tone="critical" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VersionBucket({
  title,
  items,
  tone,
  empty,
}: {
  title: string;
  items?: string[];
  tone: "live" | "accent" | "faint" | "critical";
  empty?: string;
}) {
  const marker: Record<typeof tone, string> = {
    live: "bg-live",
    accent: "bg-accent",
    faint: "bg-foreground-faint",
    critical: "bg-critical",
  };
  const heading: Record<typeof tone, string> = {
    live: "text-live",
    accent: "text-accent",
    faint: "text-foreground-faint",
    critical: "text-critical",
  };

  const list = items ?? [];

  return (
    <div>
      <p className={cn("font-technical text-[10px] uppercase tracking-[0.18em]", heading[tone])}>
        {title}
      </p>
      {list.length > 0 ? (
        <ul className="mt-2.5 space-y-1.5">
          {list.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden="true" className={cn("mt-[7px] h-1 w-1 shrink-0 rounded-full", marker[tone])} />
              <span className="font-body text-sm leading-relaxed text-foreground-muted">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        empty && <p className="mt-2 font-body text-sm text-foreground-faint">{empty}</p>
      )}
    </div>
  );
}