/**
 * Literal colour palette for generated social cards.
 *
 * WHY THIS FILE EXISTS — AND WHY IT BREAKS THE "NO RAW HEX" RULE.
 *
 * Every other surface in this project reads colour from `app/globals.css`
 * through `var(--color-*)`. The social card is rendered by satori (through
 * `next/og`), which builds a standalone SVG rectangle tree and hands it to
 * resvg. That renderer never sees the document cascade, so
 * `stroke="var(--color-accent)"` resolves to nothing: shapes lose their
 * colour or vanish outright. These values therefore have to be literals.
 *
 * That makes them a second source of truth for the palette, which is a real
 * hazard — a token change here-none-elsewhere would silently desync the
 * cards from the site. So `lib/og/palette.test.ts` parses `app/globals.css`
 * and asserts every value below is byte-identical to the primitive it
 * claims to mirror. Change a token without changing this file and the test
 * fails; change this file without changing the token and it fails too.
 *
 * Pinned to primitives rather than semantic aliases on purpose: the
 * primitive layer is what actually holds the value, so the assertion cannot
 * be satisfied by two aliases agreeing with each other.
 */
export const ogPalette = {
  background: "#0a0b0d",
  surface: "#121317",
  foreground: "#f1f2f4",
  foregroundMuted: "#b8bbc2",
  foregroundFaint: "#8b8f98",
  borderSubtle: "#1b1d22",
  borderStrong: "#2b2e35",
  accent: "#ff7a18",
  data: "#47c7e0",
  live: "#3ddc84",
} as const;

/**
 * The `app/globals.css` primitive each value above mirrors.
 *
 * Declared as data (not as a comment) so the test can read it and check the
 * real file rather than trusting a prose claim about it.
 */
export const OG_PALETTE_SOURCE: Record<keyof typeof ogPalette, string> = {
  background: "--primitive-neutral-950",
  surface: "--primitive-neutral-900",
  foreground: "--primitive-neutral-50",
  foregroundMuted: "--primitive-neutral-300",
  foregroundFaint: "--primitive-neutral-500",
  borderSubtle: "--primitive-neutral-800",
  borderStrong: "--primitive-neutral-700",
  accent: "--primitive-papaya-500",
  data: "--primitive-telemetry-500",
  live: "--primitive-live-500",
};
