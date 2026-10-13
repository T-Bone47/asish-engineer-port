import Link from "next/link";
import { siteIdentity } from "@/data/site";
import { getProjectBySlug } from "@/data/projects";
import { STATUS_LABEL } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeroInstrument } from "@/components/home/HeroInstrument";

/**
 * Hero.
 *
 * Composition is an asymmetric 7/5 split rather than the previous
 * single left-aligned column inside a centred max-width container. The
 * previous version stacked name → roles → statement → buttons down one
 * edge with nothing to hold the right half, which is the single most
 * common AI-portfolio hero shape.
 *
 * The right column carries `HeroInstrument` — the canonical-event
 * convergence figure, built from the flagship project's own provider list
 * and verified metrics. It replaced a fake boot readout whose progress bars
 * were filling for a system that does not exist (see HeroInstrument.tsx).
 *
 * Deliberately NOT used:
 *   - A kicker/eyebrow above the H1. The old "Engineering Portfolio"
 *     label sat above the name and told the reader nothing the name
 *     didn't. Domain metadata now lives in the footer band of this
 *     section where it is real information, not decoration.
 *   - A secondary CTA that duplicates "View Systems". The secondary
 *     action is Experience, which is the other thing a recruiter needs
 *     and the previous hero offered no route to it at all.
 */

/**
 * Domain status band.
 *
 * Each entry names the project that actually backs the domain, and the
 * status is read from that project. It used to be a hand-written array of
 * labels and states sitting in this file, which is a claim that silently
 * drifts the moment a project's status changes — no longer.
 *
 * `undefined` from `getProjectBySlug` is filtered out rather than rendered
 * as a blank, so a renamed slug removes a row instead of inventing one.
 */
const DOMAIN_SOURCES = [
  { label: "Motorsport", slug: "live-f1-intelligence" },
  { label: "Simulation", slug: "f1-lap-time-simulator" },
  { label: "Telemetry", slug: "racemind-ai" },
  { label: "AI / ML", slug: "ea-fc-intelligence" },
] as const;

const DOMAINS: { label: string; state: string }[] = DOMAIN_SOURCES.flatMap(
  (domain) => {
    const project = getProjectBySlug(domain.slug);
    return project
      ? [{ label: domain.label as string, state: STATUS_LABEL[project.status] }]
      : [];
  }
);

export function Hero() {
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-16 gap-y-12 px-6 pb-16 pt-24 md:px-16 md:pb-24 md:pt-32 lg:grid-cols-12">
        {/* ---- Identity column ----
            `.seq` runs the governed entrance sequence (identity → role →
            statement → actions), 80ms apart, from the motion tokens in
            globals.css. The H1 is the sequence's first child and is
            deliberately the one item that moves without fading: it is the
            largest-contentful-paint element, and holding it at opacity 0
            for even 80ms would delay the moment the browser counts the
            page as painted. Everything after it fades as well as rises. */}
        <div className="seq lg:col-span-7">
          <h1 className="font-display text-display-xl uppercase leading-[0.92] tracking-tight">
            {siteIdentity.name}
          </h1>

          <ul className="seq-tight mt-5 space-y-1">
            {siteIdentity.primaryRole.map((role) => (
              <li
                key={role}
                className="font-display text-display-md uppercase leading-tight text-foreground-muted"
              >
                {role}
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-foreground-muted">
            {siteIdentity.supportingStatement}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/work" variant="primary">
              View Selected Systems
            </Button>
            <Button href="/experience" variant="secondary">
              Engineering Profile
            </Button>
          </div>
        </div>

        {/* ---- Instrumentation column ----
            A real figure over a fake readout: the convergence the
            flagship is built on, with its two verified figures printed
            beneath it and a direct route into that case study. */}
        <div className="lg:col-span-5 lg:pt-3">
          <figure className="border-l border-border-subtle pl-6">
            <HeroInstrument />
            <figcaption className="mt-4 flex items-center justify-between gap-x-4">
              <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                Ingestion layer
              </span>
              <Link
                href="/work/live-f1-intelligence"
                className="inline-flex min-h-11 items-center font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-accent"
              >
                Live F1 Intelligence →
              </Link>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ---- Domain status band ----
          Reads as instrumentation rather than footer metadata: each domain
          carries the status of the project that backs it. The statuses are
          read from `data/projects.ts` above, so this band cannot claim a
          state the project data does not. */}
      <div className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3.5 md:px-16">
          {DOMAINS.map((domain) => (
            <span key={domain.label} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-live"
              />
              <span className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground">
                {domain.label}
              </span>
              <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                {domain.state}
              </span>
            </span>
          ))}
          <span className="ml-auto font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
            {siteIdentity.location}
          </span>
        </div>
      </div>
    </section>
  );
}