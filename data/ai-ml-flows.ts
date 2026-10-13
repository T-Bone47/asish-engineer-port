/**
 * Spec §18 — concrete applications, to make the point that "AI/ML is one
 * of the engineering tools used to solve different classes of problems,"
 * not the headline itself.
 *
 * Phase C rewrote these from three generic four-step chains into six flows
 * taken from what each project's code actually does. "Data → Features →
 * Intelligence → Recommendation" was true of nothing in particular; the
 * replacements name the real transformation in each system, including the
 * two football projects that were previously absent from this list
 * entirely.
 */
export interface AiMlFlow {
  id: string;
  label: string;
  steps: string[];
}

export const aiMlFlows: AiMlFlow[] = [
  {
    id: "live-f1",
    label: "Live F1 Intelligence",
    steps: ["Telemetry", "Session State", "Race Intelligence", "Strategy"],
  },
  {
    id: "lap-time-simulator",
    label: "F1 Lap-Time Simulator",
    steps: ["Track Geometry", "Load Model", "Numerical Solver", "Time Prediction"],
  },
  {
    id: "racemind",
    label: "RaceMind-AI",
    steps: ["Race Engineering", "Telemetry", "Scenario Search", "Setup Advice"],
  },
  {
    id: "ea-fc",
    label: "EA FC Player Intelligence",
    steps: [
      "Player Attributes",
      "Component Fits",
      "Contextual Score",
      "Recommendation",
    ],
  },
  {
    id: "football-os",
    label: "Football Intelligence OS",
    steps: ["Provider Data", "Provenance", "Canonical Model", "Analytics Foundation"],
  },
  {
    id: "vyaparpulse",
    label: "VyaparPulse",
    steps: ["Voice", "Transaction Extraction", "Ledger Reconciliation", "Forecast"],
  },
];