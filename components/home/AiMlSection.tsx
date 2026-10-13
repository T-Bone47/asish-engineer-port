import { aiMlFlows } from "@/data/ai-ml-flows";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { FlowSteps } from "@/components/ui/FlowSteps";

export function AiMlSection() {
  return (
    <Container as="section" className="border-t border-border-subtle py-24 md:py-32">
      {/* The label IS the heading — the same pattern the other eight
          sections use. It previously sat as a kicker above a separate <h2>
          ("Models are tools. / Engineering is the objective."), which is the
          one layout tell this design system bans outright: an eyebrow
          stacked on top of the heading it labels. The sentence keeps its
          size and its impact as a statement; the heading is now the thing
          that actually names the section, which also gives the section a
          truthful accessible name. */}
      <TechnicalLabel as="h2" className="text-accent">
        AI / ML Engineering
      </TechnicalLabel>

      <p className="mt-4 font-display text-display-md uppercase leading-tight tracking-tight">
        {/* Trailing space so the text reads "tools. Engineering" rather
            than "tools.Engineering" once the <br /> is stripped. */}
        Models are tools.{" "}
        <br />
        Engineering is the objective.
      </p>

      <div className="mt-10 space-y-6">
        {aiMlFlows.map((flow) => (
          <div key={flow.id} className="border-t border-border-subtle pt-6">
            <div className="font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted">
              {flow.label}
            </div>
            <FlowSteps steps={flow.steps} className="mt-3" />
          </div>
        ))}
      </div>
    </Container>
  );
}
