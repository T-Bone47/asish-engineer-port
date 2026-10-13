import { describe, expect, it } from "vitest";
import {
  projects,
  getProjectBySlug,
  getNextProject,
  featuredProjects,
  getFlagshipProject,
  getIndexProjects,
} from "@/data/projects";
import type {
  ProjectCategory,
  ProjectStatus,
  VisualizationType,
} from "@/types/project";

const VALID_STATUS: ProjectStatus[] = [
  "completed",
  "active",
  "near-completion",
  "in-development",
  "experimental",
];

// "data-platform" was added in Phase C for Football Intelligence OS, which
// is a data-infrastructure system rather than an AI/ML model — classifying
// it as "ai-ml" would have misdescribed what it is.
//
// "enterprise-grc" was added for Sentinel AI for the same reason: it is a
// governance/risk/compliance platform whose core answers are deterministic
// and whose repository states no LLM is configured, so "ai-ml" would have
// overstated it and "data-platform" would have described its plumbing
// rather than its purpose.
// "voice" was added for F1 Voice Engineer: it is a voice-first assistant
// rather than a telemetry platform, and filing it under "motorsport" would
// have catalogued it by the domain it serves instead of what it is. The
// other five motorsport-adjacent projects share a data-processing stack;
// this one's defining surface is spoken interaction.
const VALID_CATEGORY: ProjectCategory[] = [
  "motorsport",
  "ai-ml",
  "simulation-game",
  "data-platform",
  "enterprise-grc",
  "voice",
];

/**
 * PROJECT DATA INTEGRITY
 *
 * spec §65 asks that malformed project data not pass silently. These catch
 * the realistic ways this file rots: a duplicated slug (two routes collide,
 * one project unreachable), a typo'd status or category that bypasses the
 * TypeScript union at runtime, a malformed URL, or an invented metric.
 */
