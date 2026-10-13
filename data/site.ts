import type { SiteIdentity } from "@/types/site";

/**
 * Spec §4 (brand positioning) + §42 (contact page) + §54 (SEO).
 * LinkedIn, location and GitHub are owner-supplied and used verbatim.
 * The previous "TODO(owner): no GitHub URL given" guard is now resolved —
 * every consumer still renders these links conditionally, so adding or
 * removing one stays a data-only edit.
 */
export const siteIdentity: SiteIdentity = {
  name: "ASISH OLIVER M",
  primaryRole: ["MOTORSPORT SOFTWARE ENGINEER", "AI / ML ENGINEER"],
  supportingStatement:
    "Building software, simulation, telemetry and intelligent systems for engineering problems.",
  location: "Trichy, Tamil Nadu, India",
  social: {
    email: "dreamteamoliver@gmail.com",
    github: "https://github.com/T-Bone47",
    linkedin: "https://www.linkedin.com/in/asish-oliver-56b454324",
  },
};

/**
 * The portfolio's own source repository. Separate from the GitHub profile
 * above because they answer different questions: one is "where does this
 * person work publicly", the other is "show me the code behind this page".
 * Surfaced in the footer as a developer-facing link.
 */
export const portfolioRepo = "https://github.com/T-Bone47/asish-portfolio";

/**
 * Canonical origin. Single source of truth for absolute URLs so
 * metadataBase, canonical links, sitemap and robots all agree and none of
 * them have to hardcode a hostname that could drift.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment to the real
 * production origin; the fallback keeps local builds warning-free.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const seo = {
  title: "Asish Oliver M — Motorsport Software Engineer · AI/ML Engineer",
  description:
    "Motorsport software and AI/ML engineer building telemetry, simulation, race intelligence and intelligent engineering systems.",
  /** Used verbatim as the social-preview headline. */
  ogImageAlt:
    "Asish Oliver M — Motorsport Software Engineer · AI/ML Engineer. Telemetry, simulation and race intelligence systems.",
};
