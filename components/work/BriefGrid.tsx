import type { ProjectBrief } from "@/types/project";

/**
 * The 30-second case study (spec §08).
 *
 * Four fixed blocks — PROBLEM / WHAT I BUILT / TECHNICAL APPROACH /
 * RESULT — each one or two sentences, in the order a reader actually asks
 * the questions. This is the part of a case study that a hiring manager
 * reads in full, so it is deliberately a grid of short paragraphs rather
 * than a running narrative: four independent answers, none of which needs
 * the one before it.
 *
 * The layout is a two-by-two on wide screens and a single column below
 * `sm`, so on a phone the four blocks stack in the same reading order a
 * desktop reader scans across.
 */
const BLOCKS: { key: keyof ProjectBrief; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "built", label: "What I Built" },
  { key: "approach", label: "Technical Approach" },
  { key: "result", label: "Result & Evidence" },
];

export function BriefGrid({ brief }: { brief: ProjectBrief }) {
  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {BLOCKS.map((block) => (
        <div key={block.key} className="border-t border-border-strong pt-4">
          <dt className="font-technical text-[11px] uppercase tracking-[0.2em] text-accent">
            {block.label}
          </dt>
          <dd className="mt-3 font-body text-[15px] leading-relaxed text-foreground-muted">
            {brief[block.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
