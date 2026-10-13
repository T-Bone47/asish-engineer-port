/**
 * Live-site audit — repeatable structural check across every route.
 *
 * Run against a running dev or production server:
 *   node tests/site-audit.mjs [baseUrl]
 *
 * Deliberately not a snapshot test. Snapshot tests assert that output
 * didn't change; this asserts that the output is *correct* — that every
 * page has exactly one h1, no skipped heading levels, a canonical, a social
 * image, valid landmarks, labelled images, and safe external links. Those
 * are the invariants that actually broke during development.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";

/**
 * Case-study routes are DERIVED, not listed.
 *
 * They used to be hand-written here, and that was a real hole: this list was
 * the only source of truth for "routes that exist", so a new project added to
 * `data/projects.ts` could ship completely un-audited while this script
 * reported ALL CHECKS PASS over the seven routes it happened to remember.
 * Phase C hit exactly that, and the comment it left behind could only warn
 * about the problem, not fix it.
 *
 * Reading the slugs out of the data file closes it. The count is asserted
 * below, so if the file's shape ever changes enough to break this regex the
 * audit fails loudly instead of quietly auditing fewer pages.
 */
const PROJECT_SLUG_PATTERN = /^ {4}slug: "([a-z0-9-]+)",$/gm;
const projectsSource = readFileSync(
  join(process.cwd(), "data", "projects.ts"),
  "utf8"
);
const projectSlugs = [...projectsSource.matchAll(PROJECT_SLUG_PATTERN)].map((m) => m[1]);

// The catalogue's own length, asserted independently of the slug scrape: a
// project object without a top-level `slug` would otherwise vanish silently.
const projectCount = (projectsSource.match(/^ {4}id: "/gm) ?? []).length;

const ROUTES = [
  "/",
  "/work",
  ...projectSlugs.map((slug) => `/work/${slug}`),
  "/experience",
  "/about",
  "/contact",
  "/definitely-not-a-route",
];

const checks = [];
const record = (route, name, pass, detail = "") =>
  checks.push({ route, name, pass, detail });

for (const route of ROUTES) {
  const res = await fetch(base + route);
  const html = await res.text();
  const expect404 = route === "/definitely-not-a-route";

  record(route, "status", expect404 ? res.status === 404 : res.status === 200, String(res.status));

  // --- semantics ---
  const h1Count = [...html.matchAll(/<h1[^>]*>/g)].length;
  record(route, "exactly one h1", h1Count === 1, `found ${h1Count}`);

  const levels = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]));
  const jumps = [];
  let prev = 0;
  for (const l of levels) {
    if (prev && l > prev + 1) jumps.push(`${prev}→${l}`);
    prev = l;
  }
  record(route, "no skipped heading levels", jumps.length === 0, jumps.join(", "));

  // --- landmarks ---
  for (const tag of ["header", "nav", "main", "footer"]) {
    record(route, `has <${tag}>`, new RegExp(`<${tag}[ >]`).test(html));
  }
  record(route, "skip-to-content link", html.includes("Skip to content"));

  // --- media & links ---
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length;
  record(route, "all images have alt", imgsNoAlt === 0, `${imgsNoAlt} missing`);

  // NOTE: the lookahead deliberately omits the closing quote after
  // "noopener". Every external link here uses rel="noopener noreferrer",
  // so a pattern of `rel="noopener"` (quote included) does NOT match it —
  // the character after "noopener" is a space, not a quote. That made this
  // check report all 9 external links on `/` as unsafe when every one of
  // them was in fact correct. Match the attribute prefix, not a literal
  // value that may carry further tokens.
  const anchors = html.match(/<a\b[^>]*>/g) ?? [];
  const externalAnchors = anchors.filter((a) => a.includes('target="_blank"'));
  const unsafeExternal = externalAnchors.filter((a) => !/rel="noopener\b/.test(a)).length;
  record(
    route,
    "external links use noopener",
    unsafeExternal === 0,
    `${unsafeExternal} of ${externalAnchors.length} unsafe`
  );

  // --- SEO ---
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  record(route, "has title", title.trim().length > 0);
  record(
    route,
    "no duplicated title suffix",
    !/Asish Oliver M — Asish Oliver M/.test(title),
    title
  );

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? "";
  record(route, "has meta description", desc.trim().length > 0, `${desc.length} chars`);

  // The 404 is a generated route and legitimately inherits the site default.
  if (!expect404) {
    record(route, "has canonical", /rel="canonical"/.test(html));
    record(route, "has og:image", /property="og:image"/.test(html));
  }
}

// --- tap targets ---
// NOT measured by this script. It fetches HTML over HTTP and cannot compute
// rendered geometry, so any "check" here would be a claim with nothing behind
// it — which is exactly the failure mode this audit exists to catch, so it is
// labelled as a manual finding rather than dressed up as automation.
//
// Manual procedure (re-run when layout changes):
//   1. Serve the production build.
//   2. At 320/360/390, evaluate every a/button/summary via getBoundingClientRect.
//   3. Exclude `sr-only` elements — visually hidden until focused, no on-screen
//      target to miss.
// Any element under 24px in either axis is a WCAG 2.2 AA failure and must be
// padded. Last manual pass: 2026-10-03, all cases clean after footer and
// header utility links were given vertical padding.
record(
  "(global)",
  "tap targets ≥ 24px (manual, not automated)",
  true,
  "manual DOM measurement at 320/360/390 — see comment"
);

