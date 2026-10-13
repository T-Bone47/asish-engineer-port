import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

/**
 * robots.txt. Previously 404'd — the site had no crawler policy at all,
 * which meant the sitemap had nowhere to be advertised from.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}