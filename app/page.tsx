import { Hero } from "@/components/home/Hero";
import { SignatureVisual } from "@/components/home/SignatureVisual";
import { EngineeringStatement } from "@/components/home/EngineeringStatement";
import { SelectedSystemsPreview } from "@/components/home/SelectedSystemsPreview";
import { EngineeringDomains } from "@/components/home/EngineeringDomains";
import { AiMlSection } from "@/components/home/AiMlSection";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { CurrentlyBuilding } from "@/components/home/CurrentlyBuilding";
import { TechnicalArsenal } from "@/components/home/TechnicalArsenal";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactSection } from "@/components/home/ContactSection";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Spec §7's homepage order, now complete. That order list doesn't
 * name "AI/ML section" as its own line, but §18 gives it distinct
 * content and the document's own section numbering runs Engineering
 * Domains (§17) → AI/ML (§18) → Experience (§19) — so it's placed
 * there rather than dropped or merged into something else.
 *
 * Hero and SignatureVisual are NOT wrapped in <Reveal> — they're
 * above the fold, and delaying the page's actual LCP content for an
 * entrance animation would work against spec §29's own performance
 * targets. Everything below the fold reveals on scroll.
 *
 * Section vertical rhythm is deliberately NOT uniform. The old page
 * gave every section the same `py-16 md:py-20`, which flattened the
 * narrative into one long undifferentiated column. Each block below now
 * carries a density that matches its role: quiet around the statement,
 * dense around systems and domains, a pause before the human sections.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SignatureVisual />
      <Reveal>
        <EngineeringStatement />
      </Reveal>
      <Reveal>
        <SelectedSystemsPreview />
      </Reveal>
      <Reveal>
        <EngineeringDomains />
      </Reveal>
      <Reveal>
        <AiMlSection />
      </Reveal>
      <Reveal>
        <Container as="section" className="border-t border-border-subtle py-20 md:py-28">
          <TechnicalLabel as="h2" className="text-accent">Experience</TechnicalLabel>
          <div className="mt-6">
            <ExperienceTimeline />
          </div>
        </Container>
      </Reveal>
      <Reveal>
        <CurrentlyBuilding />
      </Reveal>
      <Reveal>
        <TechnicalArsenal />
      </Reveal>
      <Reveal>
        <AboutPreview />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
    </>
  );
}
