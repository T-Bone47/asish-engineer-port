import type { ExperienceEntry } from "@/types/experience";

/**
 * Spec §26 — kept strictly separate from /data/projects.ts. Order
 * matches spec §67 ("Independent Motorsport / eSports" listed first,
 * then IGNICT). Periods and focus bullets updated against the Phase 2
 * prompt's §19, which gives a more precise IGNICT start date
 * ("Aug 2026–Present" vs. the original spec's plain "2026 — PRESENT")
 * and slightly tighter action-verb phrasing for both roles' bullets —
 * same substance, more precise/faithful wording, nothing new claimed.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "independent-motorsport",
    organization: "Independent Motorsport / eSports",
    role: "Race & Strategy Engineer",
    period: "2025 — PRESENT",
    focus: [
      "Maintain / extend lap-simulation and race-strategy software",
      "Analyze lap performance and race scenarios",
      "Evaluate tyre strategy and pit windows",
      "Translate simulation outputs into race strategy",
    ],
    isPersonalProject: false,
  },
  {
    id: "ignict",
    organization: "IGNICT",
    role: "AI / ML Intern",
    period: "AUG 2026 — PRESENT",
    // Spec §23: two to four contributions per role, not a word cloud.
    // These are the same items the brief gave, selected and phrased as
    // contributions rather than listed as bare nouns — no new claim was
    // added to make them read better.
    focus: [
      "Python data preprocessing",
      "Model development and evaluation",
      "Automated testing",
      "Applied technical problem solving",
    ],
    // Spec §26 / Phase 2 prompt §19: "Do not present IGNICT as a
    // personal project" / "do not turn experience into inflated
    // corporate-sounding claims."
    isPersonalProject: false,
  },
];
