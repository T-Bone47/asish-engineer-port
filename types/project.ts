/**
 * Project data model — spec §29 (schema given verbatim), extended with
 * the supporting shapes the spec references but doesn't fully define
 * (Metric, ArchitectureSection, Decision, ProjectLinks, ProjectMedia).
 * Kept intentionally simple per §73 ("prefer the simpler architecture").
 *
 * The optional block from Phase C (constraints, dataFlow, providers,
 * validation evidence, testing, versionHistory, capabilities, apiSurface)
 * is deliberately generic: it is the shared case-study template's schema,
 * not a one-off page. Any project may populate any of it; every renderer
 * is gated on presence so an unfilled field renders nothing at all.
 */

export type ProjectStatus =
  | "completed"
  | "active"
  | "near-completion"
  | "in-development"
  | "experimental";

export type ProjectCategory =
  | "motorsport"
  | "ai-ml"
  | "simulation-game"
  | "data-platform"
  // Added for Sentinel AI. It is an enterprise governance/risk/compliance
  // platform: "ai-ml" would misdescribe it (its core answers are
  // deterministic and its own README states no LLM is configured), and
  // "data-platform" would describe its plumbing rather than its purpose.
  | "enterprise-grc"
  // Added for F1 Voice Engineer. "motorsport" would catalogue it by the
  // domain it serves rather than by what it is: a voice-first assistant
  // whose defining engineering surface is spoken interaction, not the
  // telemetry-processing stack the other motorsport projects share.
  | "voice";

/**
 * How strongly a claim is backed.
 *
 * The whole point of this portfolio's Phase C is that "implemented" and
 * "verified" are different words, so they get different values here. The
 * repo this was built from is unusually disciplined about exactly this
 * distinction — it refuses to mark a provider capability verified until a
 * live call has actually returned, and it keeps `available` and
 * `last_verified` in separate columns for precisely that reason.
 *
 * Ordering below is weakest → strongest. Never use `verified` for
 * something that was merely written.
 */
export type EvidenceStatus =
  | "planned"
  | "research"
  | "blocked"
  | "not-run"
  | "partial"
  | "implemented"
  | "verified"
  | "live-verified";

/** A single verified, measured value — spec §30. Never populate this
 *  with an estimated or invented number; omit the metric instead. */
export interface Metric {
  value: string;
  label: string;
  /** Optional short context, e.g. "measured on the owner's dataset" */
  note?: string;
}

/** One stage of a project's system/data pipeline, for the ASCII-style
 *  flow diagrams the spec sketches throughout (§31–36). `children`
 *  allows a stage to fan out (e.g. CANONICAL EVENT MODEL → its
 *  sub-systems in §31). */
export interface PipelineStage {
  label: string;
  children?: string[];
  /** Optional one-line note shown beside the node. */
  detail?: string;
}

export interface ArchitectureSection {
  summary: string;
  pipeline?: PipelineStage[];
  stack?: string[];
  /** Static list of upstream sources, used by the `converge` fan-in shape. */
  sources?: string[];
}

/** One engineering trade-off worth calling out explicitly — spec's
 *  "Engineering Decisions" case-study section (§28, §63 "WHY?"). */
export interface Decision {
  title: string;
  rationale: string;
}

/** Hard constraints the system is built around. Shown separately from
 *  trade-offs because they are boundary conditions, not choices. */
export interface Constraint {
  label: string;
  detail: string;
}

/**
 * How publicly visible a project's external links are.
 *
 * A project does not need a public repository to be real — Sentinel AI is
 * the motivating case: it is a genuine engineering effort whose canonical
 * repository is not public under this GitHub account. Forcing every project
 * to have a public `repository` link would either fabricate a link or
 * drop a real project.
 *
 * The rule instead is: every project must declare its visibility honestly,
 * and a project with `visibility: "unpublished"` is allowed to have empty
 * links. A project with `visibility: "public"` that has no links is a
 * genuine gap the owner still needs to fill.
 */
