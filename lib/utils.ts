/** Minimal className combiner — avoids pulling in clsx/tailwind-merge
 *  for something this small (spec §35: dependency discipline). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
