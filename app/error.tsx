"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/** Next.js error boundaries must be Client Components. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Intentionally minimal — no analytics/error-reporting service is
    // wired up yet (spec §55 keeps the site backend-free for now).
    // Swap this for real error reporting once one exists.
    console.error(error);
  }, [error]);

  return (
    <Container as="section" className="flex min-h-[60vh] flex-col justify-center py-24">
      <TechnicalLabel className="text-critical">System Error</TechnicalLabel>
      <h1 className="mt-4 font-display text-display-lg uppercase tracking-tight">
        Something Failed
      </h1>
      <p className="mt-4 max-w-md font-body text-foreground-muted">
        An unexpected error interrupted this page. It has been logged locally.
      </p>
      <div className="mt-8">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 border border-border-strong px-5 py-2.5 font-technical text-xs uppercase tracking-[0.15em] text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Try Again
        </button>
      </div>
    </Container>
  );
}