export type ProjectLinksVisibility =
  | "public" // at least one external link should be present
  | "unpublished"; // no public repo/demo/docs — that is the honest state

export interface ProjectLinks {
  /** github.com/T-Bone47/<repo> or equivalent — only when public. */
  repository?: string;
  demo?: string;
  documentation?: string;
  /**
   * Whether this project is expected to have public external links.
   *
   * `"public"` is the default behaviour the old gate assumed for every
   * project. `"unpublished"` opts a project out of the external-link
   * requirement without dropping the project from the catalogue.
   */
  visibility?: ProjectLinksVisibility;
}

export type ProjectMediaKind =
  | "screenshot"
  | "diagram"
  | "chart"
  | "telemetry-visual"
  | "simulation-output"
  | "video"
  | "gif"
  | "code-excerpt";

export interface ProjectMediaItem {
  kind: ProjectMediaKind;
  src: string;
  alt: string;
  caption?: string;
  /** True for generated/abstract visual explanations rather than an
   *  actual product screenshot — spec §47 requires this distinction
   *  to stay visible to the reader. */
  isIllustrative?: boolean;
}

export interface ProjectMedia {
  items: ProjectMediaItem[];
}

/**
 * How a project's architecture is *shaped*.
 *
 * Real architectures do not look alike, and rendering them all with one
 * identical vertical rail was hiding that. These roles drive the diagram:
 *
 *  - `converge`  many sources collapsing into one canonical model (F1's four
 *                providers → one event contract). Rendered as a fan-in.
 *  - `sequential` a fixed left-to-right / top-to-bottom process with no
 *                branching. Rendered as a linear run.
 *  - `fanout`    one stage that expands into many parallel subsystems.
 *  - `branched`  several stages that each fan out (decode → model → strategy).
 *
 * Purely presentational — it describes how the data should be *drawn*, never
 * what the system does. No project invents a shape it doesn't have.
 */
export type ArchitectureShape = "converge" | "sequential" | "fanout" | "branched";

/**
 * The visual language each project is expressed in.
 *
 * Drives the deterministic instrument rendered on index rows, hover
 * previews and case-study heroes. Same design system, different expression —
 * a telemetry pipeline and a numerical solver must not look alike.
 */
export type VisualizationType =
  | "telemetry" // event streams, traces, timing state
  | "vehicle" // track geometry, cornering, aero
  | "strategy" // pit windows, tyre/fuel/weather state
  | "team" // people, money, development, race-weekend board
  | "dataset" // player/feature space, ranking
  | "platform" // provider → ingestion → canonical → consumers (data platform)
  | "forecast" // time series, confidence bands
  // Added for Sentinel AI: nested governance scope (policy containing
  // controls), per-control evidence with a visible gap, and one answer node
  // traced back into that record set. Deliberately a *containment* geometry
  // — no other project's instrument nests, so it cannot be mistaken for the
  // data-platform fan-in or the player feature space.
  | "governance"
  // Added for F1 Voice Engineer: a cockpit radio-console motif for the voice
  // interaction, speech recognition, engineer reply and telemetry/session
  // context chain.
  | "voice";

/** One engineering trade-off: the problem, the decision, and the effect. */
export interface Tradeoff {
  problem: string;
  decision: string;
  result: string;
}

/* ------------------------------------------------------------------ *
 * Deep-intelligence blocks (Phase C). All optional; renderers are
 * gated on presence so an empty block produces no heading at all.
 * ------------------------------------------------------------------ */

/**
 * A release line in a version-aware system. The EA FC project is the
 * motivating case: FC26 is a completed data baseline and FC27 is active
 * work with zero records imported. Collapsing those into "the EA FC
 * project" would misrepresent both.
 */
