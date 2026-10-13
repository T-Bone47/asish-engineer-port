import type { Metadata } from "next";
import { siteUrl, seo } from "@/data/site";

/**
 * Per-page metadata builder.
 *
 * Every route previously hand-wrote its own `metadata` object, which is
 * how three separate defects got in:
 *
 *   1. Titles double-suffixed. The root layout declares
 *      `title.template = "%s — Asish Oliver M"`, but each route ALSO
 *      ended its own title with "— Asish Oliver M", producing
 *      "Work — Asish Oliver M — Asish Oliver M" in search results.
 *   2. Canonical was wrong on every page. `alternates.canonical: "/"`
 *      sits in the root layout, which children inherit — so /work,
 *      /about and all six case studies all advertised
 *      `<link rel="canonical" href="/">`, telling search engines the
 *      entire site is a duplicate of the homepage.
 *   3. Case studies dropped `og:image`. The project route overrides
 *      `openGraph` wholesale with `{title, description, type}`, and
 *      because it replaced the object instead of merging, the social
 *      preview image silently disappeared from every /work/[slug] page.
 *
 * Routes now call this one function, which derives the canonical from the
 * path it is given and always carries the full OG/Twitter set. Omitting
 * the path is no longer possible to do silently.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: {
  /** Page title WITHOUT the site suffix — the template adds it. */
  title: string;
  description: string;
  /** Absolute site path, e.g. "/work/live-f1-intelligence". */
  path: string;
  type?: "website" | "article";
  /**
   * A page-specific social card, e.g. a case study's own preview image.
   * Omitted = the site card at `/opengraph-image`, which is still the right
   * answer for /work, /about, /experience and /contact: those pages are
   * about the portfolio, so the portfolio's card describes them correctly.
   */
  image?: { path: string; alt: string };
}): Metadata {
  const canonical = `${siteUrl}${path === "/" ? "" : path}`;
  const imageUrl = `${siteUrl}${image?.path ?? "/opengraph-image"}`;
  const imageAlt = image?.alt ?? seo.ogImageAlt;

  return {
    // NOTE: deliberately NOT appending "— Asish Oliver M" here. The root
    // layout declares `title.template = "%s — Asish Oliver M"`, and a
    // child `title` string is passed through that template. Appending it
    // in both places produced "Work — Asish Oliver M — Asish Oliver M"
    // in search results. The template is the single source of the suffix.
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: "Asish Oliver M",
      title,
      description,
      // Restated explicitly: the `app/opengraph-image.tsx` file
      // convention is auto-merged into the ROOT metadata only. A child
      // page overriding `openGraph` replaces that object wholesale, which
      // is how every case study ended up with no social preview image.
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // Carries `alt` as well, so the preview image is described on Twitter
      // too and not just on OpenGraph. A project card's alt names the
      // project; the site card's names the site.
      images: [{ url: imageUrl, alt: imageAlt }],
    },
  };
}