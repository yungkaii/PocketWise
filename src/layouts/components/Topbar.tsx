import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Menu, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { usePreferences } from "@/contexts/PreferencesContext";
import { mockProfile } from "@/data/mock-data";
import { Amount } from "@/components/common/Amount";
import { useState } from "react";

export function Topbar({ totalBalance, onAdd }: { totalBalance: number; onAdd?: (() => void) | undefined }) {
  const { balanceHidden, toggleBalance } = usePreferences();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    void navigate({ to: "/add" });
    onAdd?.();
  };

  const handleProfile = () => {
    void navigate({ to: "/settings" });
  };

  return (
    <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-background/95 py-5 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none">
      <div className="flex min-w-0 items-center gap-3">
        {/* Tablet/mobile drawer trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open navigation"
            className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card lg:hidden"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background p-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-md bg-brand text-brand-foreground shadow-cut-sm"
            style={{ transform: "rotate(-3deg)" }}
          >
            <span className="font-display text-lg font-bold">P</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold leading-none tracking-tight">
              PocketWise
            </span>
            <span className="mt-1 hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Paper-ledger money
            </span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleBalance}
          className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary sm:inline-flex"
        >
          {balanceHidden ? <EyeOff className="size-3.5" /> : <span className="size-2 rounded-full bg-success" />}
          <Amount value={totalBalance} privacy />
        </button>
        <ThemeToggle />
        <button
          onClick={handleAdd}
          className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-cut-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          <Plus className="size-4" /> Add
        </button>
        <button
          type="button"
          onClick={handleProfile}
          aria-label="Open profile"
          className="ml-1 hidden size-9 place-items-center rounded-full bg-paper-3 text-sm font-bold outline-2 outline-border transition-colors hover:bg-secondary sm:grid"
        >
          {mockProfile.initials}
        </button>
      </div>
    </header>
  );
}