describe("projects catalogue", () => {
  it("is not empty", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique ids and slugs", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it("uses url-safe slugs", () => {
    for (const project of projects) {
      expect(project.slug, project.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("has id and slug in agreement", () => {
    for (const project of projects) {
      expect(project.slug, project.id).toBe(project.id);
    }
  });

  it("only uses declared statuses and categories", () => {
    for (const project of projects) {
      expect(VALID_STATUS, project.id).toContain(project.status);
      expect(VALID_CATEGORY, project.id).toContain(project.category);
    }
  });

  it("has no empty required copy", () => {
    for (const project of projects) {
      expect(project.title.trim(), project.id).not.toBe("");
      expect(project.tagline.trim(), project.id).not.toBe("");
      expect(project.description.trim(), project.id).not.toBe("");
      expect(project.shortTitle.trim(), project.id).not.toBe("");
    }
  });

  it("uses absolute https URLs for any external links", () => {
    for (const project of projects) {
      for (const [key, url] of Object.entries(project.links)) {
        if (!url) continue;
        // `visibility` is a control field, not a URL.
        if (key === "visibility") continue;
        expect(url, `${project.id}.${key}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("does not emit the internal year sentinel as real data", () => {
    for (const project of projects) {
      if (project.year !== "TBD") {
        expect(project.year, project.id).toMatch(/^\d{4}$/);
      }
    }
  });

  it("keeps metric values and labels non-empty", () => {
    for (const project of projects) {
      for (const metric of project.metrics ?? []) {
        expect(metric.value.trim(), `${project.id}/${metric.label}`).not.toBe("");
        expect(metric.label.trim(), `${project.id}/${metric.value}`).not.toBe("");
      }
    }
  });

  it("gives pipeline stages a label", () => {
    for (const project of projects) {
      for (const stage of project.architecture?.pipeline ?? []) {
        expect(stage.label.trim(), project.id).not.toBe("");
      }
    }
  });

  it("never marks unfinished work as completed", () => {
    for (const project of projects) {
      if (!project.currentState) continue;
      if (project.status === "completed") {
        expect(
          /not (?:complete|finished)|in progress|in development/i.test(
            project.currentState
          ),
          `${project.id} is 'completed' but its currentState reads unfinished`
        ).toBe(false);
      }
    }
  });
});

describe("lookups", () => {
  it("finds every project by its own slug", () => {
    for (const project of projects) {
      expect(getProjectBySlug(project.slug)?.id).toBe(project.id);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("no-such-project")).toBeUndefined();
  });

  it("only marks genuinely featured projects as featured", () => {
    for (const project of featuredProjects()) {
      expect(project.featured).toBe(true);
    }
  });
});

describe("flagship selection", () => {
  const flagship = getFlagshipProject();

  it("selects a project that is featured AND evidence-backed", () => {
    if (!flagship) return;
    expect(flagship.featured).toBe(true);
    expect(flagship.metrics?.length ?? 0).toBeGreaterThan(0);
  });

  it("never promotes a project that has no verified metrics", () => {
    for (const project of getIndexProjects()) {
      expect(project.slug).not.toBe(flagship?.slug);
    }
  });

  it("excludes the flagship from the index exactly once", () => {
    const indexSlugs = getIndexProjects().map((p) => p.slug);
    expect(indexSlugs.length).toBe(projects.length - (flagship ? 1 : 0));
    if (flagship) expect(indexSlugs).not.toContain(flagship.slug);
  });

  it("keeps the index in catalogue order and free of duplicates", () => {
    const indexSlugs = getIndexProjects().map((p) => p.slug);
    expect(new Set(indexSlugs).size).toBe(indexSlugs.length);
    expect(indexSlugs).toEqual(
      projects.map((p) => p.slug).filter((s) => s !== flagship?.slug)
    );
  });
});

describe("getNextProject", () => {
  it("advances through the catalogue in order", () => {
    for (let i = 0; i < projects.length; i++) {
      const current = projects[i];
      const expected = projects[(i + 1) % projects.length];
      if (!current || !expected) continue;
      const next = getNextProject(current.slug);
      expect(next, current.slug).toBeDefined();
      expect(next?.slug, current.slug).toBe(expected.slug);
    }
  });

  it("never links a project back to itself", () => {
    for (const project of projects) {
      expect(getNextProject(project.slug)?.slug).not.toBe(project.slug);
    }
  });

  it("falls back to the first project for an unknown slug", () => {
    expect(getNextProject("no-such-project")?.slug).toBe(projects[0]?.slug);
  });
});

/**
 * STORYTELLING SPINE
 *
 * The case-study template renders
 *   thesis → problem → architecture → tradeoffs → validation → evidence
 *   → limitations → next iteration
 * and every field is optional. Optional plus absent means a reader can reach
 * the bottom of a case study with no stated boundary on what the system does
 * not do — the impression this portfolio's credibility cannot afford.
 */
describe("project storytelling depth", () => {
  it("every project states a thesis", () => {
    for (const project of projects) {
      expect(project.thesis?.trim(), project.id).toBeTruthy();
    }
  });

  it("every project has a memorable engineering hook (spec §06)", () => {
    for (const project of projects) {
      const hook = project.hook.trim();
      expect(hook, project.id).toBeTruthy();
      // A hook is the whole card on /work. If it grows into a paragraph it
      // stops being scannable, which is the reason the field exists.
      expect(hook.length, `${project.id}: "${hook}"`).toBeLessThanOrEqual(90);
    }
  });

  it("no two projects share a hook", () => {
    // §06 exists because seven identical cards stop reading as seven
    // projects. If two hooks ever collide, one of them stopped being
    // written for this project.
    const hooks = projects.map((project) => project.hook.trim().toLowerCase());
    expect(new Set(hooks).size).toBe(hooks.length);
  });

  it("every project states one piece of evidence (spec §50)", () => {
    for (const project of projects) {
      expect(project.evidence.trim(), project.id).toBeTruthy();
    }
  });

  it("only puts a number in an evidence statement when a metric backs it", () => {
    // §50: numeric proof only where a number was actually verified.
    // Otherwise the evidence line is a statement ("multi-provider
    // architecture"), never a figure standing in for a figure nobody has.
    for (const project of projects) {
      if (!/\d/.test(project.evidence)) continue;
      expect(
        project.metrics?.length ?? 0,
        `${project.id}: "${project.evidence}" cites a number with no measured metric behind it`
      ).toBeGreaterThan(0);
    }
  });

  it("every project writes the full 30-second brief (spec §08)", () => {
    for (const project of projects) {
      for (const block of ["problem", "built", "approach", "result"] as const) {
        const text = project.brief[block].trim();
        expect(text, `${project.id} → ${block}`).toBeTruthy();
        // 1–2 sentences each. A brief that runs long is the long copy
        // again, and the point of the block is that it is a different read.
        expect(text.length, `${project.id} → ${block} is ${text.length} chars`).toBeLessThanOrEqual(
          330
        );
      }
    }
  });

  it("the brief does not repeat the long description", () => {
    // §47: the same prose twice within one page is the failure this whole
    // pass is correcting.
    for (const project of projects) {
      for (const block of ["problem", "built", "approach", "result"] as const) {
        expect(project.brief[block].trim(), `${project.id} → ${block}`).not.toBe(
          project.description.trim()
        );
      }
    }
  });

  it("card chips are curated from the project's own stack (spec §05)", () => {
    for (const project of projects) {
      const chips = project.keyTechnologies;
      if (!chips) continue;
      expect(chips.length, `${project.id}: ${chips.length} chips, spec allows 3–7`).toBeGreaterThanOrEqual(3);
      expect(chips.length, `${project.id}: ${chips.length} chips, spec allows 3–7`).toBeLessThanOrEqual(7);
      for (const chip of chips) {
        expect(
          project.technologies,
          `${project.id}: chip "${chip}" is not in the project's own technologies`
        ).toContain(chip);
      }
    }
  });

  it("every project can render a chip row", () => {
    // The index card needs 3–7 chips. `keyTechnologies` is the curated
    // list; without it the full stack is sliced. A project with neither
    // renders an empty card, which is the shape this lock prevents.
    for (const project of projects) {
      const chips = project.keyTechnologies ?? project.technologies;
      expect(chips.length, `${project.id} renders no technology chips`).toBeGreaterThan(0);
    }
  });

  it("every project states its limitations", () => {
    for (const project of projects) {
      expect(project.limitations?.trim().length ?? 0, project.id).toBeGreaterThan(20);
    }
  });

  it("every project declares a visual identity and architecture shape", () => {
    for (const project of projects) {
      expect(project.visualizationType, project.id).toBeTruthy();
      expect(project.architectureShape, project.id).toBeTruthy();
    }
  });

  it("every project has an architecture summary", () => {
    for (const project of projects) {
      expect(project.architecture?.summary?.trim(), project.id).toBeTruthy();
    }
  });

  it("projects with an architecture pipeline declare a shape", () => {
    for (const project of projects) {
      if (project.architecture?.pipeline?.length) {
        expect(project.architectureShape, project.id).toBeTruthy();
      }
    }
  });

  it("uses a known visualization type", () => {
    const valid: VisualizationType[] = [
      "telemetry",
      "vehicle",
      "strategy",
      "team",
      "dataset",
      // Phase C: Football Intelligence OS needs a visual language of its
      // own. Reusing `dataset` would have drawn the player-intelligence
      // scatter for a data-pipeline project and quietly implied the two
      // football systems are the same kind of thing.
      "platform",
      "forecast",
      // Sentinel AI's architecture is the only containment hierarchy on the
      // site — policies contain controls, which carry evidence. Every other
      // instrument here draws a flow; reusing one of them would have drawn
      // a GRC platform as a pipeline and lost the one structural fact that
      // distinguishes it.
      "governance",
      // F1 Voice Engineer is the only system here whose input is speech and
      // whose output is speech. Borrowing `telemetry` would have drawn it as
      // an event stream, which is the one thing it is not: its whole design
      // claim is that the interaction is spoken rather than read.
      "voice",
    ];
    for (const project of projects) {
      expect(valid, project.id).toContain(project.visualizationType);
    }
  });

  it("gives every project at least one concrete trade-off", () => {
    for (const project of projects) {
      expect(project.tradeoffs?.length ?? 0, project.id).toBeGreaterThan(0);
    }
  });

  it("states trade-offs as problem → decision → result", () => {
    for (const project of projects) {
      for (const t of project.tradeoffs ?? []) {
        expect(t.problem?.trim(), project.id).toBeTruthy();
        expect(t.decision?.trim(), project.id).toBeTruthy();
        expect(t.result?.trim(), project.id).toBeTruthy();
      }
    }
  });
});

/**
 * TRUTHFULNESS
 *
 * Each of these locks in a specific claim the portfolio must never drift
 * into making. They exist because the pressure to sound more impressive is
 * constant and the data is where that pressure does its damage.
 */
describe("truthfulness of the depth fields", () => {
  it("the simulator is honest about what the model does not cover", () => {
    const sim = projects.find((p) => p.id === "f1-lap-time-simulator");
    expect(sim?.limitations ?? "").toMatch(/MATLAB/i);
    // The simulator must not claim measured lap-time output it has not verified.
    expect(sim?.limitations ?? "").toMatch(/No lap-time figures are published/i);
    // Must still be honest about the modelling boundary.
    expect(sim?.limitations ?? "").toMatch(/transient weight transfer|suspension|combined-slip/i);
    // Status reflects that this is a completed MATLAB implementation.
    expect(sim?.status).toBe("completed");
  });

  it("RaceMind-AI does not claim a finished frontend", () => {
    const rm = projects.find((p) => p.id === "racemind-ai");
    expect(rm?.limitations ?? "").toMatch(/frontend|desktop/i);
  });

  it("F1 Race Manager is labelled a game, not a vehicle simulator", () => {
    const game = projects.find((p) => p.id === "f1-race-manager");
    expect(game?.description ?? "").toMatch(/game/i);
    expect(game?.status).toBe("in-development");
  });

  it("EA FC Player Intelligence makes no accuracy claim", () => {
    const fc = projects.find((p) => p.id === "ea-fc-intelligence");
    expect(fc?.limitations ?? "").toMatch(/accuracy/i);
    expect(fc?.limitations ?? "").toMatch(/FUT|proprietary/i);
  });

  it("keeps the version wall honest: baseline complete, active not claimed complete", () => {
    const fc = projects.find((p) => p.id === "ea-fc-intelligence");
    const versions = fc?.versionHistory ?? [];
    expect(versions.map((v) => v.version)).toEqual(["FC26", "FC27"]);

    const [baseline, active] = versions;
    expect(baseline?.role, "FC26 must be presented as the baseline").toBe("baseline");
    expect(
      baseline?.status,
      "a completed 16,228-row foundation must not be downgraded to a soft claim"
    ).toBe("verified");

    // The load-bearing honesty rule: FC27 has zero imported records. If a
    // future edit ever marks it shipped, the version wall becomes a lie and
    // this fails.
    expect(active?.role, "FC27 must be presented as the active line").toBe("active");
    expect(active?.status).not.toBe("verified");
    expect(active?.status).not.toBe("live-verified");
    expect(
      active?.stats?.some((s) => s.label.toLowerCase().includes("import") && s.value === "0"),
      "FC27 must state that zero records were imported"
    ).toBe(true);

    // And it must be blocked for a stated, real reason rather than vague.
    expect((active?.blocked ?? []).join(" ")).toMatch(/source|licen|authoris|authoriz/i);
  });

  it("never renders a figure number out of order", () => {
    // Figures are numbered per-case-study in the page template. This locks
    // that every optional figure source is actually reachable, so adding a
    // new figure block without wiring it into the numbering is caught.
    const eafc = projects.find((p) => p.id === "ea-fc-intelligence");
    expect(eafc?.versionHistory?.length ?? 0).toBeGreaterThan(0);
    expect(eafc?.dataFlow?.length ?? 0).toBeGreaterThan(0);
    expect(eafc?.validationClaims?.length ?? 0).toBeGreaterThan(0);

    const fos = projects.find((p) => p.id === "football-intelligence-os");
    expect(fos?.providers?.length ?? 0).toBeGreaterThan(0);
    expect(fos?.capabilities?.length ?? 0).toBeGreaterThan(0);
    expect(fos?.lineage?.length ?? 0).toBeGreaterThan(0);
    expect(fos?.apiSurface?.length ?? 0).toBeGreaterThan(0);
  });

  it("separates Football Intelligence OS from EA FC Player Intelligence", () => {
    const fc = projects.find((p) => p.id === "ea-fc-intelligence");
    const fos = projects.find((p) => p.id === "football-intelligence-os");

    // Distinct slugs — they are two systems, not one project described twice.
    expect(fc?.slug).not.toBe(fos?.slug);
    // Distinct visual languages.
    expect(fc?.visualizationType).not.toBe(fos?.visualizationType);
    // EA FC is not presented as a football data platform, and vice versa.
    expect(fc?.providers ?? []).toHaveLength(0);
    expect((fos?.providers ?? []).length).toBeGreaterThan(0);
    expect(fos?.versionHistory ?? []).toHaveLength(0);
  });

  it("keeps Ultimate Team card work out of the live player engine", () => {
    const fc = projects.find((p) => p.id === "ea-fc-intelligence");
    const scoped = fc?.separatelyScoped ?? [];
    expect(scoped.length, "the UT card track must be labelled, not hidden").toBeGreaterThan(0);
    for (const aside of scoped) {
      expect(["planned", "research", "blocked", "partial", "not-run"]).toContain(aside.status);
    }
    // And it must never be claimed as verified or live.
    expect(
      scoped.some((a) => a.status === "verified" || a.status === "live-verified"),
      "no card dataset has been lawfully obtained"
    ).toBe(false);
  });

  it("reports test runs with their failures and skips intact", () => {
    for (const project of projects) {
      for (const run of project.testing ?? []) {
        expect(
          run.total,
          `${project.id}: total must equal passed + failed + skipped`
        ).toBe(run.passed + run.failed + run.skipped);
        if (run.skipped > 0) {
          expect(
            run.skippedBecause,
            `${project.id}: "${run.suite}" skips ${run.skipped} tests, so the reason is mandatory`
          ).toBeTruthy();
        }
        expect(run.verifiedOn, `${project.id}: a run must state when it was executed`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        );
      }
    }
  });

  it("VyaparPulse is identified as a team project", () => {
    const vp = projects.find((p) => p.id === "vyaparpulse");
    expect(vp?.limitations ?? "").toMatch(/team project/i);
    expect(vp?.limitations ?? "").toMatch(/hackathon/i);
  });

  it("the simulator publishes no lap-time figures", () => {
    const sim = projects.find((p) => p.id === "f1-lap-time-simulator");
    expect(sim?.metrics ?? []).toHaveLength(0);
    expect(sim?.limitations ?? "").toMatch(
      /no lap-time|not yet verified|none have been verified/i
    );
  });

  it("only ships metrics that say where they came from", () => {
    // Was: "only the flagship carries verified metrics" — a lock against
    // inventing figures. Phase C legitimately gave two football projects
    // metrics, but only because both were measured: the Football OS
    // numbers come from a pytest run executed during this work, and the
    // EA FC player count comes from the project's own dataset manifest.
    //
    // Hard-coding the old roster would have blocked that; deleting the lock
    // would have re-opened the door it was built to close. So the lock now
    // asserts the property that actually matters — that a published number
    // is traceable to something.
    //
    // Scope note: this applies to the Phase C projects. Live F1's figures
    // predate this and are owner-supplied, with provenance carried in the
    // project prose rather than per-metric. Extending the requirement to
    // them would be a separate, deliberate copy pass, not a test fix.
    const traceable = new Set(["ea-fc-intelligence", "football-intelligence-os"]);
    for (const project of projects) {
      if (!traceable.has(project.id)) continue;
      for (const metric of project.metrics ?? []) {
        expect(
          metric.note,
          `${project.id} · "${metric.label}": an unsourced number is an invented number`
        ).toBeTruthy();
      }
    }
  });
});