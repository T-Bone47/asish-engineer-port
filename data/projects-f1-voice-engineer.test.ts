import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProjectBySlug, getProjectNumber, projects } from "@/data/projects";
import type { Project } from "@/types/project";

/**
 * F1 VOICE ENGINEER — PROJECT 09
 *
 * The ninth project arrives with a different evidential shape from the other
 * eight, and that is what most of this file locks. Every other case study on
 * this site is read from a repository, so its claims can be checked against
 * source. This one has no published repository: its content comes from the
 * project's own specification and recorded status, and its most important
 * fact is a *boundary* — the software was tested, the game integration was
 * not, because the supported titles were unavailable.
 *
 * A boundary is exactly the kind of claim that rots silently. Nothing breaks
 * when someone edits "unproven" into "verified", or drops the sentence that
 * says the assistant is not a module of RaceMind-AI, or pastes a placeholder
 * repository URL into a project whose repository does not exist. So the
 * honesty rules below are asserted against the data rather than left to
 * review.
 *
 * The other half is roster integrity: adding a project must not have
 * disturbed the eight that were already here.
 */

const SLUG = "f1-voice-engineer";

/** The catalogue as it stood before this project was added. */
const EXISTING_SLUGS = [
  "live-f1-intelligence",
  "f1-lap-time-simulator",
  "racemind-ai",
  "f1-race-manager",
  "ea-fc-intelligence",
  "football-intelligence-os",
  "sentinel-ai",
  "vyaparpulse",
] as const;

const project = getProjectBySlug(SLUG);

if (!project) {
  throw new Error(`F1 Voice Engineer (${SLUG}) is missing from the catalogue`);
}

/** Every string in a project, so text rules can be asserted on all of it. */
function allText(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allText);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(allText);
  }
  return [];
}

const text = allText(project).join("\n");
const lower = text.toLowerCase();

describe("F1 Voice Engineer — roster integrity", () => {
  it("is the ninth project, with the existing eight still present", () => {
    expect(projects).toHaveLength(9);
    for (const slug of EXISTING_SLUGS) {
      expect(
        projects.some((p) => p.slug === slug),
        `adding the ninth project dropped or renamed ${slug}`
      ).toBe(true);
    }
    expect(projects.filter((p) => p.slug === SLUG)).toHaveLength(1);
  });

  it("sits immediately after RaceMind-AI in the catalogue", () => {
    // The position is narrative, not incidental: it is the project most
    // likely to be read as a module of RaceMind-AI, so it is placed next to
    // it with the disclaimers on the page rather than far from the confusion.
    const index = projects.findIndex((p) => p.slug === SLUG);
    expect(projects[index - 1]?.slug).toBe("racemind-ai");
  });

  it("renumbers the projects after it instead of hardcoding positions", () => {
    // Displayed numbers are derived from the collection — inserting at 04
    // must shift the rest, not leave two projects numbered 04.
    expect(getProjectNumber(SLUG)).toBe("04");
    const numbers = projects.map((p) => getProjectNumber(p.slug));
    expect(numbers).toEqual(
      Array.from({ length: projects.length }, (_, i) => String(i + 1).padStart(2, "0"))
    );
  });
});

describe("F1 Voice Engineer — identity and schema validity", () => {
  it("has a name, description, tagline and unique slug", () => {
    expect(project.title.trim()).not.toBe("");
    expect(project.shortTitle.trim()).not.toBe("");
    expect(project.description.trim().length).toBeGreaterThan(40);
    expect(project.tagline).toBe("Your race engineer. In the cockpit.");
    expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(projects.filter((p) => p.slug === project.slug)).toHaveLength(1);
    expect(projects.filter((p) => p.id === project.id)).toHaveLength(1);
  });

  it("uses a status and category that do not overstate it", () => {
    // A prototype whose headline integration is unproven is not "completed"
    // and not "active" — nothing is running in production for anyone.
    expect(project.status).toBe("experimental");
    expect(project.category).toBe("voice");
  });

  it("declares the agreed stack and nothing borrowed from other projects", () => {
    expect(project.technologies).toEqual([
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vosk",
      "UDP telemetry processing",
    ]);
    // Technologies that belong to *other* projects on this site, and would
    // only appear here by copy-paste.
    for (const borrowed of ["PostgreSQL", "TimescaleDB", "WebSockets", "Unity", "Docker", "Claude API"]) {
      expect(project.technologies, `${borrowed} was borrowed from another project`).not.toContain(
        borrowed
      );
    }
    for (const chip of project.keyTechnologies ?? []) {
      expect(project.technologies).toContain(chip);
    }
  });

  it("maps the requested highlight into tags rather than dropping it", () => {
    expect(project.tags).toEqual([
      "Voice interaction",
      "Telemetry-aware assistance",
      "Standalone architecture",
    ]);
  });

  it("declares the voice visual language", () => {
    expect(project.visualizationType).toBe("voice");
    expect(project.architectureShape).toBe("branched");
  });

  it("carries no media, so no in-game screenshot can be faked", () => {
    // Spec §47: media must be real. None exists for this project, so the
    // page renders its architecture and its captioned schematic instead.
    expect(project.media).toBeUndefined();
  });
});

