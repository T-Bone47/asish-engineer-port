/** Spec §17 — capabilities organized around engineering problems, not
 *  a technology list (that's Technical Arsenal, data/skills.ts, §40).
 *
 *  Phase C added the two domains the football work actually exercises and
 *  which were previously absent: data engineering and API systems. Both
 *  are evidenced by real repositories — a provider abstraction with
 *  immutable provenance, and a 64-endpoint canonical API over a canonical
 *  domain model — rather than being inferred from job titles.
 */
export interface EngineeringDomain {
  id: string;
  title: string;
  items: string[];
}

export const engineeringDomains: EngineeringDomain[] = [
  {
    id: "motorsport-software",
    title: "Motorsport Software",
    items: ["Telemetry", "Race Strategy", "Timing Systems", "Data Pipelines", "Decision Support"],
  },
  {
    id: "simulation",
    title: "Simulation",
    items: ["Vehicle Modelling", "Numerical Solvers", "Lap Simulation", "Performance Analysis"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    items: [
      "Provider Abstraction",
      "Immutable Snapshots",
      "Provenance",
      "Canonical Models",
      "Schema Validation",
      "Idempotent Normalisation",
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    items: [
      "Feature Engineering",
      "Player Intelligence",
      "Recommendation Systems",
      "Forecasting",
      "Explainability",
    ],
  },
  {
    id: "systems",
    title: "Systems & APIs",
    items: ["Python", "FastAPI", "PostgreSQL", "REST API Design", "Modular Architecture", "Docker"],
  },
  {
    id: "sports-analytics",
    title: "Sports Analytics",
    items: [
      "Football Data",
      "Player Role Discovery",
      "Tactical Fit",
      "Recruitment & Valuation",
    ],
  },
  {
    id: "application-engineering",
    title: "Application Engineering",
    items: ["React", "TypeScript", "Next.js", "Python", "C#"],
  },
];