import type {
  ApiEndpoint,
  Constraint,
  ScopedAside,
  StateItem,
  TestEvidence,
  ValidationClaim,
} from "@/types/project";
import { EngineeringFigure } from "./EngineeringFigure";
import { EvidenceBadge, EVIDENCE_LABEL } from "./EvidenceBadge";

/**
 * Validation matrix — a claim, and how strongly it is backed.
 *
 * Structured as a two-column list rather than prose so a reader can scan
 * down the status column and see at a glance which parts of the system
 * have actually been exercised and which have only been written.
 */
export function ValidationMatrix({
  claims,
  figure,
}: {
  claims: ValidationClaim[];
  figure: number;
}) {
  if (claims.length === 0) return null;

  return (
    <EngineeringFigure
      number={figure}
      title="Validation evidence"
      caption={`${claims.length} validation categories. Each carries the strongest evidence that actually exists for it — a unit test is not the same claim as a live call, and this table never conflates them.`}
      fallback={
        <ul className="space-y-2">
          {claims.map((c) => (
            <li key={c.label}>
              <span className="font-technical uppercase">{c.label}</span> — {EVIDENCE_LABEL[c.status]}. {c.detail}
            </li>
          ))}
        </ul>
      }
    >
      <ul className="divide-y divide-[color:var(--color-border-subtle)]">
        {claims.map((claim) => (
          <li
            key={claim.label}
            className="diagram-node grid grid-cols-1 gap-x-6 gap-y-2 py-3.5 sm:grid-cols-12"
          >
            <div className="sm:col-span-4">
              <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground">
                {claim.label}
              </span>
            </div>
            <div className="sm:col-span-2">
              <EvidenceBadge status={claim.status} />
            </div>
            <div className="sm:col-span-6">
              <p className="font-body text-sm leading-relaxed text-foreground-muted">
                {claim.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </EngineeringFigure>
  );
}

/**
 * Test evidence — a table of runs that were actually executed.
 *
 * The `failed` and `skipped` columns are the point. A test count printed
 * without them reads as a clean sheet whether or not it is one, and the
 * whole Phase C brief is that this must not happen. Where tests were
 * skipped, `skippedBecause` is mandatory and rendered inline, because
 * "3 skipped" without a reason is indistinguishable from a problem.
 */
export function TestEvidenceTable({ runs }: { runs: TestEvidence[] }) {
  if (runs.length === 0) return null;

  return (
    <div className="space-y-5">
      {runs.map((run) => (
        <div key={`${run.suite}-${run.verifiedOn}`} className="border border-border-subtle bg-surface/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
            <span className="font-display text-base uppercase tracking-tight">{run.suite}</span>
            <span className="font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
              Executed {run.verifiedOn}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Stat value={String(run.total)} label="Collected" tone="faint" />
            <Stat value={String(run.passed)} label="Passed" tone="live" />
            <Stat
              value={String(run.failed)}
              label="Failed"
              tone={run.failed > 0 ? "critical" : "faint"}
            />
            <Stat
              value={String(run.skipped)}
              label="Skipped"
              tone={run.skipped > 0 ? "data" : "faint"}
            />
          </dl>

          <div className="mt-4 space-y-2 border-t border-border-subtle pt-3.5">
            <p className="font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
              Command
            </p>
            <code className="block overflow-x-auto border border-border-subtle bg-background px-3 py-2 font-technical text-[11px] text-foreground-muted">
              {run.command}
            </code>
            {run.skipped > 0 && run.skippedBecause && (
              <p className="font-body text-sm leading-relaxed text-foreground-muted">
                <span className="font-technical text-[10px] uppercase tracking-[0.15em] text-data">
                  Why {run.skipped} skipped ·{" "}
                </span>
                {run.skippedBecause}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "live" | "critical" | "data" | "faint";
}) {
  const cls = {
    live: "text-live",
    critical: "text-critical",
    data: "text-data",
    faint: "text-foreground-muted",
  }[tone];

  return (
    <div>
      <dt className="font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
        {label}
      </dt>
      <dd className={`mt-1 font-display text-3xl leading-none tabular-nums ${cls}`}>{value}</dd>
    </div>
  );
}

/** Subsystem-by-subsystem current state. */
export function StateBlock({ items }: { items: StateItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="max-w-3xl divide-y divide-[color:var(--color-border-subtle)] border-y border-[color:var(--color-border-subtle)]">
      {items.map((item) => (
        <li
          key={item.label}
          className="diagram-node grid grid-cols-1 gap-x-6 gap-y-1.5 py-4 sm:grid-cols-12"
        >
          <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground sm:col-span-4">
            {item.label}
          </span>
          <span className="sm:col-span-3">
            <EvidenceBadge status={item.status} />
          </span>
          <span className="font-body text-sm leading-relaxed text-foreground-muted sm:col-span-5">
            {item.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Real HTTP endpoints, copied from the project's route table. */
export function ApiSurface({ endpoints }: { endpoints: ApiEndpoint[] }) {
  if (endpoints.length === 0) return null;

  return (
    <ul className="max-w-3xl border-y border-[color:var(--color-border-subtle)]">
      {endpoints.map((endpoint) => (
        <li
          key={`${endpoint.method} ${endpoint.path}`}
          className="grid grid-cols-1 gap-x-6 gap-y-1.5 border-b border-[color:var(--color-border-subtle)] py-3 last:border-b-0 sm:grid-cols-12"
        >
          <code className="font-technical text-[11px] text-accent sm:col-span-4">
            <span className="text-foreground-faint">{endpoint.method}</span> {endpoint.path}
          </code>
          <span className="font-body text-sm leading-relaxed text-foreground-muted sm:col-span-6">
            {endpoint.purpose}
          </span>
          <span className="sm:col-span-2">
            {endpoint.verified && <EvidenceBadge status={endpoint.verified} />}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Boundary conditions the design is built around — distinct from trade-offs,
 *  which are choices. */
export function ConstraintList({ constraints }: { constraints: Constraint[] }) {
  if (constraints.length === 0) return null;

  return (
    <dl className="grid max-w-3xl grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {constraints.map((c) => (
        <div key={c.label} className="border-t border-border-strong pt-3.5">
          <dt className="font-technical text-[11px] uppercase tracking-[0.15em] text-accent">
            {c.label}
          </dt>
          <dd className="mt-1.5 font-body text-sm leading-relaxed text-foreground-muted">
            {c.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A subsystem deliberately kept *out* of the main system.
 *
 * Kept visually separate on purpose. The most misleading thing a portfolio
 * can do here is let a research track sit inside the product diagram,
 * because a reader scanning quickly will count it as shipped functionality.
 */
export function ScopedAsideCard({ aside }: { aside: ScopedAside }) {
  return (
    <div className="max-w-3xl border border-dashed border-border-strong bg-surface/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-display text-base uppercase tracking-tight text-foreground-muted">
          {aside.title}
        </span>
        <EvidenceBadge status={aside.status} />
        <span className="font-technical text-[10px] uppercase tracking-[0.18em] text-foreground-faint">
          Not part of the active system
        </span>
      </div>
      <p className="mt-3 font-body text-sm leading-relaxed text-foreground-muted">{aside.body}</p>
    </div>
  );
}