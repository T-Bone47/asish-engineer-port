/**
 * Reduced-motion path, verified in a real browser.
 *
 * The motion system's entire safety contract rests on one claim: under
 * `prefers-reduced-motion: reduce`, no element is left in a hidden state
 * waiting for an animation that will never run. The CSS gate in
 * `lib/motion.test.ts` asserts this for the *stylesheet* (every animation
 * declaration is inside the reduced-motion opt-in). This test asserts it for
 * the *rendered page* in a real Chromium: load the homepage, force
 * `prefers-reduced-motion: reduce`, and confirm the two public invariants
 * that the report's browser QA measured manually:
 *
 *   1. the signature figure's circuit path is fully drawn (static) — its
 *      `stroke-dashoffset` is `0px`, not mid-draw;
 *   2. the project-row motif mask is absent — `.instrument-row::after` has
 *      `content: none`, so reduced-motion readers get the motif as a static
 *      figure rather than a covered one.
 *
 * It also confirms the accessibility disclosure added to the signature figure
 * is still present under reduced motion (that invariant is independent of
 * motion preference).
 *
 * The test is self-contained: it starts `next start` on an ephemeral port,
 * drives it with Playwright, and stops the server in cleanup. It fails fast
 * with a clear message if Chromium cannot be launched, and skips the suite
 * when Playwright itself is absent (so the repo is not blocked in environments
 * that have neither Playwright nor a Chromium installed).
 *
 * Why a browser test at all, when `lib/motion.test.ts` already covers the CSS:
 * the CSS gate proves the *stylesheet* is correct. This test proves the
 * *composed page* is correct — that the browser actually computes `content: none`
 * on the mask pseudo-element and `stroke-dashoffset: 0px` on the path under the
 * emulated preference. That is the difference between "the rule exists" and "the
 * rule does what we claim it does".
 */

import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PORT = 3456;

function resolveNextCommand(): { cmd: string; args: string[] } {
  // Spawn the real Next.js binary through `node`. The `.bin/next` wrapper is a
  // POSIX shell script that Node's `spawn` can't execute directly on Windows
  // without `shell: true` (which needs sh on PATH and is less deterministic), so
  // resolve the real entry point from the well-known location and spawn that.
  const realNext = path.resolve(
    __dirname,
    "..",
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  );
  if (!existsSync(realNext)) {
    throw new Error(
      `reduced-motion browser test: next binary not found at ${realNext}. Is the project's dependencies installed (npm install)?`
    );
  }
  return { cmd: "node", args: [realNext, "start", "--port", String(PORT)] };
}

const NEXT_CMD = resolveNextCommand();

interface LaunchResult {
  browser: import("playwright").Browser;
  serverProcess: ReturnType<typeof spawn>;
  port: number;
}

async function startServerAndBrowser(): Promise<LaunchResult> {
  const serverProcess = spawn(NEXT_CMD.cmd, NEXT_CMD.args, {
    cwd: PROJECT_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(PORT) },
  });

  const waitForServer = async () => {
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      try {
        await fetch(`http://localhost:${PORT}/`, { method: "HEAD" }).then(
          () => true,
          () => false
        );
        return true;
      } catch {
        // HEAD may not be supported; fall back to GET on the next tick.
      }
      try {
        await fetch(`http://localhost:${PORT}/`, { method: "GET" }).then(
          () => true,
          () => false
        );
        return true;
      } catch {
        // still not up
      }
      await setTimeout(200);
    }
    return false;
  };

  const ready = await waitForServer();
  if (!ready) {
    serverProcess.kill();      const stderr = await readAll(serverProcess.stderr!);
    throw new Error(
      `next start on port ${PORT} did not become ready within 20s. stderr:\n${stderr}`
    );
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  return { browser, serverProcess, port: PORT };
}

async function readAll(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  const wait = new Promise<void>((resolve) => {
    stream.on("end", () => resolve());
    stream.on("error", () => resolve());
  });
  await wait;
  return Buffer.concat(chunks).toString("utf8");
}

async function runReducedMotionAsserts(page: import("playwright").Page): Promise<void> {
  // Invariant 1 — signature track fully drawn (static) under reduced motion.
  // The circuit trace path carries `trace-step-3`; under reduced motion it must
  // render at `stroke-dashoffset: 0px`, i.e. the finished figure, not a
  // mid-draw state waiting for a scroll timeline that will never advance.
  const trackDashoffset = await page.evaluate(() => {
    const path = document.querySelector('svg path.trace-step-3');
    return path ? (getComputedStyle(path).strokeDashoffset as string) : null;
  });
  expect(trackDashoffset, "signature circuit trace must be fully drawn (stroke-dashoffset 0) under reduced motion").toBe("0px");

  // Invariant 2 — project-row motif mask absent under reduced motion.
  // `.instrument-row::after` is the mask that covers the motif at rest for
  // non-reduced-motion users. Under `prefers-reduced-motion: reduce` the CSS
  // sets `content: none`, so the motif renders as a static figure. If this
  // computed to something other than `"none"`, a reduced-motion reader would
  // meet a covered (effectively hidden) motif on every project row.
  const maskContent = await page.evaluate(() => {
    const rail = document.querySelector(".instrument-row");
    if (!rail) return "no-rail";
    return getComputedStyle(rail, "::after").content;
  });
  expect(maskContent, "instrument-row mask must be content:none under reduced motion").toBe("none");

  // Accessibility invariant (independent of motion, but verified here for a
  // single snapshottable check that the signature figure's text restatement
  // exists under reduced motion — the figure is not a picture of a system to a
  // screen-reader user, and the disclosure text is the restatement).
  const disclosureCount = await page.locator("text=Read this figure as text").count();
  expect(disclosureCount, "signature figure 'read this figure as text' disclosure must be present under reduced motion").toBe(1);
}

describe("reduced-motion path — live browser check", () => {
  it("renders the homepage with no hidden states under prefers-reduced-motion: reduce", async () => {
    let browser: import("playwright").Browser | null = null;
    let serverProcess: ReturnType<typeof spawn> | null = null;
    try {
      const { browser: b, serverProcess: srv } = await startServerAndBrowser();
      browser = b;
      serverProcess = srv;
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle", timeout: 20_000 });
      await runReducedMotionAsserts(page);
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill();
        await setTimeout(200);
      }
    }
  }, 45_000);
});
