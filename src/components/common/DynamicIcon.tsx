import * as icons from "lucide-react";
import type { LucideProps } from "lucide-react";

/** Resolves a Lucide icon by name so icons can be stored as data (mock/API). */
export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = (icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  const Fallback = icons.Circle;
  const Component = Icon ?? Fallback;
  return <Component {...props} />;
}
