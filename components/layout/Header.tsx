"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/data/navigation";
import { siteIdentity } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { cn } from "@/lib/utils";

/**
 * Spec §23: "ASISH / OLIVER" wordmark, primary nav, then GitHub/LinkedIn —
 * rendered only when a real URL exists in data/site.ts (spec §9: "do not
 * invent links").
 *
 * The old third element in that cluster read "SYSTEM STATUS: ONLINE" next
 * to a green lamp. Nothing was transmitting a status; the lamp was a
 * decorative claim that a system was running. It now states the one thing
 * that is actually true and actually useful to a reader: that Asish is
 * available for the work this site is about. Same visual slot, same
 * instrument idiom, no invented liveness.
 *
 * Every control here carries a 44px hit area (`min-h-11`). The nav labels
 * previously measured 24px tall and the utility links 32px — both under the
 * design contract's own ≥44px bar, and both among the first things a
 * visitor tries to tap.
 *
 * This is a client component because the mobile menu needs open/close
 * state — spec §29 allows client components for interaction.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { github, linkedin } = siteIdentity.social;

  /**
   * Active-route indicator.
   *
   * A nav item is current when the path matches it, OR when it is a
   * section prefix of the path — /work is still the active item while the
   * reader is inside /work/live-f1-intelligence, because that case study
   * belongs to the Selected Systems section. Without the prefix rule the
   * indicator vanished exactly when a reader was deepest in the content.
   *
   * Marked with `aria-current="page"` so the state is announced, not only
   * drawn; the underline is presentation layered on top of that.
   *
   * MOTION. The rule used to animate `width` from 0 to full, which is a
   * layout property — every frame re-flowed the nav item. It is now a
   * full-width 1px rule scaled on X from the left with `origin-left`, which
   * is compositor-only and gives the same "trace drawing across the label"
   * read. Hover runs the same rule at a lower weight, so pointer and active
   * state are visibly the same instrument rather than two different idioms;
   * the transition duration is the shared `--motion-fast` token.
   */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const utilityLinks = [
    github ? { label: "GITHUB", href: github } : null,
    linkedin ? { label: "LINKEDIN", href: linkedin } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/90 backdrop-blur-sm">
      <Container as="div" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="-my-2 inline-flex min-h-11 items-center py-2 font-display text-lg uppercase tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          ASISH <span className="text-foreground-muted">/</span> OLIVER
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/nav relative inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] transition-colors",
                  active ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {/* The label and its rule live on an inner span so the
                    underline stays fixed to the text while the outer link
                    grows to a 44px hit area. */}
                <span className="relative">
                  {item.label}
                  {/* The indicator is a rule that grows from the left, rather
                      than a filled pill — a control layer, not a chip.
                      Rest state is `scale-x-0`, not `hidden`, so the rule
                      occupies its box at all times and revealing it cannot
                      shift the row. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-(--motion-duration-base) ease-(--motion-ease-standard) motion-reduce:transition-none",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/nav:scale-x-50 group-focus-visible:scale-x-50 motion-reduce:group-hover/nav:scale-x-100 motion-reduce:group-focus-visible:scale-x-100"
                    )}
                  />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Utility cluster (GitHub / LinkedIn / status) is the widest
            element in the bar. Showing it at the same breakpoint as the
            primary nav made the header ~700px of content inside a 640px
            container at exactly 768px, which overflowed the viewport by
            3px. Staged to lg so the bar never has to overflow. */}
        <div className="hidden items-center gap-6 lg:flex">
          {utilityLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="utility-link inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-2 border-l border-border-subtle pl-6">
            <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true" />
            <TechnicalLabel>Available for Work</TechnicalLabel>
          </div>
        </div>

        {/* Mobile menu toggle — persists until the full utility cluster
            has room, i.e. until lg, not md. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-foreground transition-transform duration-(--motion-duration-base) ease-(--motion-ease-standard) motion-reduce:transition-none",
                menuOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-foreground transition-opacity duration-(--motion-duration-base) ease-(--motion-ease-standard) motion-reduce:transition-none",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-full bg-foreground transition-transform duration-(--motion-duration-base) ease-(--motion-ease-standard) motion-reduce:transition-none",
                menuOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </Container>

      {/* Mobile nav panel */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={cn(
          "border-t border-border-subtle bg-background lg:hidden",
          menuOpen ? "block" : "hidden"
        )}
      >
        <Container as="div" className="flex flex-col gap-1 py-4">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 py-3 font-display text-2xl uppercase tracking-tight",
                  active ? "text-foreground" : "text-foreground-muted"
                )}
              >
                {active && (
                  <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent" />
                )}
                {item.label}
              </Link>
            );
          })}
          {utilityLinks.length > 0 && (
            <div className="mt-4 flex gap-6 border-t border-border-subtle pt-4">
              {utilityLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}
