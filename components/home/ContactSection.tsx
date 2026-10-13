import { siteIdentity } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Contact — the closing statement.
 *
 * WHAT CHANGED. This was a label, a name, a location and three bare links
 * stacked in a column, all the same visual weight. It read as a footer that
 * had drifted upward rather than as the end of the page.
 *
 * Now it does the one job a closing section exists to do: make the next
 * step obvious. Email is promoted to the single primary action at display
 * scale — it is the only contact route that works without a third-party
 * account — and the social links drop to their correct weight as edge
 * metadata. Location moves to the same metadata row.
 *
 * Frictionless by construction: the email is a real `mailto:` link and the
 * socials are ordinary links with `noopener`. No form, because there is no
 * backend to submit one to, and a form that cannot send is worse than no
 * form.
 */
export function ContactSection({
  headingLevel = "h2",
}: {
  /** "h1" on /contact (sole page heading), "h2" on the homepage. */
  headingLevel?: "h1" | "h2";
}) {
  const { email, github, linkedin } = siteIdentity.social;
  const Heading = headingLevel;

  const socials = [
    github ? { label: "GitHub", href: github } : null,
    linkedin ? { label: "LinkedIn", href: linkedin } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <section className="border-t border-border-subtle">
      <Container className="py-20 md:py-32">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          {/* ---- The invitation ---- */}
          <div className="lg:col-span-7">
            {/* No "Contact" kicker above the heading. It repeated the nav
                item and labelled a heading that already says what it is —
                the stacked-eyebrow pattern this design system bans, and the
                only other place on the site still doing it. */}
            <Heading className="font-display text-display-lg uppercase leading-[0.95] tracking-tight">
              {/* The explicit space matters: without it the accessible
                  name of this heading flattens to "aboutthe engineering",
                  because a <br /> contributes no whitespace to the text
                  content that assistive tech announces. */}
              Let&rsquo;s talk about{" "}
              <br />
              the engineering.
            </Heading>

            <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-foreground-muted">
              Open to motorsport software, simulation and applied AI/ML work.
              The fastest route is email.
            </p>

            <a
              href={`mailto:${email}`}
              className="group mt-10 inline-flex min-h-11 items-center gap-4 border-b border-border-strong py-2 font-display text-2xl uppercase tracking-tight transition-colors hover:border-accent hover:text-accent md:text-3xl"
            >
              <span className="break-all">{email}</span>
              <span
                aria-hidden="true"
                className="font-technical text-xl transition-transform duration-(--motion-duration-fast) ease-(--motion-ease-standard) group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </a>
          </div>

          {/* ---- Supporting metadata ---- */}
          <div className="lg:col-span-5 lg:pt-2">
            <div className="border-l border-border-subtle pl-6">
              <div className="space-y-6">
                <div>
                  <TechnicalLabel>Based in</TechnicalLabel>
                  <p className="mt-1.5 font-body text-sm text-foreground-muted">
                    {siteIdentity.location}
                  </p>
                </div>

                <div>
                  <TechnicalLabel>Role</TechnicalLabel>
                  <ul className="mt-1.5 space-y-0.5">
                    {siteIdentity.primaryRole.map((role) => (
                      <li key={role} className="font-body text-sm text-foreground-muted">
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>

                {socials.length > 0 && (
                  <div>
                    <TechnicalLabel>Elsewhere</TechnicalLabel>
                    <ul className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1">
                      {socials.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-accent"
                          >
                            {item.label} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}