import type { ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Status display text — spec's own labels (§3 of the Phase 2 prompt),
 * not reworded. Order matches types/project.ts's ProjectStatus union.
 */
export const STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: "COMPLETED",
  active: "ACTIVE",
  "near-completion": "NEAR COMPLETION",
  "in-development": "IN DEVELOPMENT",
  experimental: "EXPERIMENTAL",
};

/**
 * Deliberately restrained: only "active" gets the accent (telemetry
 * green is reserved for "active state, telemetry, system status" per
 * spec §5 — a status badge for every other value shouldn't invent four
 * more colors just to look busier). Every other status reads through
 * text and a neutral dot, not a color-coded traffic light.
 */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const isActive = status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-technical text-xs uppercase tracking-[0.15em]",
        // Active uses the reserved "live" green, not the brand accent.
        // The accent now carries hierarchy; letting "active" also use it
        // would make a status chip compete with a CTA for attention.
        isActive ? "text-live" : "text-foreground-muted",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-live" : "bg-foreground-faint"
        )}
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
