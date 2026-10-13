import { STATUS_LABEL } from "@/components/ui/Badge";
import { InstrumentSvg } from "@/components/work/instrument-geometry";
import { siteIdentity } from "@/data/site";
import type { Project, ProjectCategory } from "@/types/project";
import { ogPalette } from "./palette";

/**
 * The project social card — one per case study, and the site's own card
 * skeleton rather than a second, unrelated design.
 *
 * WHAT IT HAS TO SOLVE. Eight case studies shared one preview image, so
 * eight different pieces of engineering arrived in a chat or a timeline
 * looking like eight links to the same page. The card therefore has to be
 * distinct per project while still being unmistakably from this portfolio.
 *
 * Both halves of that come from reusing what already exists instead of
 * inventing a card language:
 *
 *   distinct   the project's own instrument motif (`visualizationType`),
 *              which is the same geometry its case-study hero draws — so a
 *              link preview and the page it opens are recognisably the
 *              same system;
 *   family     the palette, the corner registration marks, the technical
 *              tracked-uppercase labels, and the case-study hero's own
 *              reading order: catalogue number, status, tagline, title,
 *              key evidence.
 *
 * The content is the hero's, compressed: nothing here is a claim that is
 * not already on the page it points at. Where a project has no measured
 * metric, the card shows its `evidence` statement — it never promotes a
 * label into a number that does not exist.
 *
 * RENDERER CONSTRAINTS (`next/og` / satori). No CSS variables, no cascade,
 * no class names: every colour is a literal from `./palette`, every
 * multi-child `div` declares `display: flex`, and text nodes are passed as
 * complete strings so nothing depends on inline-element layout. Satori has
 * no display font available to it either (it ships one regular face), so
 * hierarchy is carried by size and colour rather than weight — which is how
 * the site's existing card already works.
 */

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  motorsport: "MOTORSPORT SYSTEMS",
  "ai-ml": "AI / MACHINE LEARNING",
  "simulation-game": "SIMULATION & GAME SYSTEMS",
  "data-platform": "DATA PLATFORM",
  "enterprise-grc": "ENTERPRISE GRC",
  voice: "VOICE & MOTORSPORT ENGINEERING",
};

/** Satori cannot resolve `var(--color-*)`; these are the literal equivalents. */
const INSTRUMENT_PALETTE_HEX = {
  accent: ogPalette.accent,
  data: ogPalette.data,
  live: ogPalette.live,
  borderStrong: ogPalette.borderStrong,
  foregroundFaint: ogPalette.foregroundFaint,
};

export const OG_CARD_SIZE = { width: 1200, height: 630 } as const;

/**
 * Per-project alt text.
 *
 * Lives here, next to the card, because the two must agree: this is what a
 * screen-reader user hears when the preview image is described, and it is
 * set on the page's metadata (a static `alt` export on the image route
 * cannot read the route's params).
 */
export function projectCardAlt(project: Project): string {
  return `${project.title} — ${project.tagline}. ${CATEGORY_LABEL[project.category]} engineering case study by ${siteIdentity.name}.`;
}

const eyebrow = {
  fontSize: 22,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: ogPalette.foregroundFaint,
  lineHeight: 1,
};

const metaLabel = {
  fontSize: 20,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  lineHeight: 1,
};

export function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  /** Catalogue position, e.g. "07" — the same number the case-study hero shows. */
  index: string;
  total: number;
}) {
  const headlineMetric = project.metrics?.[0];
  const isActive = project.status === "active";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: ogPalette.background,
        padding: 68,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* registration marks — the same geometry the site's own card uses, so
          a project preview and the homepage preview read as one family */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 48,
          width: 28,
          height: 28,
          borderTop: `3px solid ${ogPalette.borderStrong}`,
          borderLeft: `3px solid ${ogPalette.borderStrong}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 48,
          width: 28,
          height: 28,
          borderTop: `3px solid ${ogPalette.borderStrong}`,
          borderRight: `3px solid ${ogPalette.borderStrong}`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* band 1 — who this belongs to, and where it sits in the catalogue */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={eyebrow}>{siteIdentity.name}</div>
          <div style={eyebrow}>{`CASE STUDY ${index} / ${String(total).padStart(2, "0")}`}</div>
        </div>

        {/* band 2 — the three facts the case-study hero leads with */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* The status lamp follows the site's own rule: only "active" gets
                the reserved live green, everything else reads neutral. */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 12,
                background: isActive ? ogPalette.live : ogPalette.foregroundFaint,
              }}
            />
            <div
              style={{
                ...metaLabel,
                color: isActive ? ogPalette.live : ogPalette.foregroundMuted,
              }}
            >
              {STATUS_LABEL[project.status]}
            </div>
            <div style={{ ...metaLabel, color: ogPalette.foregroundFaint }}>
              {CATEGORY_LABEL[project.category]}
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 72,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: ogPalette.foreground,
            }}
          >
            {project.title}
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              lineHeight: 1.3,
              color: ogPalette.foregroundMuted,
            }}
          >
            {project.tagline}
          </div>
        </div>
      </div>

      {/* band 3 — the readout panel: key evidence beside this project's own
          instrument, mirroring the hero's evidence band + captioned figure */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
          padding: 26,
          background: ogPalette.surface,
          border: `2px solid ${ogPalette.borderStrong}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ ...metaLabel, fontSize: 18, color: ogPalette.foregroundFaint }}>
            KEY EVIDENCE
          </div>
          {headlineMetric ? (
            <>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 56,
                  lineHeight: 1,
                  color: ogPalette.accent,
                }}
              >
                {headlineMetric.value}
              </div>
              <div
                style={{
                  marginTop: 12,
                  ...metaLabel,
                  color: ogPalette.foregroundMuted,
                }}
              >
                {headlineMetric.label}
              </div>
            </>
          ) : (
            <div
              style={{
                marginTop: 14,
                fontSize: 26,
                lineHeight: 1.35,
                color: ogPalette.foregroundMuted,
              }}
            >
              {project.evidence}
            </div>
          )}
        </div>

        {/* Gated on presence, like every other figure in this template: a
            project without a declared visualization gets the readout without
            the motif rather than a borrowed one. `data/projects.test.ts`
            asserts every project in the catalogue declares one, so this
            branch is a guard against future data, not a live path. */}
        {project.visualizationType && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <InstrumentSvg
            type={project.visualizationType}
            palette={INSTRUMENT_PALETTE_HEX}
            width={371}
            height={108}
          />
          {/* The site captions this same figure "… · illustrative schematic".
              The card keeps the honesty label but drops the description: the
              full sentence runs to 66 characters and would wrap out of the
              panel. The description is still on the page this links to, and
              still in the figure's own aria-label. */}
          <div
            style={{
              marginTop: 12,
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ogPalette.foregroundFaint,
              textAlign: "right",
            }}
          >
            ILLUSTRATIVE SCHEMATIC
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
