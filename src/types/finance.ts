/** Core domain types for PocketWise. Shared by mock data, services and UI. */

export type TransactionType = "income" | "expense";

export type AccountType = "cash" | "bank" | "ewallet";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  /** Lucide icon name, resolved through constants/icons. */
  icon: string;
  /** Design-system color token key (e.g. "brand", "success"). */
  color: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  /** ISO date string (yyyy-MM-dd). */
  date: string;
  /** HH:mm */
  time: string;
  note: string;
}

export type BudgetStatus = "healthy" | "warning" | "exceeded";

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  month: number; // 1-12
  year: number;
}

export interface BudgetProgress extends Budget {
  categoryName: string;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

export interface CashFlow {
  income: number;
  expense: number;
  net: number;
}

export interface CategorySpend {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  percentage: number;
}

/** Generic list query shape — mirrors what a REST backend will accept later. */
export interface TransactionQuery {
  search?: string;
  type?: TransactionType | "all";
  categoryId?: string | "all";
  accountId?: string | "all";
  from?: string;
  to?: string;
  sortBy?: "date" | "amount";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
