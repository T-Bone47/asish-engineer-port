import Link from "next/link";
import { getHomepageProjects, projects } from "@/data/projects";
import { ProjectIndexRow } from "@/components/work/ProjectIndexRow";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Homepage preview of the evidence-backed systems.
 *
 * This section used to render all seven projects as full index rows — the
 * same rows /work renders, in the same order, with the same content. A
 * visitor who scrolled the homepage and then clicked "View Archive" had
 * already read the entire archive; the archive was a duplicate, not a
 * destination.
 *
 * Now the homepage earns attention with the systems that actually carry
 * measured evidence — selected by `getHomepageProjects()`, which is
 * derived from `metrics` rather than hand-listed — and `/work` holds the
 * complete catalogue. The count in the header is the full catalogue size,
 * so nothing is hidden by being left off the homepage.
 */
export function SelectedSystemsPreview() {
  const featured = getHomepageProjects();

  return (
    <Container as="section" className="border-t border-border-subtle py-14 md:py-20">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <TechnicalLabel as="h2" className="text-accent">
          Evidence-Backed Systems ·{" "}
          {String(featured.length).padStart(2, "0")} of{" "}
          {String(projects.length).padStart(2, "0")}
        </TechnicalLabel>
        <Link
          href="/work"
          className="inline-flex min-h-11 shrink-0 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-foreground"
        >
          View Archive →
        </Link>
      </div>

      <div className="mt-6 border-t border-border-subtle">
        {featured.map((project) => (
          <ProjectIndexRow
            key={project.id}
            project={project}
            index={projects.findIndex((p) => p.id === project.id)}
          />
        ))}
      </div>

      <p className="mt-8 max-w-2xl font-body text-sm leading-relaxed text-foreground-muted">
        The archive holds every system, including the ones with no measured
        numbers yet. Those are listed honestly rather than promoted.
      </p>
    </Container>
  );
}
