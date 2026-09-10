import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PaperPanelProps {
  children: ReactNode;
  className?: string;
  /** Adds a washi-tape accent to the panel corner. */
  tape?: "left" | "right" | false;
  tornTop?: boolean;
}

/** The base surface of the design system: a cream paper card with a cut shadow. */
export function PaperPanel({ children, className, tape = false, tornTop }: PaperPanelProps) {
  return (
    <section
      className={cn(
        "relative rounded-lg border border-border bg-card p-5 shadow-cut",
        tornTop && "torn-top",
        className,
      )}
    >
      {tape === "left" && (
        <span className="tape" style={{ top: -10, left: 22, transform: "rotate(-6deg)" }} />
      )}
      {tape === "right" && (
        <span className="tape" style={{ top: -10, right: 22, transform: "rotate(7deg)" }} />
      )}
      {children}
    </section>
  );
}

export function PanelHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {action}
    </div>
  );
}
