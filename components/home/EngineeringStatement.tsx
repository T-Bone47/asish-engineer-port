import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { FlowSteps } from "@/components/ui/FlowSteps";

/** Spec §7 (homepage order) + §20's content — no separate copy was
 *  given specifically for "Engineering Statement" apart from what §20
 *  (About) provides, so this section and the About page share the same
 *  given pipeline/statement rather than inventing separate wording. */
export function EngineeringStatement() {
  return (
    <Container as="section" className="border-t border-border-subtle py-24 md:py-36">
      <TechnicalLabel as="h2" className="text-accent">Engineering Statement</TechnicalLabel>

      <FlowSteps
        steps={["Data", "Models", "Systems", "Simulation", "Intelligence", "Engineering Decisions"]}
        className="mt-6"
      />

      <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
        Motorsport is the primary engineering domain. AI/ML, simulation, and
        software are the tools used to solve problems within it.
      </p>
    </Container>
  );
}
