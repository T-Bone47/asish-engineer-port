import { cn } from "@/lib/utils";

/**
 * Shared content-width wrapper. Kept plain on purpose: no decorative
 * grid lines or corner marks added here yet — those are exactly the
 * kind of detail that needs a real browser to get right, and spec §37
 * rules out decoration that isn't earning its place.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-6 md:px-16", className)}>
      {children}
    </Tag>
  );
}