export interface VersionEntry {
  version: string;
  /** `baseline` renders closed/settled, `active` renders in-flight. */
  role: "baseline" | "active";
  headline: string;
  summary: string;
  status: EvidenceStatus;
  /** Measured figures for this version only. */
  stats?: Metric[];
  /** Shipped and verified. */
  completed?: string[];
  /** In flight right now. */
  active?: string[];
  /** Defined but deliberately not executed, with the reason. */
  planned?: string[];
  /** Cannot proceed, and why. */
  blocked?: string[];
}

/** One upstream data provider / external source, and its honest state. */
export interface ProviderEntry {
  name: string;
  /** One line: what this provider actually contributes. */
  role: string;
  status: EvidenceStatus;
  detail: string;
  /** The concrete resource keys this provider exposes. */
  resources?: string[];
}

/**
 * One row of a provider × resource capability registry.
 *
 * `supported` is what the provider documents. `verified` is whether a
 * real call has ever succeeded. Keeping these as two independent booleans
 * is the single most useful thing a capability matrix can communicate,
 * and it is exactly how the source repository stores it.
 */
export interface CapabilityRow {
  provider: string;
  resource: string;
  supported: boolean;
  verified: boolean;
  /** Result count or other real observation, when one exists. */
  evidence?: string;
}

/** One link in a data-lineage chain: source → run → snapshot → record. */
export interface LineageStep {
  label: string;
  detail: string;
  /** Optional fields this stage records, e.g. `sha256`, `validation_status`. */
  fields?: string[];
}

/** A claim about validation, with the strength of its backing. */
export interface ValidationClaim {
  label: string;
  status: EvidenceStatus;
  detail: string;
}

/** A measured test run. Only populate from a run you actually executed. */
export interface TestEvidence {
  suite: string;
  command: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  /** Why anything was skipped — required if `skipped > 0`, otherwise the
   *  number reads as a clean run when it isn't. */
  skippedBecause?: string;
  /** ISO date the run was actually executed. */
  verifiedOn: string;
}

/** One line of a CURRENT STATE block: subsystem → status → detail. */
export interface StateItem {
  label: string;
  status: EvidenceStatus;
  detail: string;
}

/**
 * The four-block 30-second read (spec §08).
 *
 * Deliberately a separate object rather than a reuse of `description`,
 * `problem` and `results`. Those three were written to be *complete* — a
 * problem statement has to explain the fragmentation, a description has to
 * cover the whole pipeline. A recruiter gives each of them about four
 * seconds. Compressing them automatically would produce either a truncated
 * claim or an unreadable one, so the short form is written on purpose and
 * the long form stays long.
 *
 * Each field is 1–2 sentences. Four blocks, no walls of text.
 */
export interface ProjectBrief {
  /** Why this existed / what was broken. 1–2 sentences. */
  problem: string;
  /** What actually got built, in concrete nouns. 1–2 sentences. */
  built: string;
  /** The one or two engineering ideas worth naming. 1–2 sentences. */
  approach: string;
  /** The result, and the evidence behind it. 1–2 sentences. */
  result: string;
}

/** One real HTTP endpoint on the project's API. */
export interface ApiEndpoint {
  method: "GET" | "POST";
  path: string;
  purpose: string;
  verified?: EvidenceStatus;
}

/** A subsystem that must be kept visibly separate from the main system. */
export interface ScopedAside {
  title: string;
  status: EvidenceStatus;
  body: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  featured: boolean;
  /** Explicit narrative position. Falls back to catalogue index — the
   *  array order IS the narrative order; this only makes it explicit. */
  order?: number;

  tagline: string;
  description: string;

  /**
   * One memorable engineering hook (spec §06).
   *
   * Seven projects sharing one structure stops reading as seven projects.
   * This is the single line that makes a row distinguishable in a three
   * second scan — a number where one exists, a technique where one does
   * not. It is required, and `data/projects.test.ts` asserts every project
   * has a non-empty one, because a hook nobody wrote is worse than no hook.
   */
  hook: string;

