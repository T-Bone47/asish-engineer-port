import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Professional experience as a Race & Strategy Engineer in independent motorsport and eSports, and as an AI/ML Intern.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <Container as="section" className="seq-page py-24">
      <h1 className="font-display text-display-lg uppercase tracking-tight">Experience</h1>
      <p className="mt-5 max-w-2xl font-body text-lg text-foreground-muted">
        Professional engineering roles, kept deliberately separate from
        self-directed projects.
      </p>
      <div className="mt-16">
        <ExperienceTimeline headingLevel="h2" />
      </div>
    </Container>
  );
}
