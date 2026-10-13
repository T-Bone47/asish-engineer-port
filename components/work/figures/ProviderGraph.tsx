import type { ProviderEntry } from "@/types/project";
import { EngineeringFigure } from "./EngineeringFigure";
import { EvidenceBadge } from "./EvidenceBadge";

/**
 * Provider graph — the abstraction diagram, drawn as an abstraction.
 *
 * N adapters at the top, exactly one contract in the middle, one canonical
 * model at the bottom. The single shared contract band is the whole point:
 * if a reader cannot see that everything above it is interchangeable and
 * everything below it is provider-blind, the diagram has failed.
 *
 * Width 100%, height fixed by the provider count so it never collapses.
 */
export function ProviderGraph({
  providers,
  contractLabel,
  contractDetail,
  outputLabel,
  outputDetail,
  figure,
}: {
  providers: ProviderEntry[];
  contractLabel: string;
  contractDetail: string;
  outputLabel: string;
  outputDetail: string;
  figure: number;
}) {
  if (providers.length === 0) return null;

  return (
    <EngineeringFigure
      number={figure}
      title="Provider abstraction"
      caption={`Each provider adapter implements one shared contract, so nothing downstream of it can tell which provider produced a payload. ${providers.length} adapters registered.`}
      fallback={
        <ol className="space-y-2">
          {providers.map((p) => (
            <li key={p.name} className="diagram-node">
              <span className="font-technical uppercase">{p.name}</span> — {p.role} ({EVIDENCE_TEXT[p.status]}).
            </li>
          ))}
          <li>
            All adapters return the same <code className="font-technical">{contractLabel}</code> shape:{" "}
            {contractDetail}.
          </li>
          <li>
            Everything above that contract is provider-specific; everything below it is canonical: {outputLabel} —
            {outputDetail}.
          </li>
        </ol>
      }
    >
      <div className="flex flex-col gap-3">
        {/* ---- N providers ---- */}
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <li
              key={p.name}
              className="border border-border-strong bg-surface px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-technical text-[11px] uppercase tracking-[0.1em] text-foreground">
                  {p.name}
                </span>
                <EvidenceBadge status={p.status} className="shrink-0" />
              </div>
              <p className="mt-1.5 font-body text-xs leading-relaxed text-foreground-muted">
                {p.role}
              </p>
            </li>
          ))}
        </ul>

        {/* ---- the collapse ---- */}
        <Collapse label="one contract" />

        {/* ---- the single contract ---- */}
        <div className="border-2 border-data bg-data-wash/40 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-display text-base uppercase tracking-tight text-data">
              {contractLabel}
            </span>
            <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-data/70">
              shared contract
            </span>
          </div>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-foreground-muted">
            {contractDetail}
          </p>
        </div>

        <Collapse label="canonical" />

        {/* ---- canonical output ---- */}
        <div className="border-2 border-accent bg-accent-wash/40 px-4 py-3">
          <span className="font-display text-base uppercase tracking-tight text-accent">
            {outputLabel}
          </span>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-foreground-muted">
            {outputDetail}
          </p>
        </div>
      </div>
    </EngineeringFigure>
  );
}

function Collapse({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-0.5" aria-hidden="true">
      <span className="h-px flex-1 bg-border-strong" />
      <span className="font-technical text-[10px] uppercase tracking-[0.25em] text-foreground-faint">
        ↓ {label}
      </span>
      <span className="h-px flex-1 bg-border-strong" />
    </div>
  );
}

const EVIDENCE_TEXT = {
  "live-verified": "exercised against the live provider",
  verified: "verified locally",
  implemented: "implemented and unit-tested",
  partial: "partially implemented",
  "not-run": "not run",
  blocked: "blocked",
  research: "research only",
  planned: "planned",
} as const;