describe("F1 Voice Engineer — case-study route resolves", () => {
  it("is reachable by its own slug and enumerated for prerendering", () => {
    expect(getProjectBySlug(SLUG)?.id).toBe(project.id);
    // The page and the social card both build their params from the data
    // collection, so being in the collection IS being routed.
    expect(projects.map((p) => p.slug)).toContain(SLUG);
  });

  it("renders through the shared template, which 404s an unknown slug", () => {
    const pageSource = readFileSync(
      join(process.cwd(), "app", "work", "[slug]", "page.tsx"),
      "utf-8"
    );
    expect(pageSource).toContain("getProjectBySlug");
    expect(pageSource).toContain("notFound()");
  });

  it("names its own flow figure instead of inheriting the attribute-pipeline one", () => {
    expect(project.dataFlow?.length).toBeGreaterThan(0);
    expect(project.dataFlowTitle).toBe("Voice interaction loop");
    expect(project.dataFlowCaption?.toLowerCase()).toContain("telemetry path is optional");
  });
});

describe("F1 Voice Engineer — no fabricated external links", () => {
  it("is recorded as unpublished, with no URL invented for it", () => {
    expect(project.links.visibility).toBe("unpublished");
    expect(project.links.repository).toBeUndefined();
    expect(project.links.demo).toBeUndefined();
    expect(project.links.documentation).toBeUndefined();
  });

  it("contains no placeholder or fake URL anywhere in its content", () => {
    // The realistic ways a "no repository yet" project goes wrong: a
    // guessed repo under the owner's account, a placeholder, or a link to
    // somebody else's project.
    expect(text).not.toMatch(/github\.com\/T-Bone47\/f1-voice/i);
    expect(text).not.toMatch(/example\.(com|org)|placeholder|your-?repo|TODO\(|lorem ipsum/i);
    expect(text).not.toMatch(/https?:\/\//);
  });
});

describe("F1 Voice Engineer — the telemetry boundary stays a boundary", () => {
  it("states that live-game decoding is unproven, and why", () => {
    expect(lower).toContain("no telemetry from a running");
    expect(lower).toMatch(/f1 25 and f1 2026 season pack|either supported title/);
    expect(lower).toMatch(/unavailable in the test environment/);
  });

  it("never presents mocked or synthetic packet handling as a live result", () => {
    expect(lower).toContain("not a live-game result");
    expect(lower).toMatch(/packet structures and (their )?published packet sizes/);
  });

  it("records the live-game claim as not run, at the weakest honest status", () => {
    const liveGame = (project.validationClaims ?? []).filter((claim) =>
      /live-game/i.test(claim.label)
    );
    expect(liveGame.length).toBeGreaterThan(0);
    for (const claim of liveGame) {
      expect(["not-run", "blocked"]).toContain(claim.status);
    }

    const validation = project.separatelyScoped ?? [];
    expect(validation.length).toBeGreaterThan(0);
    for (const aside of validation) {
      expect(["not-run", "blocked", "planned", "research", "partial"]).toContain(aside.status);
    }

    // And nothing about the live path may be marked verified anywhere.
    for (const item of [...(project.stateItems ?? []), ...(project.validationClaims ?? [])]) {
      if (/live-game/i.test(item.label)) {
        expect(item.status).not.toBe("verified");
        expect(item.status).not.toBe("live-verified");
      }
    }
  });

  it("keeps the reported test figures attributed rather than re-measured here", () => {
    // These numbers belong to the project's own suite. If a future edit
    // presents them as this portfolio's measurement, this fails.
    expect(text).toContain("3,313");
    expect(lower).toMatch(/attributed, not re-executed|not re-executed against this repository/);
  });

  it("publishes no metric, so the hero cannot promote a reported count into a measurement", () => {
    expect(project.metrics).toBeUndefined();
    expect(project.evidence).not.toMatch(/\d/);
  });

  it("does not name a speech-generation provider, because the record names none", () => {
    // Vosk is recognition. Naming a TTS vendor would be inventing a
    // dependency the project's own material does not mention.
    for (const provider of [
      "pyttsx3",
      "coqui",
      "elevenlabs",
      "azure speech",
      "google tts",
      "gtts",
      "piper",
      "festival",
      "amazon polly",
    ]) {
      expect(lower, `${provider} was invented as the speech generation provider`).not.toContain(
        provider
      );
    }
    expect(project.constraints?.some((c) => /recognition is not generation/i.test(c.label))).toBe(
      true
    );
  });
});

describe("F1 Voice Engineer — standalone and unaffiliated", () => {
  it("states in its own content that it is not a module of the other two systems", () => {
    expect(lower).toContain("racemind-ai");
    expect(lower).toContain("live f1 intelligence");
    expect(lower).toMatch(/not an extension, module or dependency|rather than an extension or submodule/);
  });

  it("explicitly disclaims team affiliation and licensed access", () => {
    expect(lower).toMatch(/no affiliation, endorsement or licensed access/);
    expect(lower).toMatch(/personas/);
  });

  it("does not claim avatar animation or game-window integration as working", () => {
    const overlay = (project.stateItems ?? []).find((item) => /overlay/i.test(item.label));
    expect(overlay).toBeDefined();
    expect(["planned", "research", "partial", "not-run", "blocked"]).toContain(overlay?.status);
  });

  it("claims no other simulator or telemetry format", () => {
    expect(project.constraints?.some((c) => /recognised titles only/i.test(c.label))).toBe(true);
    for (const other of ["iRacing", "Assetto Corsa", "Gran Turismo", "rFactor", "ACC"]) {
      expect(text, `${other} is not a supported title and must not be named as one`).not.toContain(
        other
      );
    }
  });
});

describe("F1 Voice Engineer — story depth matches the rest of the catalogue", () => {
  it("writes the full brief, a thesis, trade-offs and limitations", () => {
    for (const block of ["problem", "built", "approach", "result"] as const) {
      expect(project.brief[block].trim().length, block).toBeGreaterThan(80);
      expect(project.brief[block].length, `${block} exceeds the 330-char brief budget`).toBeLessThanOrEqual(
        330
      );
    }
    expect(project.thesis?.trim()).toBeTruthy();
    expect(project.hook.trim().length).toBeLessThanOrEqual(90);
    expect(project.tradeoffs?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(project.limitations?.trim().length ?? 0).toBeGreaterThan(200);
    expect(project.engineeringDecisions?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(project.nextIteration?.trim()).toBeTruthy();
  });

  it("states a hook no other project shares", () => {
    const hooks = projects.map((p) => p.hook.trim().toLowerCase());
    expect(new Set(hooks).size).toBe(hooks.length);
  });

  it("describes the architecture in the spec's eight conceptual components", () => {
    const labels = (project.architecture?.pipeline ?? []).map((stage) => stage.label);
    expect(labels).toEqual([
      "Driver voice input",
      "Speech recognition",
      "Request interpretation",
      "Voice Engineer orchestration",
      "Telemetry / session context",
      "Engineering response generation",
      "Speech output",
      "Driver-facing interface",
    ]);
    // Telemetry ingestion is a documented separate path into the context
    // layer, not a stage of the conversation.
    const context = project.architecture?.pipeline?.[4];
    expect(context?.children?.join(" ").toLowerCase()).toContain("udp telemetry ingestion");
  });

  it("keeps the type honest about the fields it does not populate", () => {
    // Deliberately empty rather than filled with plausible-looking detail.
    const populated: Array<keyof Project> = ["providers", "capabilities", "lineage", "apiSurface", "testing", "versionHistory"];
    for (const field of populated) {
      expect(project[field], `${String(field)} should be absent, not invented`).toBeUndefined();
    }
  });
});
