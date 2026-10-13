import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint flat config — native `eslint-config-next` exports.
 *
 * This previously went through `FlatCompat` + `compat.extends(...)`,
 * which is the ESLint-8-era way of consuming a shareable config. With
 * eslint-config-next 16 (flat-only) that path throws
 * "Converting circular structure to JSON" during config normalisation
 * and ESLint aborts before linting a single file — so `npm run lint`
 * had been silently useless rather than passing. The package now ships
 * its own flat entry points, so we consume them directly and there's no
 * interop layer to break.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
      // Agent tooling installed by `npx impeccable install`,
      // `npx skills add …` and `npx motion-ai`. These are third-party
      // skill bundles — several ship minified vendor JS — not project
      // source. They are also gitignored (see .gitignore); linting them
      // was reporting hundreds of errors inside someone else's bundle.
      ".agent/**",
      ".agents/**",
      ".claude/**",
      ".codex/**",
      ".gemini/**",
      ".grok/**",
      ".hermes/**",
      ".kiro/**",
      ".opencode/**",
      ".pi/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Spec §84: no unjustified `any`, no silent suppression. These are
      // errors rather than warnings — a portfolio whose only guarantee is
      // typed correctness should fail the lint gate when it regresses.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Next.js already handles `<a>` vs `<Link>`; its rule misfires on
      // the deliberate external-link anchors in Footer/ContactSection.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;