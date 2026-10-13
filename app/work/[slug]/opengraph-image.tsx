import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjectNumber, projects } from "@/data/projects";
import { OG_CARD_SIZE, ProjectCard } from "@/lib/og/project-card";

/**
 * Per-project social preview — one card per case study.
 *
 * Previously every one of the eight case studies advertised the *site* card,
 * so eight distinct pieces of engineering arrived in a timeline looking like
 * eight links to the same page. This route renders each project's own card,
 * from its own data.
 *
 * Follows the file convention already used by `app/opengraph-image.tsx`: the
 * PNG is generated at build time rather than shipped as an asset under
 * `public/`, so it cannot go stale against `data/projects.ts`. All eight are
 * prerendered because `generateStaticParams` enumerates the same slugs the
 * page route does.
 *
 * The per-project *alt* text is not exported here. A static `alt` cannot read
 * the route params, and `generateImageMetadata` would change the image URL
 * (it appends the returned id as a path segment), so the alt that crawlers
 * actually receive is set alongside the image URL in the page's
 * `generateMetadata` via `projectCardAlt` — see `app/work/[slug]/page.tsx`.
 * The constant below is only the fallback for a direct hit on this URL.
 *
 * An unknown slug returns 404 rather than a card, matching the page route,
 * which calls `notFound()` for the same input. Returning the site card here
 * would mean a URL that 404s as a page still served a confident-looking
 * preview image.
 */

export const alt = "Engineering case study — Asish Oliver M";
export const size = OG_CARD_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Next.js 16: `params` is a Promise on pages, layouts and metadata routes.
type ProjectImageProps = { params: Promise<{ slug: string }> };

export default async function OpengraphImage({ params }: ProjectImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <ProjectCard
        project={project}
        index={getProjectNumber(project.slug)}
        total={projects.length}
      />
    ),
    size
  );
}
