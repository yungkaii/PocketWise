/** Aggregation service backing the dashboard. Backend can replace with a single endpoint. */
import { store, delay } from "./mock-store";
import { budgetStatus } from "./budgetService";
import type {
  Account,
  BudgetProgress,
  CashFlow,
  CategorySpend,
  Transaction,
} from "@/types/finance";
import type { DateRange } from "@/utils/date";
import { monthLabel } from "@/utils/date";

export interface DashboardSummary {
  totalBalance: number;
  accounts: Account[];
  cashFlow: CashFlow;
  previousNet: number;
  expenseByCategory: CategorySpend[];
  incomeVsExpense: { label: string; income: number; expense: number }[];
  recentTransactions: Transaction[];
  budgets: BudgetProgress[];
}

function inRange(t: Transaction, range: DateRange) {
  return t.date >= range.from && t.date <= range.to;
}

function cashFlowOf(list: Transaction[]): CashFlow {
  const income = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
}

export const dashboardService = {
  async getSummary(range: DateRange): Promise<DashboardSummary> {
    const scoped = store.transactions.filter((t) => inRange(t, range));
    const cashFlow = cashFlowOf(scoped);

    const expenses = scoped.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0) || 1;
    const expenseByCategory: CategorySpend[] = store.categories
      .filter((c) => c.type === "expense")
      .map((c) => {
        const total = expenses
          .filter((t) => t.categoryId === c.id)
          .reduce((s, t) => s + t.amount, 0);
        return {
          categoryId: c.id,
          name: c.name,
          color: c.color,
          total,
          percentage: (total / totalExpense) * 100,
        };
      })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    // Last 6 months income vs expense trend.
    const now = new Date();
    const incomeVsExpense = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const prefix = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`;
      const monthly = store.transactions.filter((t) => t.date.startsWith(prefix));
      const flow = cashFlowOf(monthly);
      return { label: monthLabel(d.getMonth() + 1, d.getFullYear()), income: flow.income, expense: flow.expense };
    });

    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevPrefix = `${prev.getFullYear()}-${`${prev.getMonth() + 1}`.padStart(2, "0")}`;
    const previousNet = cashFlowOf(
      store.transactions.filter((t) => t.date.startsWith(prevPrefix)),
    ).net;

    const monthPrefix = range.from.slice(0, 7);
    const budgets: BudgetProgress[] = store.budgets
      .filter((b) => `${b.year}-${`${b.month}`.padStart(2, "0")}` === monthPrefix)
      .map((b) => {
        const spent = store.transactions
          .filter(
            (t) => t.type === "expense" && t.categoryId === b.categoryId && t.date.startsWith(monthPrefix),
          )
          .reduce((s, t) => s + t.amount, 0);
        const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;
        return {
          ...b,
          categoryName: store.categories.find((c) => c.id === b.categoryId)?.name ?? "Unknown",
          spent,
          remaining: b.limit - spent,
          percentage,
          status: budgetStatus(percentage),
        };
      });

    return delay({
      totalBalance: store.accounts.reduce((s, a) => s + a.balance, 0),
      accounts: [...store.accounts],
      cashFlow,
      previousNet,
      expenseByCategory,
      incomeVsExpense,
      recentTransactions: [...store.transactions]
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
        .slice(0, 5),
      budgets,
    });
  },
};
