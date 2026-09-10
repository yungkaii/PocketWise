/** Budget service — mock implementation with progress derivation. */
import { delay, makeId, store } from "./mock-store";
import type { Budget, BudgetProgress, BudgetStatus } from "@/types/finance";

export type BudgetInput = Omit<Budget, "id">;

export function budgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "exceeded";
  if (percentage >= 80) return "warning";
  return "healthy";
}

function progressFor(budget: Budget): BudgetProgress {
  const prefix = `${budget.year}-${`${budget.month}`.padStart(2, "0")}`;
  const spent = store.transactions
    .filter(
      (t) => t.type === "expense" && t.categoryId === budget.categoryId && t.date.startsWith(prefix),
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

  return {
    ...budget,
    categoryName: store.categories.find((c) => c.id === budget.categoryId)?.name ?? "Unknown",
    spent,
    remaining: budget.limit - spent,
    percentage,
    status: budgetStatus(percentage),
  };
}

export const budgetService = {
  async getBudgets(month?: number, year?: number): Promise<BudgetProgress[]> {
    const list = store.budgets.filter(
      (b) => (month ? b.month === month : true) && (year ? b.year === year : true),
    );
    return delay(list.map(progressFor));
  },

  async createBudget(input: BudgetInput): Promise<Budget> {
    const budget: Budget = { ...input, id: makeId("bdg") };
    store.budgets = [...store.budgets, budget];
    return delay(budget);
  },

  async updateBudget(id: string, input: Partial<BudgetInput>): Promise<Budget> {
    store.budgets = store.budgets.map((b) => (b.id === id ? { ...b, ...input } : b));
    return delay(store.budgets.find((b) => b.id === id)!);
  },

  async deleteBudget(id: string): Promise<void> {
    store.budgets = store.budgets.filter((b) => b.id !== id);
    return delay(undefined);
  },
};
