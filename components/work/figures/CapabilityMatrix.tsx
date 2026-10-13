import type { CapabilityRow, LineageStep } from "@/types/project";
import { EngineeringFigure } from "./EngineeringFigure";

/**
 * Capability matrix — rendered from real registry rows, not invented ones.
 *
 * The two booleans are independent and that independence is the entire
 * point: "the provider documents this" and "we have successfully called
 * it" are different claims, and collapsing them into one "supported" tick
 * is the most common way a capability inventory becomes a lie.
 *
 * A cell reading *documented · never called* is therefore rendered as
 * information, not as an omission. Source registry rows are reproduced
 * exactly as stored — including rows marked unavailable, because "this
 * provider does not expose this" is a real answer.
 */
export function CapabilityMatrix({
  rows,
  figure,
  caption,
}: {
  rows: CapabilityRow[];
  figure: number;
  caption?: string;
}) {
  if (rows.length === 0) return null;

  const providers = Array.from(new Set(rows.map((r) => r.provider)));
  const resources = Array.from(new Set(rows.map((r) => r.resource)));

  return (
    <EngineeringFigure
      number={figure}
      title="Provider capability registry"
      caption={
        caption ??
        `${rows.length} registry rows across ${providers.length} providers. "Documented" is what the provider publishes; "live verified" means a real call returned successfully. Cells are never merged into a single tick.`
      }
      fallback={
        <ul className="space-y-2">
          {providers.map((provider) => (
            <li key={provider} className="diagram-node">
              <span className="font-technical uppercase">{provider}</span>:{" "}
              {resources
                .map((resource) => {
                  const row = rows.find((r) => r.provider === provider && r.resource === resource);
                  if (!row) return null;
                  const state = !row.supported
                    ? "not exposed"
                    : row.verified
                      ? "live verified"
                      : "documented, never called";
                  return `${resource} (${state}${row.evidence ? `, ${row.evidence}` : ""})`;
                })
                .filter(Boolean)
                .join("; ")}
              .
            </li>
          ))}
        </ul>
      }
    >
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            Provider by resource capability registry. Documented support and live
            verification are shown as separate columns because they are separate claims.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[30%] pb-3 pr-4 font-technical text-[10px] uppercase tracking-[0.18em] text-foreground-faint">
                Provider
              </th>
              <th scope="col" className="w-[22%] pb-3 pr-4 font-technical text-[10px] uppercase tracking-[0.18em] text-foreground-faint">
                Resource
              </th>
              <th scope="col" className="w-[20%] pb-3 pr-4 font-technical text-[10px] uppercase tracking-[0.18em] text-foreground-faint">
                Documented
              </th>
              <th scope="col" className="w-[28%] pb-3 font-technical text-[10px] uppercase tracking-[0.18em] text-foreground-faint">
                Live verified
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.provider}:${row.resource}`}
                className="border-t border-border-subtle align-top"
              >
                <th
                  scope="row"
                  className="py-2.5 pr-4 font-body text-sm font-normal text-foreground"
                >
                  {row.provider}
                </th>
                <td className="py-2.5 pr-4 font-technical text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
                  {row.resource}
                </td>
                <td className="py-2.5 pr-4">
                  <Cell state={row.supported ? "yes" : "no"} />
                </td>
                <td className="py-2.5">
                  {row.verified ? (
                    <span className="inline-flex flex-col gap-0.5">
                      <Cell state="yes" live />
                      {row.evidence && (
                        <span className="font-technical text-[10px] text-foreground-faint">
                          {row.evidence}
                        </span>
                      )}
                    </span>
                  ) : (
                    <Cell state={row.supported ? "never" : "n/a"} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EngineeringFigure>
  );
}

function Cell({
  state,
  live,
}: {
  state: "yes" | "no" | "never" | "n/a";
  live?: boolean;
}) {
  const map = {
    yes: {
      label: live ? "verified" : "documented",
      className: live ? "text-live" : "text-foreground-muted",
      mark: "●",
    },
    no: { label: "not exposed", className: "text-foreground-faint", mark: "—" },
    never: { label: "never called", className: "text-foreground-faint", mark: "○" },
    "n/a": { label: "—", className: "text-foreground-faint", mark: "—" },
  } as const;
  const t = map[state];

  return (
    <span className={`inline-flex items-center gap-1.5 font-technical text-[10px] uppercase tracking-[0.12em] ${t.className}`}>
      <span aria-hidden="true">{t.mark}</span>
      {t.label}
    </span>
  );
}

/**
 * Data lineage — the provenance chain, drawn as a chain.
 *
 * Each step records something the previous one cannot recover on its own:
 * which source, which run, which immutable snapshot (content-addressed),
 * which canonical record, and which consumer read it. That chain is the
 * argument for provenance existing at all — without the run and the hash,
 * a wrong number in a report cannot be traced back to the bytes that
 * produced it.
 */
export function DataLineage({
  steps,
  figure,
  caption,
}: {
  steps: LineageStep[];
  figure: number;
  caption?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <EngineeringFigure
      number={figure}
      title="Data lineage"
      caption={
        caption ??
        "Every canonical record is reachable back to the exact bytes it was derived from. Removing any link in the chain breaks reproducibility for that record."
      }
      fallback={
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s.label}>
              <span className="font-technical uppercase">{s.label}</span>
              {i < steps.length - 1 && <span aria-hidden="true"> → </span>}
              {i === steps.length - 1 && " — end of chain."} {s.detail}
              {s.fields && s.fields.length > 0 && (
                <span className="text-foreground-faint"> Records: {s.fields.join(", ")}.</span>
              )}
            </li>
          ))}
        </ol>
      }
    >
      {/* Each `li` owns its arrowhead, so the `↓` rides that node's own
          `.diagram-node` entry window instead of floating between two. The
          chain still draws its connectors on their own window; the direction
          cue now lands with the record it departs from, which is what makes a
          provenance chain read as a chain and not as a stack of boxes. */}
      <ol className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
            key={step.label}
            className="diagram-node grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-12"
          >
              <div className="sm:col-span-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface font-technical text-[10px] tabular-nums text-foreground-muted"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={
                      isLast
                        ? "font-display text-base uppercase tracking-tight text-accent"
                        : "font-technical text-[11px] uppercase tracking-[0.15em] text-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-7">
                <p className="font-body text-sm leading-relaxed text-foreground-muted">
                  {step.detail}
                </p>
                {step.fields && step.fields.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {step.fields.map((f) => (
                      <li
                        key={f}
                        className="border border-border-subtle px-1.5 py-0.5 font-technical text-[10px] tracking-[0.05em] text-foreground-faint"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {!isLast && (
                <div className="col-span-1 sm:col-span-12" aria-hidden="true">
                  <div className="flex items-center gap-3 py-1.5">
                    <span className="h-px w-5 bg-border-strong" />
                    <span className="connector-arrow font-technical text-[10px] leading-none text-border-strong">
                      ↓
                    </span>
                    <span className="h-px flex-1 bg-border-subtle" />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </EngineeringFigure>
  );
}