/**
 * Experience & education models — spec §26 (experience must stay
 * separate from projects), §27 (education kept deliberately minimal:
 * no CGPA, grades, semester, or academic score fields exist here on
 * purpose — don't add them).
 */

export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  /** Free-form to match the spec's own "2025 — PRESENT" style. */
  period: string;
  focus: string[];
  /** e.g. IGNICT must never be flagged as a personal project — §26 */
  isPersonalProject: false;
}

export interface EducationEntry {
  institution: string;
  program: string;
}
