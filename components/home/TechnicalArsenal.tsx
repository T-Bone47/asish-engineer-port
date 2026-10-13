import { skillGroups } from "@/data/skills";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Technical arsenal.
 *
 * The brief bans the "giant logo-wall" and this is a grouped text index
 * rather than one — but it previously shared the exact same
 * `sm:grid-cols-2 lg:grid-cols-3` geometry as Engineering Domains, twice
 * on one screen. Repeated structure is the loudest AI tell there is.
 *
 * Now it reads as a printed index: numbered groups in a three-column
 * layout where each item sits on its own hairline-separated row within its
 * column, so the eye can run down a single list rather than scanning a
 * uniform block of chips. Dense, quiet, and unlike the section above it,
 * which is an editorial two-column table rather than a grid.
 */
export function TechnicalArsenal() {
  return (
    <Container as="section" className="border-t border-border-subtle py-14 md:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <TechnicalLabel as="h2" className="text-accent">Technical Arsenal</TechnicalLabel>
        <p className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
          {skillGroups.length} groups · Used, not collected
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
        {skillGroups.map((group, groupIndex) => (
          <div key={group.id}>
            <div className="flex items-baseline gap-2 border-b border-border-strong pb-2">
              <span className="font-technical text-[11px] tabular-nums text-foreground-faint">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <h3 className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground">
                {group.title}
              </h3>
            </div>

            <ul>
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-b border-border-subtle py-1.5 font-body text-sm text-foreground-muted last:border-b-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}