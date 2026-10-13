import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Motion governance.
 *
 * The motion system is CSS, so nothing in the type system stops a
 * component from writing `duration-300` or a bespoke `cubic-bezier(...)`
 * and quietly forking the design language. This file is that gate. It
 * asserts four things about the repository, each one a requirement from
 * the motion brief rather than an opinion about style:
 *
 *   1. ONE SOURCE FOR TIMING. Every `--motion-*` token is defined exactly
 *      once and used at least once. A token nobody references is dead
 *      CSS; a timing value written into a component instead of a token is
 *      the "arbitrary durations scattered across components" the brief
 *      rules out.
 *   2. NOTHING IS HARDCODED IN COMPONENTS. No `.tsx` file may contain a
 *      literal Tailwind duration (a `duration-` utility with a number), a
 *      named easing such as `ease-out`, or a literal cubic-bezier in a
 *      bracket. Themed values must come through the `--motion-*` tokens.
 *      This file spells no utility inside brackets, in prose or in a
 *      failure message: Tailwind scans the repository for class
 *      candidates, and an example in a comment would be compiled into the
 *      stylesheet as a rule with a literal `*` in it.
 *   3. ANIMATION IS GATED, ALWAYS. No `animation` shorthand or
 *      `animation-name` declaration may exist outside a
 *      `@media (prefers-reduced-motion: no-preference)` block. This is
 *      what keeps "content renders without JavaScript" true for a site
 *      whose whole motion layer is CSS: outside the opt-in the hidden
 *      state does not exist, so there is nothing to be stuck in.
 *   4. NO DEAD OR MISSING KEYFRAMES. Every `@keyframes` is referenced by
 *      an animation, and every animation names a keyframe that exists.
 *
 * The parsers below are deliberately small and literal. A general CSS
 * parser would be the wrong tool for a single file that this project
 * owns, and a regex over the whole stylesheet could not answer the
 * "which at-rule encloses this declaration" question that point 3 needs.
 */

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CSS_PATH = join(ROOT, "app", "globals.css");
const css = readFileSync(CSS_PATH, "utf8");

/** Every directory that may contain shipped source. */
const SOURCE_DIRS = ["app", "components", "lib", "data"];

function sourceFiles(dirs: string[]): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(".tsx")) out.push(full);
    }
  };
  for (const dir of dirs) walk(join(ROOT, dir));
  return out;
}

interface Declaration {
  /** The declaration text, e.g. `animation: glyph-in 240ms ...`. */
  text: string;
  /** Enclosing at-rule preludes, outermost first, e.g. ["@supports (...)", "@media (...)"]. */
  atRules: string[];
  /** Enclosing selectors, outermost first, e.g. [".instrument > *"]. */
  selectors: string[];
}

interface Block {
  isAtRule: boolean;
  prelude: string;
}

/**
 * A brace-aware scan of the stylesheet, so a declaration can be reported
 * together with the at-rules and selectors that enclose it. That enclosing
 * context is the whole point: "is this `animation:` inside the
 * reduced-motion opt-in" is not answerable by a regex over the file.
 */
function parseDeclarations(source: string): Declaration[] {
  const declarations: Declaration[] = [];
  const stack: Block[] = [];
  let pending = "";

  const context = () => ({
    atRules: stack.filter((block) => block.isAtRule).map((block) => block.prelude),
    selectors: stack.filter((block) => !block.isAtRule).map((block) => block.prelude),
  });

  const record = (raw: string) => {
    const text = raw.trim();
    // A declaration is `property: value`; a prelude is anything else. Only
    // declarations are recorded. `@`-prefixed text is never a property.
    if (!text || text.startsWith("@") || !/^[a-z-]+\s*:/i.test(text)) return;
    declarations.push({ text, ...context() });
  };

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];

    if (char === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 1;
      continue;
    }

    if (char === "{") {
      const prelude = pending.trim();
      stack.push({ isAtRule: prelude.startsWith("@"), prelude });
      pending = "";
      continue;
    }

    if (char === "}") {
      // A final declaration is often written without its semicolon.
      record(pending);
      pending = "";
      stack.pop();
      continue;
    }

    if (char === ";") {
      record(pending);
      pending = "";
      continue;
    }

    pending += char;
  }

  return declarations;
}

const declarations = parseDeclarations(css);

/**
 * Capture group 1 of every match, as strings. RegExp match groups are
 * typed `string | undefined` under `strict`, and this file may not use
 * non-null assertions (TR7), so the filter is explicit rather than
 * suppressed.
 */
