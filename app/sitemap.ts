import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { projects } from "@/data/projects";

/**
 * Sitemap. Built from the same `projects` array the routes render from,
 * so a project can't be added without also being listed here — the two
 * can't drift.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/experience", "/about", "/contact"];

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.6,
    })),
  ];
}