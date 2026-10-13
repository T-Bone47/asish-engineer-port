import type { EvidenceStatus } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Evidence status → presentation.
 *
 * Every strong claim on this portfolio carries one of these. The colour
 * mapping is deliberately conservative: green is reserved for
 * `live-verified` alone ("we actually ran it against the real thing"),
 * because spending green on merely-written code would make the badge
 * meaningless. That reservation is the same rule the source repositories
 * follow with their `available` / `last_verified` columns.
 */
const TONE: Record<EvidenceStatus, { text: string; dot: string; ring: string }> = {
  "live-verified": { text: "text-live", dot: "bg-live", ring: "border-live/40" },
  verified: { text: "text-live", dot: "bg-live/70", ring: "border-live/25" },
  implemented: { text: "text-data", dot: "bg-data", ring: "border-data/35" },
  partial: { text: "text-data", dot: "bg-data/60", ring: "border-data/25" },
  "not-run": { text: "text-foreground-faint", dot: "bg-foreground-faint", ring: "border-border-strong" },
  blocked: { text: "text-critical", dot: "bg-critical", ring: "border-critical/40" },
  research: { text: "text-foreground-muted", dot: "bg-foreground-muted", ring: "border-border-strong" },
  planned: { text: "text-foreground-faint", dot: "bg-foreground-faint/60", ring: "border-border-strong" },
};

export const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  "live-verified": "Live verified",
  verified: "Verified",
  implemented: "Implemented",
  partial: "Partial",
  "not-run": "Not run",
  blocked: "Blocked",
  research: "Research",
  planned: "Planned",
};

/** Small inline status chip. The dot is decorative; the word carries it. */
export function EvidenceBadge({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  const tone = TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-1.5 py-0.5 font-technical text-[10px] uppercase tracking-[0.12em]",
        tone.ring,
        tone.text,
        className
      )}
    >
      <span aria-hidden="true" className={cn("h-1 w-1 rounded-full", tone.dot)} />
      {EVIDENCE_LABEL[status]}
    </span>
  );
}

/**
 * Key/legend explaining what the status vocabulary means, rendered once
 * beneath the first figure that uses it. Without it the badges are
 * decoration; with it they are a claim about evidence strength.
 */
export function EvidenceLegend({ className }: { className?: string }) {
  return (
    <dl className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {(
        [
          ["live-verified", "executed against the real external system"],
          ["verified", "run and observed locally"],
          ["implemented", "code exists and is unit-tested"],
          ["planned", "defined, deliberately not executed"],
        ] as [EvidenceStatus, string][]
      ).map(([status, meaning]) => (
        <div key={status} className="flex items-baseline gap-2">
          <dt className="shrink-0">
            <EvidenceBadge status={status} />
          </dt>
          <dd className="font-body text-xs text-foreground-faint">{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}