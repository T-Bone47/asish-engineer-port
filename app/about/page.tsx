import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AboutContent } from "@/components/home/AboutContent";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Asish Oliver M is a motorsport software engineer and AI/ML engineer working across telemetry pipelines, numerical vehicle simulation, race strategy and applied machine learning.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container as="section" className="seq-page py-24">
      <h1 className="font-display text-display-lg uppercase tracking-tight">About</h1>
      <div className="mt-16">
        <AboutContent />
      </div>
    </Container>
  );
}
