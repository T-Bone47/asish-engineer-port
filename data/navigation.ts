import type { NavItem } from "@/types/site";

/** Spec §10, §23 — deliberately not overloaded with every section. */
export const primaryNav: NavItem[] = [
  { label: "WORK", href: "/work" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

// GitHub/LinkedIn utility links live on siteIdentity.social (data/site.ts)
// instead of here — Header derives them from there directly so there's
// one place to fill in the real URLs, not two.
