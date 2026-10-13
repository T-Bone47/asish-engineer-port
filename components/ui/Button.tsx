import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:bg-accent-strong",
  secondary:
    "border border-border-strong text-foreground hover:border-accent hover:text-accent",
};

// `min-h-11` (44px) is the touch target the design contract already
// promised (DESIGN.md → "touch targets ≥44px"). At py-2.5 the rendered box
// was 36px, so the promise was not met by the two most important controls
// on the site. Enforcing it here fixes every Button in one place.
//
// MOTION. Colour and border transitions only, and both the duration and the
// curve come from the shared motion tokens (`--motion-duration-fast`,
// `--motion-ease-standard`) rather than being written into this file —
// lib/motion.test.ts fails the build if a component hardcodes a duration or
// an easing curve of its own. Fast enough to feel like an instrument
// responding, slow enough not to flicker under a moving cursor. `active:`
// adds a 1px press so the control acknowledges the click on devices with no
// hover, and nothing here moves the button or changes its box, so the click
// target is identical at rest, on hover and while pressed.
const baseStyles =
  "inline-flex min-h-11 items-center gap-2 px-5 py-2.5 font-technical text-xs uppercase tracking-[0.15em] transition-[color,background-color,border-color] duration-(--motion-duration-fast) ease-(--motion-ease-standard) active:translate-y-px focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:active:translate-y-0";

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
  /** External links (GitHub, LinkedIn, etc.) open in a new tab. */
  external?: boolean;
}

export function Button({ children, href, variant = "primary", className, external = false }: ButtonProps) {
  const styles = cn(baseStyles, VARIANT_STYLES[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
