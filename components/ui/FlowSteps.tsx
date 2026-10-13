import { cn } from "@/lib/utils";

/** Renders a sequence like "DATA → MODELS → SYSTEMS" — used wherever
 *  the spec gives an explicit pipeline of steps (§18, §20). */
export function FlowSteps({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span className="font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted">
            {step}
          </span>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