  /**
   * The one piece of evidence shown on an index row and in the case-study
   * hero (spec §50).
   *
   * A number ONLY where a number has actually been measured. Where there is
   * no verified figure, this is an evidence *statement* — "multi-provider
   * architecture", "16,228-player FC26 foundation" — never a fabricated
   * percentage standing in for one.
   */
  evidence: string;

  /** The 30-second four-block read, rendered directly under the hero. */
  brief: ProjectBrief;

  technologies: string[];

  /**
   * The 3–7 chips shown on an index card (spec §05), curated rather than
   * sliced. The full `technologies` array stays the honest inventory;
   * this is only what fits the card. Falls back to `technologies` when
   * absent, so an uncurated project still renders a valid chip row.
   */
  keyTechnologies?: string[];

  /** Short topical keywords, used on index rows and the domain map. */
  tags?: string[];

  metrics?: Metric[];

  problem?: string;
  /** Boundary conditions the design is built around. */
  constraints?: Constraint[];
  architecture?: ArchitectureSection;
  /** A distinct, explicitly-drawn flow for projects whose whole point is
   *  how data moves. Rendered as its own figure. */
  dataFlow?: PipelineStage[];
  /**
   * Figure title / caption overrides for `dataFlow`.
   *
   * The flow figure was written for a player-intelligence pipeline and its
   * defaults say so ("Intelligence pipeline", and a caption about querying
   * a stable representation of attributes). A project whose flow is a
   * conversation must be able to name its own figure rather than inherit
   * that one. Optional, so every existing project renders exactly as it
   * did before.
   */
  dataFlowTitle?: string;
  dataFlowCaption?: string;
  /** Upstream providers/sources, rendered as a provider graph. */
  providers?: ProviderEntry[];
  /** Provider × resource capability registry, from real registry data. */
  capabilities?: CapabilityRow[];
  /** Source → run → snapshot → record → consumer lineage. */
  lineage?: LineageStep[];
  /** Structured validation claims with evidence strength. */
  validationClaims?: ValidationClaim[];
  /** Measured test runs. */
  testing?: TestEvidence[];
  /** Explicit subsystem-by-subsystem current state. */
  stateItems?: StateItem[];
  /** Real API surface. */
  apiSurface?: ApiEndpoint[];
  /** Subsystems deliberately kept out of the main system. */
  separatelyScoped?: ScopedAside[];
  /** Version-aware release history, e.g. FC26 baseline → FC27 active. */
  versionHistory?: VersionEntry[];

  /** How the architecture should be drawn. See `ArchitectureShape`. */
  architectureShape?: ArchitectureShape;
  /**
   * One sentence: the engineering claim this project makes. Written to be
   * readable in five seconds, and true of every claim on the site.
   */
  thesis?: string;
  implementation?: string;
  algorithms?: string;
  validation?: string;
  results?: string;
  engineeringDecisions?: Decision[];
  /** Concrete problem → decision → result. Worth more than any adjective. */
  tradeoffs?: Tradeoff[];
  /**
   * What is genuinely not done yet, or not covered. Required for the
   * portfolio's credibility — an engineering claim with no stated boundary
   * reads as marketing. Populated for every project.
   */
  limitations?: string;
  /** The next concrete iteration, where genuinely known. */
  nextIteration?: string;
  currentState?: string;
  /** Drives this project's visual expression. See `VisualizationType`. */
  visualizationType?: VisualizationType;
  links: ProjectLinks;
  media?: ProjectMedia;
}

/**
 * Nominal year or date label for a project.
 *
 * The old gate used the sentinel `"TBD"` to mean "genuinely unknown", but
 * TBD was filtered out by every consumer, so a project with it simply
 * rendered without a year and looked like an omission. The model now prefers
 * an explicit four-digit year where one is documented, and a clearly labelled
 * untyped value where it is not.
 *
 * The validation gate still rejects `"TBD"` so the sentinel cannot silently
 * ship, but the type no longer pretends every project has a numeric year.
 */
export type ProjectYear = `${number}`;
