import { engineeringDomains } from "@/data/engineering-domains";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Engineering domains.
 *
 * NOT another three-column card grid. `EngineeringDomains` and
 * `TechnicalArsenal` previously used the identical `sm:grid-cols-2
 * lg:grid-cols-3` structure directly above and below each other, so two
 * consecutive sections looked like the same list twice.
 *
 * This is now an editorial spec table: a two-column layout where the
 * domain name and its capabilities sit on a shared baseline, separated by
 * hairlines, like a printed table of contents. The list is dense and
 * scannable rather than airy and repeated — which also matches what the
 * content actually is: a classification, not a set of features.
 */
export function EngineeringDomains() {
  return (
    <Container as="section" className="border-t border-border-subtle py-16 md:py-24">
      <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
        {/* Sticky-ish column heading gives the section its own identity
            instead of letting the grid start immediately at the eyebrow. */}
        <div className="lg:col-span-4">
          <TechnicalLabel as="h2" className="text-accent">Engineering Domains</TechnicalLabel>
          <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-foreground-muted">
            Capabilities organised around engineering problems, rather than
            around a list of tools.
          </p>
        </div>

        <dl className="lg:col-span-8">
          {engineeringDomains.map((domain, i) => (
            <div
              key={domain.id}
              className={
                i === 0
                  ? "grid grid-cols-1 gap-x-8 gap-y-2 border-t border-border-strong py-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-y-0"
                  : "grid grid-cols-1 gap-x-8 gap-y-2 border-t border-border-subtle py-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-y-0"
              }
            >
              <dt className="font-display text-lg uppercase tracking-tight">
                {domain.title}
              </dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1">
                {domain.items.map((item) => (
                  <span key={item} className="font-body text-sm text-foreground-muted">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}