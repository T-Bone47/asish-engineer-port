import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Selected Systems",
  description:
    "Motorsport telemetry, simulation, and AI/ML systems built by Asish Oliver M — including a canonical F1 event pipeline, a numerical lap-time simulator and an AI race engineer.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <Container as="section" className="seq-page py-24">
      {/* h1 leads. The old order put the "Selected Systems" label ABOVE
          the h1, which meant the document read h2 → h1 → h3 and tripped
          every heading-order checker. A label stacked on top of the page
          title is also exactly the kicker pattern this design is moving
          away from. */}
      <h1 className="font-display text-display-lg uppercase tracking-tight">
        Selected Systems
      </h1>
      <p className="mt-5 max-w-2xl font-body text-lg text-foreground-muted">
        Motorsport telemetry, simulation, and AI/ML systems — built around
        canonical event pipelines, numerical vehicle models and applied
        machine learning.
      </p>

      <div className="mt-16">
        <ProjectIndex />
      </div>
    </Container>
  );
}
