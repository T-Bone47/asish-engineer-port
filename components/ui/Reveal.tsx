import { cn } from "@/lib/utils";

/**
 * Section reveal — CSS scroll-driven animation, no client JavaScript.
 *
 * ORIGINALLY a "use client" component using IntersectionObserver + a
 * transition. That shipped `opacity-0 translate-y-4` in the server HTML
 * and only cleared it after hydration, which meant every below-the-fold
 * section was rendered invisible until JS ran. Any failure to hydrate —
 * blocked script, slow device, JS error — left the majority of the page
 * permanently blank. The observer also disconnected on first intersect,
 * so it could never re-run, and it added a hydration boundary to the
 * homepage for an effect that CSS now does better.
 *
 * Replaced with `animation-timeline: view()`, which is pure CSS and
 * degrades correctly by construction:
 *
 *   - No JS means no observer, no hydration cost, no client bundle.
 *   - Unsupported browsers ignore the `@supports` block entirely and
 *     render content in its final, visible state — the failure mode is
 *     "no animation", never "invisible content".
 *   - The animation is driven by the scroll position itself, so it stays
 *     in sync on fast scroll and cannot desync from layout.
 *   - Gated behind `prefers-reduced-motion: no-preference`, so reduced-
 *     motion users get static content with no animation at all.
 *
 * `delayMs` is intentionally kept as a no-op-free API removal: stagger
 * across sections is exactly the "random stagger explosion" the design
 * brief rules out. See globals.css for the `.reveal` definition.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}