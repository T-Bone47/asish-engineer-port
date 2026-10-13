import type { SkillGroup } from "@/types/skill";

/**
 * Spec §29 — the technical arsenal, regrouped for a reader scanning for
 * fit rather than reading for completeness.
 *
 * The previous six groups mixed languages with libraries and with
 * engineering methods, so "what kind of engineer is this?" had no answer
 * in the section meant to answer it. These six groups map to how a
 * recruiter actually filters: languages, AI/ML, backend and data,
 * frontend, the domain, and infrastructure and practice.
 *
 * Every item is attested somewhere in `data/projects.ts` — a dependency in
 * a project's stack, or a named tool in a project's own copy. Nothing here
 * was added because it "should" be on the list.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    items: ["Python", "C++", "C#", "Java", "MATLAB", "SQL", "TypeScript", "JavaScript"],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    items: [
      "XGBoost",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Vosk",
      "LLM Integration",
      "Regression",
      "Feature Engineering",
    ],
  },
  {
    id: "backend-data",
    title: "Backend & Data",
    items: [
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "SQLAlchemy",
      "Alembic",
      "Pydantic",
      "Pandera",
      "WebSockets",
      "Tenacity",
      "httpx",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: ["React", "Next.js", "Vite", "TailwindCSS", "Framer Motion", "Capacitor"],
  },
  {
    id: "motorsport-simulation",
    title: "Motorsport & Simulation",
    items: [
      "FastF1",
      "OpenF1",
      "Jolpica",
      "F1 SignalR",
      "UDP Telemetry",
      "MoTeC i2 Pro",
      "OptimumLap",
      "OpenLAP / OpenLapSim",
      "ChassisSim",
      "AVL VSM",
      "Unity",
    ],
  },
  {
    id: "infrastructure-practice",
    title: "Infrastructure & Practice",
    items: [
      "Docker",
      "Pytest",
      "Git / GitHub",
      "Data Validation",
      "Deterministic Replay",
      "Retry & Backoff",
      "Content-Hashed Provenance",
      "Backtesting",
    ],
  },
];
