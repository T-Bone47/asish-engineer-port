import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container as="section" className="flex min-h-[60vh] flex-col justify-center py-24">
      <TechnicalLabel className="text-accent">Error 404</TechnicalLabel>
      <h1 className="mt-4 font-display text-display-lg uppercase tracking-tight">
        System Not Found
      </h1>
      <p className="mt-4 max-w-md font-body text-foreground-muted">
        Nothing is mapped to this route.
      </p>
      <div className="mt-8">
        <Button href="/" variant="secondary">
          Return Home
        </Button>
      </div>
    </Container>
  );
}
