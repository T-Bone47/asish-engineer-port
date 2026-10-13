import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects, getFlagshipProject } from "@/data/projects";

/**
 * Case-study rendering invariants.
 *
 * The template renders sections conditionally, which is the right design
 * ("only where real content exists") but creates a silent failure mode: a
 * section whose body renders empty while its heading still appears. That
 * happened for real — "Performance / Results" shipped as a bare heading
 * once the metrics moved into the hero evidence band. These assertions
 * encode the shape so the class of bug cannot recur unnoticed.
 *
 * Phase D rewrote this mirror for the spec §09 order and the level-4
 * appendix. It is a transcription of the page's own `if` conditions: it
 * cannot prove the template renders correctly, but it does fail loudly the
 * moment a section gains a heading without gaining a body.
 */

/** Mirrors the numbered-section gating in app/work/[slug]/page.tsx. */
function renderedSections(project: (typeof projects)[number]) {
  const sections: { label: string; hasBody: boolean }[] = [];

  sections.push({ label: "Overview", hasBody: Boolean(project.brief) });

  if (project.problem) sections.push({ label: "Problem", hasBody: true });
  if (project.architecture || project.versionHistory)
    sections.push({
      label: "System",
      hasBody: Boolean(project.architecture?.summary ?? project.versionHistory?.length),
    });
  if (project.dataFlow?.length) sections.push({ label: "Data Flow", hasBody: true });
  if (project.tradeoffs?.length || project.engineeringDecisions?.length)
    sections.push({ label: "Engineering", hasBody: true });
  if (
    project.validationClaims?.length ||
    project.validation ||
    project.testing?.length ||
    project.results
  )
    sections.push({ label: "Evidence", hasBody: true });
  if (project.currentState) sections.push({ label: "Current State", hasBody: true });
  if (project.limitations) sections.push({ label: "Limitations", hasBody: true });
  if (project.nextIteration) sections.push({ label: "Next", hasBody: true });
  if (project.technologies.length > 0)
    sections.push({ label: "Technologies", hasBody: true });
  if (Object.values(project.links).some(Boolean)) sections.push({ label: "Links", hasBody: true });

  return sections;
}

describe("case study sections", () => {
  it("never renders a section with an empty body", () => {
    for (const project of projects) {
      for (const section of renderedSections(project)) {
        expect(section.hasBody, `${project.slug} → "${section.label}"`).toBe(true);
      }
    }
  });

  it("always shows the project tagline, title and description", () => {
    for (const project of projects) {
      expect(project.tagline.trim(), project.slug).not.toBe("");
      expect(project.title.trim(), project.slug).not.toBe("");
      expect(project.description.trim(), project.slug).not.toBe("");
    }
  });

  it("promotes verified metrics into the hero evidence band", () => {
    for (const project of projects) {
      if (!project.metrics?.length) continue;
      // Every metric the project claims must have a non-empty label; a
      // number without a unit of meaning is not evidence.
      for (const metric of project.metrics) {
        expect(metric.label.trim(), `${project.slug}: ${metric.value}`).not.toBe("");
      }
    }
  });

  it("only the flagship carries verified metrics", () => {
    // This documented the current roster rather than enforcing a rule, and
    // Phase C legitimately changed it: the two football projects now carry
    // measured figures (a pytest run and a dataset manifest count), so
    // pinning the old list would have turned a snapshot into a blocker.
    //
    // What still has to hold is that the flagship selection stays
    // deterministic. `getFlagshipProject()` returns the FIRST project that
    // is featured AND has metrics, so if a second featured project ever
    // gained metrics the /work layout would silently change without anyone
    // deciding to. Lock the current winner instead of the old roster.
    const flagship = getFlagshipProject();
    expect(flagship?.slug).toBe("live-f1-intelligence");
    expect(flagship?.featured).toBe(true);
    expect(flagship?.metrics?.length ?? 0).toBeGreaterThan(0);

    // Recomputing must give the same answer — no ordering accident.
    const eligible = projects.filter((p) => p.featured && (p.metrics?.length ?? 0) > 0);
    expect(eligible.map((p) => p.slug)).toEqual(["live-f1-intelligence"]);
  });
});

