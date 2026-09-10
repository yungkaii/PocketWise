import type { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { MobileNav } from "./components/MobileNav";

interface DashboardLayoutProps {
  children: ReactNode;
  totalBalance: number;
  onAdd?: (() => void) | undefined;
}

/** App shell: topbar + desktop sidebar + mobile bottom nav. */
export function DashboardLayout({ children, totalBalance, onAdd }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grain" aria-hidden />
      <div className="mx-auto max-w-[1440px] px-4 pb-28 sm:px-6 lg:px-8 lg:pb-8">
        <Topbar totalBalance={totalBalance} onAdd={onAdd} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <Sidebar className="sticky top-6" />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <MobileNav onAdd={onAdd} />
    </div>
  );
}