function captures(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].flatMap((match) => {
    const value = match[1];
    return typeof value === "string" ? [value] : [];
  });
}

describe("motion tokens", () => {
  const tokenDefs = captures(css, /^\s*(--motion-[a-z-]+)\s*:/gm);

  it("defines every token exactly once", () => {
    expect(tokenDefs.length).toBeGreaterThan(0);
    const duplicates = tokenDefs.filter((name, i) => tokenDefs.indexOf(name) !== i);
    expect(duplicates).toEqual([]);
  });

  it("defines the full set of timing roles the brief requires", () => {
    // Duration, easing, distance and stagger are the four categories §10
    // names. Asserted by name so a token cannot be dropped silently.
    for (const required of [
      "--motion-duration-instant",
      "--motion-duration-fast",
      "--motion-duration-base",
      "--motion-duration-reveal",
      "--motion-duration-draw",
      "--motion-duration-ambient",
      "--motion-ease-standard",
      "--motion-ease-mechanical",
      "--motion-lift-sm",
      "--motion-lift",
      "--motion-lift-glyph",
      "--motion-stagger-tight",
      "--motion-stagger",
      "--motion-stagger-loose",
    ]) {
      expect(tokenDefs, `${required} is missing from globals.css`).toContain(required);
    }
  });

  it("uses every token it defines", () => {
    // Both halves matter: the stylesheet consumes tokens in its own
    // primitives, and components consume them through Tailwind arbitrary
    // values. A token used by neither is dead.
    const corpus = [css, ...sourceFiles(SOURCE_DIRS).map((file) => readFileSync(file, "utf8"))].join("\n");
    const unused = tokenDefs.filter((name) => corpus.split(name).length - 1 < 2);
    expect(unused, "unused token — dead CSS, or a value that should reference it").toEqual([]);
  });
});

describe("components do not hardcode timing", () => {
  const files = sourceFiles(SOURCE_DIRS);

  it("scans the shipped source tree", () => {
    expect(files.length).toBeGreaterThan(30);
  });

  it("has no literal duration utility", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const body = readFileSync(file, "utf8");
      if (/duration-\[?\d/.test(body)) offenders.push(relative(ROOT, file));
    }
    // The message deliberately avoids spelling a utility inside brackets:
    // Tailwind scans this repository for class candidates, and a bracketed
    // example in a string would be compiled into the stylesheet.
    expect(offenders, "reference the --motion-duration-* tokens instead").toEqual([]);
  });

  it("has no named or literal easing curve", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const body = readFileSync(file, "utf8");
      // `ease-out` / `ease-in` / `ease-in-out` / `ease-linear` are
      // Tailwind's own curves, not this site's. A literal cubic-bezier in
      // a bracket is the same offence written longhand.
      if (/\bease-(out|in|in-out|linear)\b/.test(body)) offenders.push(relative(ROOT, file));
      // Bracketed form: `ease-[var(--motion-ease-*)]`. Any other bracketed
      // easing — including one that wraps a non-motion var — is not allowed.
      if (body.includes("ease-[")) {
        for (const m of body.matchAll(/ease-\[(.*?)\]/g)) {
          const inner = m[1];
          if (typeof inner === "string" &&
              inner !== "var(--motion-ease-standard)" &&
              inner !== "var(--motion-ease-mechanical)") {
            offenders.push(relative(ROOT, file));
            break;
          }
        }
      }
      // Parens shorthand form: `ease-(--motion-ease-*)`. This is the
      // documented Tailwind v4 form for a CSS-variable token; it adds the
      // `var()` for you, so the only valid contents are a bare custom
      // property name — never a `var(...)` wrapper, and never a non-motion
      // token such as `--color-accent`.
      if (body.includes("ease-(")) {
        for (const m of body.matchAll(/ease-\(([^)]+)\)/g)) {
          const inner = m[1];
          if (typeof inner === "string") {
            // A correct parens easing is exactly one of the two motion-ease
            // tokens, bare (no `var(...)` wrapper).
            if (inner !== "--motion-ease-standard" && inner !== "--motion-ease-mechanical") {
              offenders.push(relative(ROOT, file));
              break;
            }
          }
        }
      }
    }
    expect(offenders, "reference the --motion-ease-* tokens instead").toEqual([]);
  });

  it("has no duration that is not a --motion-duration-* token", () => {
    // The original check only caught a numeric literal (`duration-300`,
    // `duration-[300]`). It let a CSS variable of any kind through, including
    // a colour or spacing variable used where a duration belongs. Tighten it:
    // every `duration-...` in shipped source must reference a
    // `--motion-duration-*` token.
    const offenders: string[] = [];
    for (const file of files) {
      const body = readFileSync(file, "utf8");
      // Bare numeric duration (the original offence).
      if (/duration-\[?\d/.test(body)) {
        offenders.push(relative(ROOT, file));
        continue;
      }
      // Bracketed form: `duration-[var(--motion-duration-*)]`. Any other
      // bracketed duration — including one that wraps a non-motion var — is
      // not allowed.
      if (body.includes("duration-[")) {
        for (const m of body.matchAll(/duration-\[(.*?)\]/g)) {
          const inner = m[1];
          if (typeof inner === "string" &&
              !/^var\(--motion-duration-[a-z-]+\)$/.test(inner)) {
            offenders.push(relative(ROOT, file));
            break;
          }
        }
      }
      // Parens shorthand form: `duration-(--motion-duration-*)`. Same contract
      // as the easing parens form: a bare custom property name, never a
      // `var(...)` wrapper, never a non-motion token.
      if (body.includes("duration=(")) {
        for (const m of body.matchAll(/duration-\(([^)]+)\)/g)) {
          const inner = m[1];
          if (typeof inner === "string" &&
              !/^--motion-duration-[a-z-]+$/.test(inner)) {
            offenders.push(relative(ROOT, file));
            break;
          }
        }
      }
      // A parens form that still wraps in `var(...)` is a misuse of the
      // shorthand (the parens already mean `var(...)`), e.g.
      // `duration-(var(--motion-duration-base))`.
      if (body.includes("duration-(var(")) {
        offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders, "reference the --motion-duration-* tokens instead").toEqual([]);
  });

});

