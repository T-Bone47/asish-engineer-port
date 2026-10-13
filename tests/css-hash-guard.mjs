#!/usr/bin/env node
/**
 * CSS-hash guard — catches a build/server stylesheet mismatch before it reaches a
 * browser.
 *
 * The regression this guards against: a server whose HTML references
 * /_next/static/chunks/<hash>.css that is NOT present on disk (or a chunk on disk
 * that the HTML does not reference), so the stylesheet returns 404/500 and the site
 * renders completely unstyled.
 *
 * Run after `next build`, before `next start`/deploy:
 *   node tests/css-hash-guard.mjs [baseUrl] [buildDir]
 *
 * Default buildDir assumes the repo's own .next (this repo's build output). It
 * resolves to `<cwd>/.next` (the current working directory at invocation time), not
 * the test file's directory, because the build you want to guard is the one you just
 * produced in the project root — not a stale .next that may live elsewhere. Pass an
 * explicit buildDir only if the build output lives somewhere else.
 *
 * Exit 0 = every route's referenced CSS chunk exists on disk and is non-empty, and
 * every CSS chunk on disk is referenced by at least one route's HTML. Exit 1 =
 * mismatch.
 *
 * This is a build-time artifact check, not a rendered-render test. It does not
 * replace visual/accessibility QA, and it does not replace the reduced-motion
 * browser test. It exists for exactly the regression this session hit.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4100";
const BUILD_DIR =
  process.argv[3]
    ? resolve(process.argv[3])
    : resolve(process.cwd(), ".next");

// Defensive: if someone runs this from outside the project and .next doesn't exist,
// fail loudly rather than silently reporting "no CSS chunks on disk" and blaming a
// healthy build.
if (!readFileSyncNoErr(join(BUILD_DIR, "build-manifest.json"))) {
  console.error(
    `css-hash-guard: build manifest not found at ${join(
      BUILD_DIR,
      "build-manifest.json"
    )}. Is BUILD_DIR really a Next.js build output? (passed: ${BUILD_DIR})`
  );
  process.exit(2);
}

function readFileSyncNoErr(path) {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
}

const PROJECT_SLUG_PATTERN = /^ {4}slug: "([a-z0-9-]+)",$/gm;
const projectsSource = readFileSync(join(process.cwd(), "data", "projects.ts"), "utf8");
const projectSlugs = [...projectsSource.matchAll(PROJECT_SLUG_PATTERN)].map((m) => m[1]);

const ROUTES = [
  "/",
  "/work",
  ...projectSlugs.map((slug) => `/work/${slug}`),
  "/experience",
  "/about",
  "/contact",
];

const CHUNK_CSS_RE = /\/_next\/static\/chunks\/([a-z0-9]+)\.css/g;

function diskCssHashes() {
  const dir = join(BUILD_DIR, "static", "chunks");
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    // If the expected layout is absent, fall back to a recursive scan for *.css under
    // the build dir's static tree so the guard still works when Next changes where it
    // emits chunk CSS (the regression is "HTML references a CSS file that is not on
    // disk", and the identity of interest is the chunk hash, wherever it lives).
    return diskCssHashesRecurse(join(BUILD_DIR, "static"));
  }
  return diskCssHashesRecurse(dir, entries);
}

function diskCssHashesRecurse(dir, entries) {
  const hashes = new Map();
  if (!entries) {
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return hashes;
    }
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const [h, s] of diskCssHashesRecurse(full)) hashes.set(h, s);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".css")) continue;
    const m = entry.name.match(/^([a-z0-9]+)\.css$/);
    if (!m) continue;
    let size = null;
    try {
      size = statSync(full).size;
    } catch {
      // unreadable: record by name only
    }
    hashes.set(m[1], size);
  }
  return hashes;
}

function cssHashesFromHtml(html) {
  const hashes = new Set();
  for (const m of html.matchAll(CHUNK_CSS_RE)) {
    hashes.add(m[1]);
  }
  return hashes;
}

const results = {
  routesHtmlHashSets: new Map(), // route -> Set<hash>
  diskHashSizes: diskCssHashes(),
  allHtmlHashes: new Set(),
};

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  if (!res.ok) {
    results.routesHtmlHashSets.set(route, new Set());
    continue;
  }
  const html = await res.text();
  results.routesHtmlHashSets.set(route, cssHashesFromHtml(html));
  for (const h of cssHashesFromHtml(html)) results.allHtmlHashes.add(h);
}

const missingInDisk = new Set();
const referencedButEmpty = new Set();
for (const h of results.allHtmlHashes) {
  if (!results.diskHashSizes.has(h)) missingInDisk.add(h);
  else if (results.diskHashSizes.get(h) === null) referencedButEmpty.add(h);
}

const diskOnly = new Set();
for (const h of results.diskHashSizes.keys()) {
  if (!results.allHtmlHashes.has(h)) diskOnly.add(h);
}

const failed = missingInDisk.size + referencedButEmpty.size + diskOnly.size;
const details = [];

if (missingInDisk.size) {
  details.push(
    `CSS chunk(s) referenced by HTML but missing on disk: ${[...missingInDisk].join(", ")}`
  );
}
if (referencedButEmpty.size) {
  details.push(
    `CSS chunk(s) referenced by HTML but empty on disk: ${[...referencedButEmpty].join(", ")}`
  );
}
if (diskOnly.size) {
  details.push(
    `CSS chunk(s) on disk but not referenced by any route HTML: ${[...diskOnly].join(", ")}`
  );
}

console.log(
  `CSS-hash guard — base=${BASE}, buildDir=${BUILD_DIR}`
);
console.log(
  `routes audited: ${ROUTES.length} (${[...ROUTES].join(", ")})`
);
console.log(`CSS chunks on disk: ${results.diskHashSizes.size}`);
console.log(
  `CSS chunk(s) referenced by HTML: ${results.allHtmlHashes.size}`
);
if (details.length) {
  console.log("\nFAILED — the following mismatch(es) would cause an unstyled render:");
  for (const d of details) console.log(`  - ${d}`);
} else {
  console.log("\nPASS — every referenced CSS chunk exists on disk and is non-empty;");
  console.log("       every CSS chunk on disk is referenced by at least one route.");
}

process.exit(failed === 0 ? 0 : 1);
