import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Plus } from "lucide-react";
import { MOBILE_NAV_ITEMS, NAV_ITEMS } from "@/constants/navigation";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MORE_ITEMS = NAV_ITEMS.filter(
  (item) => !MOBILE_NAV_ITEMS.some((m) => m.to === item.to),
);

/** Mobile bottom navigation with a raised quick-add action. */
export function MobileNav({ onAdd }: { onAdd?: (() => void) | undefined }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {MOBILE_NAV_ITEMS.slice(0, 2).map((item) => (
          <NavButton key={item.to} to={item.to} label={item.label} icon={item.icon} />
        ))}

        <button
          onClick={onAdd}
          aria-label="Add transaction"
          className="-mt-6 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-cut"
        >
          <Plus className="size-6" />
        </button>

        {MOBILE_NAV_ITEMS.slice(2).map((item) => (
          <NavButton key={item.to} to={item.to} label={item.label} icon={item.icon} />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-1 px-2 text-[11px] text-muted-foreground">
            <MoreHorizontal className="size-5" />
            More
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2 w-44">
            {MORE_ITEMS.map((item) => (
              <DropdownMenuItem key={item.to} asChild>
                <Link to={item.to}>
                  <DynamicIcon name={item.icon} className="size-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

function NavButton({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      activeProps={{ className: "text-brand font-semibold" }}
      inactiveProps={{ className: "text-muted-foreground" }}
      className="flex flex-col items-center gap-1 px-2 text-[11px]"
    >
      <DynamicIcon name={icon} className="size-5" />
      {label}
    </Link>
  );
}
