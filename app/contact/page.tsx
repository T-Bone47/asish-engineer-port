import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Asish Oliver M — motorsport software engineer and AI/ML engineer — by email, LinkedIn or GitHub.",
  path: "/contact",
});

export default function ContactPage() {
  // `headingLevel` promotes the name to the page's h1. Without it this
  // route rendered NO h1 at all — ContactSection defaults to h2 because
  // on the homepage it is one section among many. Sharing one component
  // across two very different page contexts needs the level passed in,
  // not guessed.
  return <ContactSection headingLevel="h1" />;
}
