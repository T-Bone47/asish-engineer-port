import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  projects,
  getProjectBySlug,
  getNextProject,
  getPreviousProject,
  getProjectNumber,
} from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { StatusBadge } from "@/components/ui/Badge";
import { CaseStudySection } from "@/components/work/CaseStudySection";
import { ArchitecturePipeline } from "@/components/work/ArchitecturePipeline";
import { ProjectInstrument, instrumentLabel } from "@/components/work/ProjectInstrument";
import { BriefGrid } from "@/components/work/BriefGrid";
import { DetailGroup, TechnicalDetail } from "@/components/work/TechnicalDetail";
import { VersionBuckets, VersionWall } from "@/components/work/figures/VersionWall";
import { ProviderGraph } from "@/components/work/figures/ProviderGraph";
import { CapabilityMatrix, DataLineage } from "@/components/work/figures/CapabilityMatrix";
import {
  ApiSurface,
  ConstraintList,
  ScopedAsideCard,
  StateBlock,
  TestEvidenceTable,
  ValidationMatrix,
} from "@/components/work/figures/EvidencePanels";
import {
  FeatureSpace,
  IntelligencePipeline,
} from "@/components/work/figures/IntelligencePipeline";
import { EvidenceLegend } from "@/components/work/figures/EvidenceBadge";
import { pageMetadata } from "@/lib/metadata";
import { projectCardAlt } from "@/lib/og/project-card";

/** The standard case-study order (spec §09). Section numbers are assigned
 *  from this list, so a project renders only the sections it has and the
 *  remaining numbers stay contiguous. */
const SECTION_ORDER = [
  "overview",
  "problem",
  "system",
  "dataFlow",
  "engineering",
  "evidence",
  "currentState",
  "limitations",
  "next",
  "technologies",
  "links",
] as const;

