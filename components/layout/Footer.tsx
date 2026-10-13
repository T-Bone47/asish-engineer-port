import { siteIdentity, portfolioRepo } from "@/data/site";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const { email, github, linkedin } = siteIdentity.social;
  const links = [
    { label: email, href: `mailto:${email}` },
    github ? { label: "GITHUB", href: github } : null,
    linkedin ? { label: "LINKEDIN", href: linkedin } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <footer className="border-t border-border-subtle">
      <Container
        as="div"
        className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <TechnicalLabel as="p">
            {siteIdentity.name} — {new Date().getFullYear()}
          </TechnicalLabel>
          {/* Small technical signature: states what this artefact is
              built with, which is itself part of the pitch for an
              engineer. Links to the source rather than asserting it. */}
          <a
            href={portfolioRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-11 items-center font-technical text-[11px] uppercase tracking-[0.15em] text-foreground-faint transition-colors hover:text-accent"
          >
            Next.js · TypeScript · Open source →
          </a>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Contact">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center font-technical text-xs uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-foreground"
              {...(item.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