// --- per-project social cards ---
// The route list above is now derived, so a new project is audited the moment
// it exists. These assert the *distinctness* the cards were built for: every
// case study must advertise its own card, that card must serve a real PNG at
// the documented size, and no two projects may share an image.
//
// The pathname is compared, never the origin: metadata resolves against
// NEXT_PUBLIC_SITE_URL, which in a local audit is not the port being served.
// Absolute URLs are correct for crawlers; asserting on the origin here would
// only be asserting the environment.
record(
  "(global)",
  "catalogue is fully enumerated",
  projectSlugs.length === projectCount && new Set(projectSlugs).size === projectSlugs.length,
  `${projectSlugs.length} slugs / ${projectCount} project ids`
);

const cardHashes = new Map();
const sizeOfPng = (buffer) => {
  const isPng = buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (!isPng) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

for (const slug of projectSlugs) {
  const route = `/work/${slug}`;
  const html = await (await fetch(base + route)).text();
  const expectedPath = `/work/${slug}/opengraph-image`;

  const ogPaths = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(
    (m) => new URL(m[1]).pathname
  );
  record(
    route,
    "advertises exactly one og:image, its own",
    ogPaths.length === 1 && ogPaths[0] === expectedPath,
    ogPaths.join(", ") || "none"
  );

  const twitterPaths = [...html.matchAll(/<meta name="twitter:image" content="([^"]+)"/g)].map(
    (m) => new URL(m[1]).pathname
  );
  record(
    route,
    "twitter:image is the same card",
    twitterPaths.length === 1 && twitterPaths[0] === expectedPath,
    twitterPaths.join(", ") || "none"
  );

  const altTexts = [...html.matchAll(/<meta property="og:image:alt" content="([^"]*)"/g)].map(
    (m) => m[1]
  );
  record(
    route,
    "og:image:alt names the project",
    altTexts.length === 1 && altTexts[0].length > 20,
    `${altTexts.length} alt tag(s)`
  );

  const cardRes = await fetch(base + expectedPath);
  const cardBuffer = Buffer.from(await cardRes.arrayBuffer());
  const size = sizeOfPng(cardBuffer);

  record(
    route,
    "own card serves a PNG 200",
    cardRes.status === 200 &&
      (cardRes.headers.get("content-type") ?? "").includes("image/png") &&
      size !== null &&
      cardBuffer.length > 5_000,
    `${cardRes.status} ${cardRes.headers.get("content-type")} ${cardBuffer.length}B`
  );

  record(
    route,
    "card is 1200x630",
    size?.width === 1200 && size?.height === 630,
    size ? `${size.width}x${size.height}` : "not a PNG"
  );

  cardHashes.set(slug, createHash("sha256").update(cardBuffer).digest("hex"));
}

record(
  "(global)",
  "every project card is a distinct image",
  new Set(cardHashes.values()).size === projectSlugs.length,
  `${new Set(cardHashes.values()).size} unique of ${projectSlugs.length}`
);

// A slug that does not exist must 404 on the image route too, matching the
// page route — otherwise a dead URL still served a confident preview.
{
  const res = await fetch(`${base}/work/definitely-not-a-project/opengraph-image`);
  record(
    "/work/definitely-not-a-project",
    "unknown project card 404s",
    res.status === 404,
    String(res.status)
  );
}

// The pages that are *about the portfolio* keep the portfolio's card: they
// are not case studies, and a project's instrument would misdescribe them.
for (const route of ["/", "/work", "/about", "/experience", "/contact"]) {
  const html = await (await fetch(base + route)).text();
  const paths = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(
    (m) => new URL(m[1]).pathname
  );
  record(
    route,
    "keeps the site card",
    paths.length === 1 && paths[0] === "/opengraph-image",
    paths.join(", ") || "none"
  );
}

const failed = checks.filter((c) => !c.pass);
const grouped = new Map();
for (const c of checks) {
  if (!grouped.has(c.name)) grouped.set(c.name, { total: 0, failed: 0, detail: [] });
  const g = grouped.get(c.name);
  g.total += 1;
  if (!c.pass) {
    g.failed += 1;
    if (g.detail.length < 3) g.detail.push(`${c.route}: ${c.detail}`);
  }
}

console.log(`\nLive site audit — ${base}\n`);
for (const [name, g] of grouped) {
  const mark = g.failed === 0 ? "PASS" : "FAIL";
  console.log(
    `  ${mark}  ${name.padEnd(34)} ${g.total - g.failed}/${g.total}` +
      (g.detail.length ? `  → ${g.detail.join("; ")}` : "")
  );
}

console.log(
  `\n${failed.length === 0 ? "ALL CHECKS PASS" : `${failed.length} CHECK(S) FAILED`}` +
    `  (${checks.length} assertions across ${ROUTES.length} routes)\n`
);

process.exit(failed.length === 0 ? 0 : 1);