import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { siteIdentity } from "@/data/site";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Full About content.
 *
 * REWRITTEN. This previously rendered the identical `FlowSteps` chain and
 * the identical paragraph as `EngineeringStatement` on the homepage —
 * the same six words and the same two sentences, twice, on two routes.
 * That is duplication the reader pays for and gains nothing from, and it
 * left the page failing its own job: it was titled "About" and answered
 * nothing about who Asish is.
 *
 * What replaces it is only what the data can actually support: the role
 * split, the domains worked in, the professional track record, and
 * education. No invented biography, no motivation paragraph, no
 * self-assessment adjectives — those would be fabrication of exactly the
 * kind spec §37 and §74 prohibit.
 *
 * Education stays minimal per spec §21 — institution and program only.
 * No CGPA, grades, marks or semester data exists here, and none is added.
 */
export function AboutContent() {
  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-12">
      {/* ---- Position ---- */}
      <div className="lg:col-span-7">
        <TechnicalLabel>Position</TechnicalLabel>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-foreground-muted">
          Motorsport is the primary engineering domain. AI/ML, simulation and
          software are the tools used to solve problems within it — which is
          why the work spans telemetry pipelines, numerical vehicle models,
          race strategy systems and applied machine learning rather than any
          one of them alone.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
              Role
            </dt>
            <dd className="mt-2 font-display text-xl uppercase tracking-tight">
              {siteIdentity.primaryRole.join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
              Based in
            </dt>
            <dd className="mt-2 font-display text-xl uppercase tracking-tight">
              {siteIdentity.location}
            </dd>
          </div>
          <div>
            <dt className="font-technical text-[11px] uppercase tracking-[0.2em] text-foreground-faint">
              Education
            </dt>
            <dd className="mt-2 font-display text-xl uppercase tracking-tight">
              {education.institution}
            </dd>
            <dd className="mt-1 font-body text-sm text-foreground-muted">
              {education.program}
            </dd>
          </div>
        </dl>
      </div>

      {/* ---- Track record ---- */}
      <div className="lg:col-span-5">
        <TechnicalLabel>Experience</TechnicalLabel>
        <ul className="mt-4">
          {experience.map((entry) => (
            <li key={entry.id} className="border-t border-border-subtle py-5 first:border-t-0 first:pt-0">
              <div className="font-display text-lg uppercase tracking-tight">
                {entry.organization}
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="font-body text-sm text-foreground-muted">{entry.role}</span>
                <span className="font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint">
                  {entry.period}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}