import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/constants/navigation";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { cn } from "@/lib/utils";

/** Desktop sidebar — paper panel with washi tape. */
export function Sidebar({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-sidebar p-4 shadow-cut",
        className,
      )}
    >
      <span className="tape" style={{ top: -10, left: 24, transform: "rotate(-8deg)" }} />
      <nav className="mt-3 space-y-1 text-sm font-medium">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "bg-brand text-brand-foreground hover:bg-brand" }}
            inactiveProps={{ className: "text-foreground/70 hover:bg-secondary" }}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <DynamicIcon name={item.icon} className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
