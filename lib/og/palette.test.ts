import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OG_PALETTE_SOURCE, ogPalette } from "@/lib/og/palette";

/**
 * The social cards carry literal hex because satori cannot resolve
 * `var(--color-*)`. That makes `lib/og/palette.ts` a second source of truth
 * for colour, which is exactly the kind of duplication that goes stale
 * silently: someone retunes the accent in `globals.css`, the site changes and
 * eight preview images do not.
 *
 * So this reads the real `globals.css` and asserts each literal still equals
 * the primitive it claims to mirror. It fails in both directions — a changed
 * token and a changed literal both break it — and it names the primitive in
 * the failure output, so the fix is obvious.
 *
 * Deliberately pinned to primitives rather than semantic tokens: the
 * primitives are where the values actually live, so two aliases agreeing with
 * each other can never satisfy this.
 */
const globalsCss = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

const pinned = Object.entries(OG_PALETTE_SOURCE) as Array<[keyof typeof ogPalette, string]>;

describe("OG palette — literal hex vs globals.css", () => {
  it("maps every colour in ogPalette to a primitive token", () => {
    expect(pinned.map(([key]) => key).sort()).toEqual(Object.keys(ogPalette).sort());
  });

  it.each(pinned)("%s mirrors %s", (key, token) => {
    // `token` already carries its leading `--`; the declaration pattern
    // therefore anchors on the custom-property name as written.
    const declaration = globalsCss.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`));

    expect(
      declaration,
      `${token} is not declared in app/globals.css — either the token was renamed and lib/og/palette.ts (key: ${key}) was not, or it moved to another file`
    ).not.toBeNull();

    expect(
      ogPalette[key],
      `lib/og/palette.ts has ${key} = ${ogPalette[key]} but ${token} in app/globals.css is ${declaration?.[1]} — the social cards would drift from the site`
    ).toBe(declaration?.[1]?.toLowerCase());
  });

  it("uses lowercase hex throughout, matching globals.css", () => {
    for (const [key, value] of Object.entries(ogPalette)) {
      expect(value, `${key} must be lowercase hex`).toBe(value.toLowerCase());
      expect(value, `${key} must be a hex literal`).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
