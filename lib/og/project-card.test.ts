import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getProjectNumber, projects } from "@/data/projects";
import { ProjectCard, projectCardAlt } from "@/lib/og/project-card";
import { ogPalette } from "@/lib/og/palette";

/**
 * What the shared preview is allowed to say.
 *
 * Two failure modes worth automating:
 *
 *  1. The whole point of these cards is that they differ. If a rule change
 *     ever made two projects render the same card, that would be invisible
 *     here and only visible in someone's timeline — so distinctness is
 *     asserted directly rather than assumed from "the data differs".
 *  2. The card is rendered by satori, which has no CSS cascade. A single
 *     `var(--color-accent)` reaching this tree renders black or nothing, with
 *     no build error and no console warning. That is asserted against too.
 *
 * Content assertions are deliberately about *provenance* — the card shows the
 * project's own title, tagline and key evidence — because the risk is not
 * that it renders the wrong shape, it is that it drifts into saying something
 * the case-study page does not.
 */
/**
 * `renderToStaticMarkup` escapes text content (`&` becomes `&amp;`), so a
 * raw `project.tagline` is legitimately absent from the markup — several
 * taglines contain an ampersand. Comparing against the escaped form keeps
 * the assertion about what the card actually renders.
 */
const asRendered = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

const cardFor = (project: (typeof projects)[number]) =>
  renderToStaticMarkup(
    createElement(ProjectCard, {
      project,
      index: getProjectNumber(project.slug),
      total: projects.length,
    })
  );

describe("project social cards", () => {
  it("renders a visibly different card for every project", () => {
    const cards = projects.map(cardFor);
    expect(new Set(cards).size).toBe(cards.length);
  });

  it("never leaks an unresolved CSS variable into the satori tree", () => {
    // The instruments are shared with the site, which colours them with
    // `var(--color-*)`. The card must pass the literal palette.
    for (const project of projects) {
      expect(cardFor(project), `${project.slug} card contains a CSS variable`).not.toContain(
        "var(--"
      );
    }
  });

  it.each(projects.map((project) => [project.slug, project] as const))(
    "%s: carries its own title, tagline, catalogue number and instrument",
    (slug, project) => {
      const card = cardFor(project);

      expect(card).toContain(asRendered(project.title));
      expect(card).toContain(asRendered(project.tagline));

      const index = getProjectNumber(slug);
      expect(card).toContain(`CASE STUDY ${index} / ${String(projects.length).padStart(2, "0")}`);

      // The accent is carried by the instrument even when a project has no
      // measured metric, so its presence proves the motif was drawn.
      expect(card, "no accent anywhere — the instrument is missing").toContain(ogPalette.accent);
    }
  );

  it.each(projects.map((project) => [project.slug, project] as const))(
    "%s: shows measured evidence where it exists, an evidence statement where it does not",
    (_slug, project) => {
      const card = cardFor(project);
      const headlineMetric = project.metrics?.[0];

      if (headlineMetric) {
        expect(card).toContain(asRendered(headlineMetric.value));
        expect(card).toContain(asRendered(headlineMetric.label));
      } else {
        // Never promote a prose claim into a figure that does not exist.
        expect(card).toContain(asRendered(project.evidence));
      }
    }
  );

  it("gives every project a distinct, project-specific alt text", () => {
    const alts = projects.map(projectCardAlt);

    expect(new Set(alts).size).toBe(alts.length);

    // Alt text is a plain string handed to metadata, not markup — no escaping
    // applies here, unlike the rendered-card assertions above.
    for (const [i, project] of projects.entries()) {
      expect(alts[i]).toContain(project.title);
      expect(alts[i]).toContain(project.tagline);
      expect(alts[i]?.endsWith(".")).toBe(true);
    }
  });

  it("numbers the catalogue without gaps or repeats", () => {
    const numbers = projects.map((project) => getProjectNumber(project.slug));

    expect(numbers).toEqual(
      Array.from({ length: projects.length }, (_, i) => String(i + 1).padStart(2, "0"))
    );
  });
});
