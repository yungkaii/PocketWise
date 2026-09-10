/** Single source of truth for sidebar + mobile navigation. */
export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { to: "/transactions", label: "Transactions", icon: "ArrowLeftRight" },
  { to: "/accounts", label: "Accounts", icon: "Wallet" },
  { to: "/categories", label: "Categories", icon: "Tags" },
  { to: "/budgets", label: "Budgets", icon: "Target" },
  { to: "/analytics", label: "Analytics", icon: "ChartLine" },
  { to: "/reports", label: "Reports", icon: "FileText" },
  { to: "/settings", label: "Settings", icon: "Settings" },
];

/** Mobile bottom navigation: Dashboard, Transactions, Add, Budgets, More. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: "LayoutDashboard" },
  { to: "/transactions", label: "Transact", icon: "ArrowLeftRight" },
  { to: "/budgets", label: "Budgets", icon: "Target" },
];
