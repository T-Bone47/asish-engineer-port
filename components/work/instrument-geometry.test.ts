import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  INSTRUMENT_PALETTE_CSS_VARS,
  InstrumentSvg,
  TYPE_LABEL,
  type InstrumentPalette,
} from "@/components/work/instrument-geometry";
import { projects } from "@/data/projects";
import { ogPalette } from "@/lib/og/palette";
import type { VisualizationType } from "@/types/project";

/**
 * Geometry parity between the two places the instruments are now drawn.
 *
 * The site colours them with `var(--color-*)`; the social cards run in satori,
 * which cannot resolve a CSS variable, so they colour the same paths with
 * literal hex from `lib/og/palette.ts`. The whole point of extracting the
 * shapes was that there is one copy of them — but "one copy" is a claim about
 * the code, not about the output, and the two call sites pass different
 * palettes through a code path that has no reason to keep them aligned.
 *
 * These assertions test the output instead: for every instrument, the hex
 * rendering must equal the CSS-variable rendering with *only* the colour
 * values substituted. Same elements, same attributes, same order, same
 * coordinates. If someone re-adds a path to one palette's version, or drops a
 * `<g>`, this fails.
 *
 * Re-rendering through `react-dom/server` is the honest way to check this:
 * it is the same renderer the site ships, so it is the same markup a browser
 * receives, not a description of it.
 */
const hexPalette: InstrumentPalette = {
  accent: ogPalette.accent,
  data: ogPalette.data,
  live: ogPalette.live,
  borderStrong: ogPalette.borderStrong,
  foregroundFaint: ogPalette.foregroundFaint,
};

/** Every `var(--color-*)` the geometry may use, and its card equivalent. */
const HEX_BY_VAR: Record<string, string> = {
  "var(--color-accent)": ogPalette.accent,
  "var(--color-data)": ogPalette.data,
  "var(--color-live)": ogPalette.live,
  "var(--color-border-strong)": ogPalette.borderStrong,
  "var(--color-foreground-faint)": ogPalette.foregroundFaint,
};

const render = (type: VisualizationType, palette: InstrumentPalette) =>
  renderToStaticMarkup(createElement(InstrumentSvg, { type, palette }));

/** The types the catalogue actually uses — the only ones that must line up. */
const usedTypes = [
  ...new Set(
    projects
      .map((project) => project.visualizationType)
      .filter((type): type is VisualizationType => Boolean(type))
  ),
];

describe("instrument geometry", () => {
  it("is used by every project, and every used type has a label", () => {
    // Guards the card's `visualizationType &&` branch: with this true, no
    // project can ship a preview card that silently loses its motif.
    expect(usedTypes.length).toBe(projects.length);

    for (const type of usedTypes) {
      expect(TYPE_LABEL[type], `no TYPE_LABEL for "${type}"`).toBeTruthy();
    }
  });

  it.each(usedTypes)("%s: the card geometry is the site geometry, recoloured", (type) => {
    const site = render(type, INSTRUMENT_PALETTE_CSS_VARS);
    const card = render(type, hexPalette);

    const expectedOnCard = site.replace(
      /var\(--color-[a-z-]+\)/g,
      (token) => HEX_BY_VAR[token] ?? token
    );

    expect(card).toBe(expectedOnCard);
  });

  it.each(usedTypes)("%s: no unresolved CSS variable reaches the card", (type) => {
    expect(render(type, hexPalette)).not.toContain("var(--");
  });

  it.each(usedTypes)("%s: the site rendering actually uses tokens, not hex", (type) => {
    const site = render(type, INSTRUMENT_PALETTE_CSS_VARS);
    expect(site).toContain("var(--color-");
    expect(site).not.toMatch(/#[0-9a-fA-F]{6}/);
  });

  it("draws a different shape for every instrument", () => {
    // The reason the instruments exist: a telemetry pipeline and a numerical
    // solver must not be visually interchangeable.
    const shapes = usedTypes.map((type) => render(type, hexPalette));
    expect(new Set(shapes).size).toBe(shapes.length);
  });

  it("is aria-hidden unless the caller asks for a description", () => {
    const hidden = renderToStaticMarkup(
      createElement(InstrumentSvg, { type: "telemetry", palette: hexPalette })
    );
    expect(hidden).toContain('aria-hidden="true"');
    expect(hidden).not.toContain('role="img"');

    const labelled = renderToStaticMarkup(
      createElement(InstrumentSvg, { type: "telemetry", palette: hexPalette, labelled: true })
    );
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain("illustrative schematic");
    expect(labelled).not.toContain('aria-hidden="true"');
  });
});
