import type { ReactNode } from "react";
import { DynamicIcon } from "./DynamicIcon";

/** Shared empty/error state used across pages. */
export function EmptyState({
  icon = "Inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <DynamicIcon name={icon} className="size-5" />
      </span>
      <div>
        <p className="font-display text-base font-bold">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