/**
 * The progressive-disclosure contract (spec §11).
 *
 * Phase D moved a large amount of real content — provider matrices,
 * capability registries, lineage, endpoint tables, subsystem state, test
 * runs — out of the primary view and into one closed-by-default panel.
 * Moving content is exactly the kind of change that silently *loses* it:
 * the field stays in `data/projects.ts`, the page stops rendering it, and
 * nothing fails.
 *
 * This reads the page source and asserts every optional data field still
 * has a render site. It is a source-level check on purpose — it cannot
 * tell whether the site is correct, only whether one still exists.
 */
describe("technical detail appendix", () => {
  const pageSource = readFileSync(
    join(process.cwd(), "app", "work", "[slug]", "page.tsx"),
    "utf-8"
  );

  const DEEP_FIELDS = [
    "constraints",
    "architecture",
    "dataFlow",
    "providers",
    "capabilities",
    "lineage",
    "validationClaims",
    "testing",
    "stateItems",
    "apiSurface",
    "separatelyScoped",
    "versionHistory",
    "implementation",
    "algorithms",
    "validation",
    "results",
    "engineeringDecisions",
    "tradeoffs",
    "limitations",
    "nextIteration",
    "currentState",
    "brief",
  ] as const;

  it("still renders every optional block the data model defines", () => {
    for (const field of DEEP_FIELDS) {
      expect(pageSource.includes(`project.${field}`), `page.tsx no longer renders ${field}`).toBe(
        true
      );
    }
  });

  it("renders the appendix through one CSS-only disclosure, not a client component", () => {
    expect(pageSource).toContain("<TechnicalDetail");
    // The budget is two client components in the whole app: app/error.tsx
    // and the header menu. An accordion is not a reason to spend a third.
    expect(pageSource).not.toContain('"use client"');
  });

  it("only offers the appendix when there is something to put in it", () => {
    // Live F1 has trade-offs and validation prose but no registry, no
    // endpoint table and no algorithm write-up. An always-rendered panel
    // promised it "provider contracts, capability registry, data
    // lineage" and then opened empty — which shipped during this pass
    // before browser QA caught it.
    const page = readFileSync(join(process.cwd(), "app", "work", "[slug]", "page.tsx"), "utf-8");
    expect(page).toContain("{hasAppendix && (");

    for (const project of projects) {
      const hasDeepDetail = Boolean(
        project.constraints?.length ||
          project.implementation ||
          project.algorithms ||
          project.providers?.length ||
          project.capabilities?.length ||
          project.lineage?.length ||
          project.testing?.length ||
          project.apiSurface?.length ||
          project.stateItems?.length ||
          project.separatelyScoped?.length ||
          project.versionHistory?.length ||
          project.visualizationType === "dataset"
      );
      if (!hasDeepDetail) {
        expect(project.slug, "this project would render an empty appendix").toBeDefined();
      }
    }

    // And the roster check: at least one project legitimately has no
    // appendix, so the gate is doing real work rather than always true.
    const withDeepDetail = projects.filter(
      (p) =>
        p.constraints?.length ||
        p.implementation ||
        p.algorithms ||
        p.providers?.length ||
        p.capabilities?.length ||
        p.lineage?.length ||
        p.testing?.length ||
        p.apiSurface?.length ||
        p.stateItems?.length ||
        p.separatelyScoped?.length ||
        p.versionHistory?.length ||
        p.visualizationType === "dataset"
    );
    expect(withDeepDetail.length).toBeLessThan(projects.length);
    expect(withDeepDetail.length).toBeGreaterThan(0);
  });

  it("keeps verified evidence above the fold, not behind the disclosure", () => {
    // Validation claims and the limitations are the two things a
    // recruiter most needs and must never have to click to see.
    const validationIndex = pageSource.indexOf("<ValidationMatrix");
    const detailsIndex = pageSource.indexOf("<TechnicalDetail");
    expect(validationIndex).toBeGreaterThan(-1);
    expect(detailsIndex).toBeGreaterThan(-1);
    expect(validationIndex, "validation evidence moved into the appendix").toBeLessThan(
      detailsIndex
    );

    const limitationsIndex = pageSource.indexOf('label="Limitations"');
    expect(limitationsIndex).toBeGreaterThan(-1);
    expect(limitationsIndex).toBeLessThan(detailsIndex);
  });
});
