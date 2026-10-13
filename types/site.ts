/**
 * Site-wide identity, navigation, and contact data — spec §4, §10, §42.
 */

export interface SocialLinks {
  email: string;
  /** Left undefined until the owner supplies the real profile URL —
   *  never fabricate one. See data/site.ts for the flagged TODOs. */
  github?: string;
  linkedin?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteIdentity {
  name: string;
  primaryRole: string[];
  supportingStatement: string;
  location?: string;
  social: SocialLinks;
}