type SectionKey = (typeof SECTION_ORDER)[number];

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Next.js 16: params is a Promise on every page/layout/generateMetadata —
// this isn't the old deprecated-but-working Next 15 shim, it's required.
type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  // Uses the shared builder so the case study keeps its canonical URL and
  // its og:image. The previous hand-written object replaced `openGraph`
  // wholesale, which silently dropped the social preview image from all
  // six case studies.
  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${project.slug}`,
    type: "article",
    // This project's own preview card, generated from its own instrument and
    // its own key evidence by app/work/[slug]/opengraph-image.tsx. Without
    // this every case study advertised the site card, so eight different
    // systems shared one preview. The alt travels with it because a static
    // `alt` on the image route cannot read the route params.
    image: {
      path: `/work/${project.slug}/opengraph-image`,
      alt: projectCardAlt(project),
    },
  });
}

/**
 * CASE STUDY — the recruiter-first reading order.
 *
 * Structure follows spec §09: overview → problem → system → engineering →
 * evidence → current state → limitations → next → technologies → links,
 * with only the sections a project actually has.
 *
 * What changed and why. This page previously rendered sixteen or seventeen
 * `h2` sections on the two football projects, with provider matrices,
 * capability registries, endpoint tables and per-subsystem state inline in
 * the primary view. That is a design document, not a portfolio, and it
 * meant the two strongest engineering projects on the site were also the
 * two hardest to read. Everything that only matters to a reader who has
 * already opted in now lives inside the `TechnicalDetail` panel at the
 * bottom; everything a recruiter needs — purpose, domain, status,
 * evidence, limitations — is above it and never behind a click.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // `visibility` is a control field on the links object, not a URL. It used
  // to pass this filter and render as a link labelled "visibility" with a
  // relative href, on every project recorded as `unpublished` — F1 Lap-Time
  // Simulator, Sentinel AI, and any project added the same way.
  const links = Object.entries(project.links).filter(
    (entry): entry is [string, string] =>
      entry[0] !== "visibility" && typeof entry[1] === "string"
  );
  const nextProject = getNextProject(project.slug);
  const previousProject = getPreviousProject(project.slug);
  const projectNumber = getProjectNumber(project.slug);

  const keyTech = project.keyTechnologies ?? project.technologies;
  const headlineMetric = project.metrics?.[0];

  // Figure numbers are allocated in render order, skipping blocks a given
  // project does not populate. Assigning fixed numbers per block type
  // instead would leave gaps — EA FC has no provider layer, so a
  // hard-coded mapping produced "Fig. 01, 03, 07, 08, 09" and read like
  // figures had been deleted.
  let figureCount = 0;
  const nextFigure = (): number => {
    figureCount += 1;
    return figureCount;
  };

  // Allocation order MUST match JSX render order below, or the figures come
  // out numbered out of sequence on the page (architecture rendered before
  // data flow, but numbered after it). Kept adjacent to the JSX so the two
  // stay in step. Main-view figures first, then the appendix figures.
  const architectureFigure = project.architecture?.pipeline?.length ? nextFigure() : undefined;
  const flowFigure = project.dataFlow?.length ? nextFigure() : undefined;
  const validationFigure = project.validationClaims?.length ? nextFigure() : undefined;
  const providerFigure = project.providers?.length ? nextFigure() : undefined;
  const capabilityFigure = project.capabilities?.length ? nextFigure() : undefined;
  const lineageFigure = project.lineage?.length ? nextFigure() : undefined;
  const featureSpaceFigure = project.visualizationType === "dataset" ? nextFigure() : undefined;

  // Primary action: a real destination when one exists, otherwise the
  // honest one. No repository or demo URLs have been supplied for any
  // project yet, and inventing them is not an option (spec §57) — so the
  // button deep-links into the case study instead of linking nowhere.
  const primaryLink = project.links.repository ?? project.links.demo;

  // Is there anything to disclose? Live F1 has trade-offs and validation
  // prose but no registry, no endpoint table and no algorithm write-up,
  // so an always-rendered panel gave it a "TECHNICAL DETAIL +" affordance
  // promising provider contracts and a capability registry that the page
  // does not contain. An empty appendix is worse than none: it advertises
  // depth and then delivers an empty box.
  const hasAppendix = Boolean(
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

  // Which numbered sections this project actually earns, in spec §09
  // order. Numbers are allocated from this list rather than hard-coded, so
  // removing a section never leaves a gap like "05" missing from the page.
  const sectionPresent: Record<SectionKey, boolean> = {
    overview: true,
    problem: Boolean(project.problem),
    system: Boolean(project.architecture || project.versionHistory),
    dataFlow: Boolean(project.dataFlow?.length),
    engineering: Boolean(
      project.tradeoffs?.length || project.engineeringDecisions?.length
    ),
    evidence: Boolean(
      project.validationClaims?.length || project.validation || project.testing?.length || project.results
    ),
    currentState: Boolean(project.currentState),
    limitations: Boolean(project.limitations),
    next: Boolean(project.nextIteration),
    technologies: project.technologies.length > 0,
    links: links.length > 0,
  };

  // What the appendix actually contains, named from the data. This summary
  // used to be one fixed sentence naming provider contracts, a capability
  // registry, data lineage and an API surface — which promised four blocks to
  // a project that has none of them, the same "advertises depth, opens empty"
  // failure this panel was rebuilt to eliminate.
  // Leaves out neither a block the project has nor a block it lacks: every
  // entry below is in the render order the appendix itself uses.
  const appendixSummary = [
    project.constraints?.length ? "design constraints" : null,
    project.implementation || project.algorithms ? "implementation notes" : null,
    project.providers?.length ? "provider contracts" : null,
    project.capabilities?.length ? "capability registry" : null,
    project.lineage?.length ? "data lineage" : null,
    project.visualizationType === "dataset" ? "feature space" : null,
    project.testing?.length ? "full test runs" : null,
    project.apiSurface?.length ? "API surface" : null,
    project.stateItems?.length ? "subsystem state" : null,
    project.separatelyScoped?.length ? "scope boundaries" : null,
    project.versionHistory?.length ? "version detail" : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(", ");

  const sectionNumbers = new Map<SectionKey, string>();
  SECTION_ORDER.filter((key) => sectionPresent[key]).forEach((key, i) => {
    sectionNumbers.set(key, String(i + 1).padStart(2, "0"));
  });
  const numberOf = (key: SectionKey): string | undefined => sectionNumbers.get(key);

  return (
    <article>
      {/* Reading progress — orientation on a long case study, drawn from the
          document's own scroll position. Pure CSS scroll timeline
          (globals.css): one compositor transform, no scroll listener, no
          cleanup, no client boundary. `aria-hidden` because it is a
          position indicator, not content — nothing is conveyed only by it. */}
      <div
        aria-hidden="true"
        className="reading-progress fixed left-0 top-0 z-[60] h-px w-full origin-left bg-accent"
      />

      {/* ---------- CASE STUDY HERO (spec §07) ----------
          Identity first: number, status, domain, title, one-sentence
          thesis, two-to-four chips, one piece of evidence, and the two
          actions. No architecture diagram before the reader knows what the
          project is — the instrument is small, decorative and carries its
          own "illustrative" caption. */}
      <Container as="section" className="pt-12 md:pt-16">
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-faint transition-colors hover:text-foreground"
        >
          ← Back to Systems
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-technical text-sm tabular-nums text-accent">
            {projectNumber}
          </span>
          <StatusBadge status={project.status} />
          <TechnicalLabel>{project.tagline}</TechnicalLabel>
          {project.year !== "TBD" && <TechnicalLabel>{project.year}</TechnicalLabel>}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-12">
          {/* `.seq-page` sequences title → thesis → chips. The h1 is the
              block's first child, which is what keeps it on the
              translate-only keyframe and therefore out of the LCP path. */}
          <div className="seq-page lg:col-span-7">
            <h1 className="font-display text-display-xl uppercase leading-[0.95] tracking-tight">
              {project.title}
            </h1>

            {project.thesis && (
              <p className="mt-6 max-w-3xl font-display text-xl leading-snug tracking-tight text-foreground md:text-2xl">
                {project.thesis}
              </p>
            )}

            {/* Two to four chips, not the full stack — the rest is in §09. */}
            {keyTech.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {keyTech.slice(0, 4).map((tech) => (
                  <li
                    key={tech}
                    className="border border-border-subtle px-2.5 py-1 font-technical text-[11px] uppercase tracking-[0.1em] text-foreground-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* This project's own visual expression, kept small and
              captioned. It identifies the system at a glance without
              putting an architecture diagram in front of a reader who has
              not yet been told what the project is (§07). */}
          {project.visualizationType && (
            <div className="lg:col-span-5">
              <figure className="border border-border-subtle bg-surface/40 p-4">
                <div className="h-[84px] w-full">
                  <ProjectInstrument
                    type={project.visualizationType}
                    labelled
                    className="h-full w-full"
                  />
                </div>
                <figcaption className="mt-3 font-technical text-[10px] uppercase tracking-[0.15em] text-foreground-faint">
                  {instrumentLabel(project.visualizationType)} · illustrative schematic
                </figcaption>
              </figure>
            </div>
          )}
        </div>

        {/* One evidence item. A measured figure where one exists; an
            evidence statement where one does not — never a number
            standing in for a number nobody has (spec §50). */}
        <div className="mt-10 border-y border-border-subtle py-7">
          <TechnicalLabel className="text-foreground-faint">Key evidence</TechnicalLabel>
          {headlineMetric ? (
            <div className="mt-3">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-technical text-3xl leading-none tabular-nums text-accent md:text-4xl">
                  {headlineMetric.value}
                </span>
                <span className="font-technical text-sm uppercase tracking-[0.15em] text-foreground">
                  {headlineMetric.label}
                </span>
              </div>
              {/* The note carries the caveat. "609 tests passed" without
                  "61 skipped" reads cleaner than the run was, and the
                  whole discipline of this portfolio is that it is not. */}
              {headlineMetric.note && (
                <p className="mt-2 font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                  {headlineMetric.note}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 font-technical text-lg uppercase tracking-[0.1em] text-foreground md:text-xl">
              {project.evidence}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {primaryLink ? (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-accent px-5 py-3 font-technical text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-background"
            >
              View Source <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <a
              href="#system"
              className="inline-flex min-h-11 items-center gap-2 border border-accent px-5 py-3 font-technical text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-background"
            >
              Explore the system <span aria-hidden="true">↓</span>
            </a>
          )}
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-foreground"
          >
            Back to Systems
          </Link>
        </div>
      </Container>

      <Container as="section" className="pt-14 md:pt-16">
        {/* ---------- 30-SECOND READ ----------
            The four blocks immediately below the hero, before any
            diagram, table or long-form prose. */}
        <CaseStudySection label="Overview" index={numberOf("overview")}>
          <BriefGrid brief={project.brief} />
        </CaseStudySection>

        {project.problem && (
          <CaseStudySection label="Problem" index={numberOf("problem")}>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
              {project.problem}
            </p>
          </CaseStudySection>
        )}

        {/* ---------- SYSTEM ----------
            Architecture as a diagram, not five paragraphs (§10). The
            version wall sits here for version-aware projects because the
            version boundary IS the system on those. */}
        {(project.architecture || project.versionHistory) && (
          <CaseStudySection label="System" index={numberOf("system")} id="system">
            {project.versionHistory && project.versionHistory.length > 0 && (
              <VersionWall versions={project.versionHistory} compact />
            )}

            {project.architecture && (
              <>
                <p className="max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
                  {project.architecture.summary}
                </p>
                {project.architecture.pipeline && architectureFigure && (
                  <div className="mt-8">
                    <ArchitecturePipeline
                      stages={project.architecture.pipeline}
                      shape={project.architectureShape}
                      sources={project.architecture.sources}
                      figure={architectureFigure}
                    />
                  </div>
                )}
              </>
            )}
          </CaseStudySection>
        )}

        {project.dataFlow && project.dataFlow.length > 0 && flowFigure && (
          <CaseStudySection label="Data Flow" index={numberOf("dataFlow")}>
            {/* The figure's own title and caption are overridable because a
                flow is not always an attribute pipeline: F1 Voice Engineer's
                is a spoken conversation, and inheriting this component's
                player-intelligence wording would describe a shape it does
                not have. Projects that set neither render exactly as before. */}
            <IntelligencePipeline
              stages={project.dataFlow}
              figure={flowFigure}
              title={project.dataFlowTitle ?? "Intelligence pipeline"}
              caption={project.dataFlowCaption}
            />
          </CaseStudySection>
        )}

        {/* ---------- ENGINEERING ----------
            Trade-offs and decisions: what was hard, what was chosen, what
            it cost. Worth more to a technical reader than any adjective,
            and short enough to survive the 30-second scan. */}
        {(project.tradeoffs?.length || project.engineeringDecisions?.length) && (
          <CaseStudySection label="Engineering" index={numberOf("engineering")}>
            {project.tradeoffs && project.tradeoffs.length > 0 && (
              <dl className="space-y-8">
                {project.tradeoffs.map((t, i) => (
                  <div key={t.problem} className="border-t border-border-strong pt-4">
                    <dt className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
                      Trade-off {String(i + 1).padStart(2, "0")}
                    </dt>
                    <dd className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                      <p className="font-body text-sm text-foreground-muted">
                        <span className="block font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                          Problem
                        </span>
                        <span className="mt-1.5 block">{t.problem}</span>
                      </p>
                      <p className="font-body text-sm text-foreground-muted">
                        <span className="block font-technical text-[11px] uppercase tracking-[0.15em] text-accent">
                          Decision
                        </span>
                        <span className="mt-1.5 block">{t.decision}</span>
                      </p>
                      <p className="font-body text-sm text-foreground-muted">
                        <span className="block font-technical text-[11px] uppercase tracking-[0.15em] text-data">
                          Result
                        </span>
                        <span className="mt-1.5 block">{t.result}</span>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
              <dl className="mt-10 max-w-2xl space-y-6">
                {project.engineeringDecisions.map((decision) => (
                  <div key={decision.title} className="border-t border-border-subtle pt-4">
                    <dt className="font-display text-lg uppercase tracking-tight">
                      {decision.title}
                    </dt>
                    <dd className="mt-1.5 font-body text-foreground-muted">{decision.rationale}</dd>
                  </div>
                ))}
              </dl>
            )}
          </CaseStudySection>
        )}

        {/* ---------- EVIDENCE ----------
            Validation claims stay in the primary view: this is the part
            that proves the work, and hiding it behind a disclosure would
            be hiding substance rather than complexity. The test table does
            not — it is reported here as one line, and the full run detail
            lives in the appendix. */}
        {(project.validationClaims?.length ||
          project.validation ||
          project.testing?.length ||
          project.results) && (
          <CaseStudySection label="Evidence" index={numberOf("evidence")}>
            {project.validation && (
              <p className="max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
                {project.validation}
              </p>
            )}

            {project.testing && project.testing.length > 0 && (
              <ul className="mt-6 space-y-2">
                {project.testing.map((run) => (
                  <li
                    key={`${run.suite}-${run.verifiedOn}`}
                    className="font-body text-sm leading-relaxed text-foreground-muted"
                  >
                    <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground">
                      {run.suite}
                    </span>{" "}
                    — {run.total} collected · {run.passed} passed · {run.failed} failed ·{" "}
                    {run.skipped} skipped
                    {run.skipped > 0 && run.skippedBecause
                      ? ` (${run.skippedBecause.replace(/\s+that was not reachable.*$/i, "")})`
                      : ""}
                  </li>
                ))}
              </ul>
            )}

            {project.validationClaims && project.validationClaims.length > 0 && validationFigure && (
              <div className={project.testing?.length ? "mt-8" : ""}>
                <ValidationMatrix claims={project.validationClaims} figure={validationFigure} />
                <EvidenceLegend className="mt-6" />
              </div>
            )}

            {project.results && (
              <p className="mt-6 max-w-2xl font-body text-foreground-muted">{project.results}</p>
            )}
          </CaseStudySection>
        )}

        {project.currentState && (
          <CaseStudySection label="Current State" index={numberOf("currentState")}>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
              {project.currentState}
            </p>
          </CaseStudySection>
        )}

        {project.limitations && (
          <CaseStudySection label="Limitations" index={numberOf("limitations")}>
            <p className="max-w-2xl border-l-2 border-critical/60 pl-5 font-body text-foreground-muted">
              {project.limitations}
            </p>
          </CaseStudySection>
        )}

        {project.nextIteration && (
          <CaseStudySection label="Next" index={numberOf("next")}>
            <p className="max-w-2xl font-body text-foreground-muted">{project.nextIteration}</p>
          </CaseStudySection>
        )}

        {project.technologies.length > 0 && (
          <CaseStudySection label="Technologies" index={numberOf("technologies")}>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="border border-border-subtle px-2.5 py-1 font-technical text-[11px] uppercase tracking-[0.1em] text-foreground-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </CaseStudySection>
        )}

        {links.length > 0 && (
          <CaseStudySection label="Links" index={numberOf("links")}>
            <ul className="flex flex-wrap gap-6">
              {links.map(([kind, href]) => (
                <li key={kind}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-technical text-xs uppercase tracking-[0.15em] text-foreground hover:text-accent"
                  >
                    {kind} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </CaseStudySection>
        )}

        {/* ---------- LEVEL 4: TECHNICAL DETAIL ----------
            Everything a technical reader came for and a recruiter never
            reads: design constraints, algorithm write-ups, provider
            matrices, registries, lineage, subsystem state, endpoint
            tables and the full test runs. Closed by default, native
            `<details>`, no client JavaScript. Nothing here is a secret —
            it is simply not the first thing a reader should meet. */}
        {hasAppendix && (
          <TechnicalDetail
            className="mt-4"
            label="Technical Detail"
            summary={`${appendixSummary.charAt(0).toUpperCase()}${appendixSummary.slice(1)}.`}
          >
            <div className="space-y-10">
              {project.constraints && project.constraints.length > 0 && (
                <DetailGroup label="Design constraints">
                  <ConstraintList constraints={project.constraints} />
                </DetailGroup>
              )}

              {(project.implementation || project.algorithms) && (
                <DetailGroup label={project.implementation ? "Implementation" : "Algorithms / models"}>
                  {project.implementation && (
                    <p className="max-w-2xl font-body text-foreground-muted">{project.implementation}</p>
                  )}
                  {project.algorithms && (
                    <p className="max-w-2xl font-body text-foreground-muted">{project.algorithms}</p>
                  )}
                </DetailGroup>
              )}

              {project.providers && project.providers.length > 0 && providerFigure && (
                <DetailGroup label="Provider abstraction">
                  <ProviderGraph
                    providers={project.providers}
                    contractLabel="RawResponse"
                    contractDetail="One frozen response type carrying the raw bytes, content type, source URL, retrieval timestamp and status code. Nothing above the adapter layer is permitted to know which provider produced it."
                    outputLabel="Canonical football model"
                    outputDetail="Competition, season, club, player, match, events, lineups and statistics — provider-agnostic entities that every downstream system reads."
                    figure={providerFigure}
                  />
                </DetailGroup>
              )}

              {project.capabilities && project.capabilities.length > 0 && capabilityFigure && (
                <DetailGroup label="Capability registry">
                  <CapabilityMatrix rows={project.capabilities} figure={capabilityFigure} />
                </DetailGroup>
              )}

              {project.lineage && project.lineage.length > 0 && lineageFigure && (
                <DetailGroup label="Data lineage">
                  <DataLineage steps={project.lineage} figure={lineageFigure} />
                </DetailGroup>
              )}

              {featureSpaceFigure && (
                <DetailGroup label="Feature space">
                  <FeatureSpace figure={featureSpaceFigure} />
                </DetailGroup>
              )}

              {project.testing && project.testing.length > 0 && (
                <DetailGroup label="Test evidence">
                  <TestEvidenceTable runs={project.testing} />
                </DetailGroup>
              )}

              {project.apiSurface && project.apiSurface.length > 0 && (
                <DetailGroup label="API surface">
                  <ApiSurface endpoints={project.apiSurface} />
                </DetailGroup>
              )}

              {project.stateItems && project.stateItems.length > 0 && (
                <DetailGroup label="Subsystem state">
                  <StateBlock items={project.stateItems} />
                </DetailGroup>
              )}

              {project.separatelyScoped && project.separatelyScoped.length > 0 && (
                <DetailGroup label="Kept out of the main system">
                  <div className="space-y-4">
                    {project.separatelyScoped.map((aside) => (
                      <ScopedAsideCard key={aside.title} aside={aside} />
                    ))}
                  </div>
                </DetailGroup>
              )}

              {project.versionHistory && project.versionHistory.length > 0 && (
                <DetailGroup label="Version detail">
                  <VersionBuckets versions={project.versionHistory} />
                </DetailGroup>
              )}
            </div>
          </TechnicalDetail>
        )}
      </Container>

      {/* ---------- CASE STUDY NAVIGATION ----------
          Previous, next and the full index. One-sided at the ends of the
          catalogue rather than wrapping around, so "previous" never
          points at an unrelated project. */}
      <nav
        aria-label="Case study navigation"
        className="mt-16 border-t border-border-subtle"
      >
        <Container as="div" className="grid grid-cols-1 gap-px py-10 sm:grid-cols-3">
          <div className="sm:col-span-1">
            {previousProject ? (
              <Link
                href={`/work/${previousProject.slug}`}
                className="group block py-3 pr-4 sm:py-0"
              >
                <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-foreground-faint">
                  ← Previous System
                </span>
                <span className="mt-2 block font-display text-lg uppercase leading-tight tracking-tight transition-colors group-hover:text-accent">
                  {previousProject.title}
                </span>
              </Link>
            ) : (
              <p className="py-3 font-technical text-[10px] uppercase tracking-[0.2em] text-foreground-faint/50 sm:py-0">
                Start of catalogue
              </p>
            )}
          </div>

          <div className="sm:col-span-1 sm:text-center">
            <Link
              href="/work"
              className="flex min-h-11 items-center justify-center border border-border-subtle px-4 py-3 font-technical text-[10px] uppercase tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              All Systems ({String(projects.length).padStart(2, "0")})
            </Link>
          </div>

          <div className="sm:col-span-1 sm:text-right">
            {nextProject && (
              <Link
                href={`/work/${nextProject.slug}`}
                className="group block py-3 pl-4 sm:py-0"
              >
                <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-foreground-faint">
                  Next System →
                </span>
                <span className="mt-2 block font-display text-lg uppercase leading-tight tracking-tight transition-colors group-hover:text-accent">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </nav>
    </article>
  );
}