describe("animation is gated behind reduced-motion opt-in", () => {
  const REDUCED_MOTION_OPT_IN = /prefers-reduced-motion:\s*no-preference/;

  it("finds animation declarations to check", () => {
    const animated = declarations.filter((d) => /^animation(-name)?\s*:/.test(d.text));
    expect(animated.length).toBeGreaterThan(8);
  });

  it("never declares an animation outside the opt-in media query", () => {
    const offenders = declarations
      .filter((d) => /^animation(-name)?\s*:/.test(d.text))
      .filter((d) => !d.atRules.some((rule) => REDUCED_MOTION_OPT_IN.test(rule)))
      .map((d) => `${d.selectors.join(" ")} { ${d.text} }`);
    expect(
      offenders,
      "an ungated animation would run for reduced-motion users and could strand the hidden state"
    ).toEqual([]);
  });

  it("gates every scroll-driven timeline as well", () => {
    const SCROLL_TIMELINE = /@supports[^{]*animation-timeline/;
    const offenders = declarations
      .filter((d) => /^animation-timeline\s*:/.test(d.text))
      .map((d) => ({
        d,
        gated:
          d.atRules.some((rule) => REDUCED_MOTION_OPT_IN.test(rule)) &&
          d.atRules.some((rule) => SCROLL_TIMELINE.test(rule)),
      }))
      .filter((entry) => !entry.gated)
      .map((entry) => `${entry.d.selectors.join(" ")} { ${entry.d.text} }`);
    expect(
      offenders,
      "a scroll-driven timeline must be inside @supports (animation-timeline: ...) so browsers without it render the element statically"
    ).toEqual([]);
  });

  it("supports the fallback path it claims: no scroll timeline means no hidden state", () => {
    // Every declaration that hides content lives under both gates, so a
    // browser that lacks view timelines matches none of them. Asserted by
    // counting: the gated blocks exist, and no unconditional rule sets the
    // opacity/transform that the animation is meant to animate.
    expect(css).toContain("@supports (animation-timeline: view())");
    expect(css).toContain("@supports (animation-timeline: scroll())");
    const ungatedReveal = declarations
      // The trailing `[\w-]` guard is the whole point: `\b` after "instrument"
      // treats the hyphen as a word boundary, so `.instrument-row` — a
      // different primitive with a different contract (a `:hover` reveal,
      // not a timeline) — was being swept in by a prefix match.
      .filter((d) => d.selectors.some((s) => /\.(reveal|seq|seq-tight|seq-page|trace-step|instrument)(?![\w-])/.test(s)))
      .filter((d) => /^(opacity|transform|stroke-dashoffset)\s*:/.test(d.text))
      .filter((d) => !d.atRules.some((rule) => REDUCED_MOTION_OPT_IN.test(rule)));
    expect(ungatedReveal.map((d) => `${d.selectors.join(" ")} { ${d.text} }`)).toEqual([]);
  });

  it("gates any opacity that hides glyphs behind an interaction, not an animation", () => {
    // `.instrument-row` is a *hover/focus* reveal, not a timeline: its
    // hidden state is unconditional CSS, which is safe only because the
    // glyphs it hides are `aria-hidden` decoration the row restates in text.
    // That is a different failure surface from a timeline — a timeline can
    // leave content hidden forever if it never fires, a `:hover` rule cannot
    // — so it is asserted separately and precisely rather than folded into
    // the timeline rule above.
    //
    // What this actually protects: if someone later gives this primitive a
    // hidden state on an element that carries text, the build stops.
    const masked = declarations.filter((d) =>
      d.selectors.some((s) => /^\.instrument-row(?![\w-])/.test(s.trim()))
    );
    expect(masked.length).toBeGreaterThan(0);
    for (const d of masked) {
      // The only permitted properties on the primitive itself are the mask
      //'s existence, its positioning, its tint and the transition that
      // times it. A `visibility`, `display` or `transform: scale` hiding
      // state would remove the box itself and reflow the row on reveal,
      // which is the failure this primitive exists to avoid.
      expect(
        d.text,
        `\.instrument-row may only position, tint or transition its mask, found: ${d.text}`
      ).toMatch(/^(content|opacity|background|position|inset|pointer-events|transition|transition-delay)\s*:/);
    }
  });

  it("masks the motif rather than fading it, so authored opacity survives", () => {
    // The reveal must be a mask, not an opacity on the glyph. Two of the
    // nine motifs author `opacity` as artwork — Football Intelligence OS's
    // provider streams sit at 0.85 and its snapshots at 0.75, a deliberate
    // depth cue — and fading the glyph's own opacity overwrites that value
    // to 0 or 1 and loses it. This is the assertion that keeps the fix
    // from being silently reverted to the version that broke it.
    //
    // The parser records one declaration per entry, so a rule is read as
    // the *set* of declarations sharing its selector.
    const maskDecls = declarations.filter((d) => {
      // Indexed access is typed `string | undefined` under
      // `noUncheckedIndexedAccess`, so the length check narrows before the
      // trim rather than being asserted away.
      if (d.selectors.length !== 1) return false;
      const selector = d.selectors[0];
      return selector !== undefined && /^\.instrument-row(?![\w-])::after$/.test(selector.trim());
    });
    expect(maskDecls.length, "the mask pseudo-element is missing").toBeGreaterThan(0);

    const textOf = (property: string) =>
      maskDecls.find((d) => d.text.startsWith(`${property}:`))?.text;

    expect(
      textOf("position"),
      "the mask must be positioned so it can cover the figure"
    ).toBe("position: absolute");
    expect(textOf("content"), 'the mask must be a pseudo-element (content: "")').toBeDefined();
    expect(
      textOf("inset"),
      "the mask must cover the whole figure box, not a sized region"
    ).toBe("inset: 0");
    expect(
      textOf("pointer-events"),
      "the mask must not intercept clicks on the row underneath it"
    ).toBe("pointer-events: none");

    // And no rule may set opacity on a glyph of the row motif.
    const fadesGlyph = declarations
      .filter((d) => d.selectors.some((s) => /\.instrument-row(?![\w-])\s*>\s*\*/.test(s)))
      .map((d) => `${d.selectors.join(" ")} { ${d.text} }`);
    expect(fadesGlyph).toEqual([]);
  });
});

describe("keyframes", () => {
  const defined = captures(css, /@keyframes\s+([\w-]+)/g);
  const used = new Set<string>();
  for (const declaration of declarations) {
    if (!/^animation(-name)?\s*:/.test(declaration.text)) continue;
    const value = declaration.text.slice(declaration.text.indexOf(":") + 1);
    for (const name of value.match(/[a-zA-Z][\w-]*/g) ?? []) {
      // Skip keywords, functions and token references; only bare custom
      // identifiers can be keyframe names here.
      if (name === "var" || name.startsWith("motion")) continue;
      if (["linear", "ease", "both", "infinite", "none", "forwards", "backwards", "normal"].includes(name))
        continue;
      used.add(name);
    }
  }

  it("defines every keyframe it animates", () => {
    const missing = [...used].filter((name) => !defined.includes(name));
    expect(missing, "animation names a keyframe that does not exist").toEqual([]);
  });

  it("references every keyframe it defines", () => {
    const dead = defined.filter((name) => !used.has(name));
    expect(dead, "dead keyframes were left behind").toEqual([]);
  });
});
