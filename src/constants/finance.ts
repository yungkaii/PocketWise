import type { AccountType, BudgetStatus, TransactionType } from "@/types/finance";

export const CURRENCY_LOCALE = "id-ID";
export const CURRENCY_CODE = "IDR";

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  cash: "Cash",
  bank: "Bank",
  ewallet: "E-Wallet",
};

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  income: "Income",
  expense: "Expense",
};

export const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  exceeded: "Exceeded",
};

/** Maps a semantic color key to design-system utility classes. */
export const COLOR_TOKEN: Record<string, { text: string; bg: string; dot: string; css: string }> = {
  brand: {
    text: "text-brand",
    bg: "bg-brand/12",
    dot: "bg-brand",
    css: "var(--brand)",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent/15",
    dot: "bg-accent",
    css: "var(--accent)",
  },
  success: {
    text: "text-success",
    bg: "bg-success/15",
    dot: "bg-success",
    css: "var(--success)",
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning/15",
    dot: "bg-warning",
    css: "var(--warning)",
  },
  danger: {
    text: "text-danger",
    bg: "bg-danger/15",
    dot: "bg-danger",
    css: "var(--danger)",
  },
  ink: {
    text: "text-foreground",
    bg: "bg-paper-3",
    dot: "bg-foreground",
    css: "var(--foreground)",
  },
};

export const PERIOD_PRESETS = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "custom", label: "Custom" },
] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number]["id"];
