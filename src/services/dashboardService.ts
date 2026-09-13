/** Aggregation service backing the dashboard, backed by Supabase. */
import { supabase } from "@/lib/supabase";
import { budgetStatus } from "./budgetService";
import type {
  Account,
  Budget,
  BudgetProgress,
  CashFlow,
  Category,
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
  categories: Category[];
}

function cashFlowOf(list: Transaction[]): CashFlow {
  const income = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
}

/** Maps a Supabase transactions row (snake_case) into the app's Transaction type (camelCase). */
function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    categoryId: row.category_id,
    accountId: row.account_id,
    date: row.transaction_date,
    time: row.time ?? "00:00",
    note: row.note ?? "",
  };
}

function mapAccount(row: any): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: Number(row.balance),
    icon: row.icon ?? "wallet",
    color: row.color ?? "brand",
  };
}

export const dashboardService = {
  async getSummary(range: DateRange): Promise<DashboardSummary> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Tidak ada user yang login.");
    }

    // Ambil semua akun milik user
    const { data: accountRows, error: accErr } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id);

    if (accErr) throw accErr;
    const accounts: Account[] = (accountRows ?? []).map(mapAccount);

    // Ambil transaksi dalam rentang tanggal yang diminta
    const { data: txRows, error: txErr } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("transaction_date", range.from)
      .lte("transaction_date", range.to);

    if (txErr) throw txErr;
    const scoped: Transaction[] = (txRows ?? []).map(mapTransaction);
    const cashFlow = cashFlowOf(scoped);

    // Ambil kategori (data master, sama untuk semua user)
    const { data: categoryRows, error: catErr } = await supabase
      .from("categories")
      .select("*");

    if (catErr) throw catErr;
    const categories = categoryRows ?? [];

    const expenses = scoped.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0) || 1;
    const expenseByCategory: CategorySpend[] = categories
      .filter((c: any) => c.type === "expense")
      .map((c: any) => {
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
      .filter((c: CategorySpend) => c.total > 0)
      .sort((a: CategorySpend, b: CategorySpend) => b.total - a.total);

    // Tren 6 bulan terakhir (ambil semua transaksi user, bukan cuma yang di-scope range)
    const { data: allTxRows, error: allTxErr } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

    if (allTxErr) throw allTxErr;
    const allTx: Transaction[] = (allTxRows ?? []).map(mapTransaction);

    const now = new Date();
    const incomeVsExpense = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const prefix = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`;
      const monthly = allTx.filter((t) => t.date.startsWith(prefix));
      const flow = cashFlowOf(monthly);
      return {
        label: monthLabel(d.getMonth() + 1, d.getFullYear()),
        income: flow.income,
        expense: flow.expense,
      };
    });

    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevPrefix = `${prev.getFullYear()}-${`${prev.getMonth() + 1}`.padStart(2, "0")}`;
    const previousNet = cashFlowOf(allTx.filter((t) => t.date.startsWith(prevPrefix))).net;

    // Budget bulan berjalan (sesuai range.from)
    const monthPrefix = range.from.slice(0, 7);
    const [yearStr, monthStr] = monthPrefix.split("-");

    const { data: budgetRows, error: budgetErr } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("year", Number(yearStr))
      .eq("month", Number(monthStr));

    if (budgetErr) throw budgetErr;

    const budgets: BudgetProgress[] = (budgetRows ?? []).map((b: any) => {
      const spent = allTx
        .filter(
          (t) => t.type === "expense" && t.categoryId === b.category_id && t.date.startsWith(monthPrefix),
        )
        .reduce((s, t) => s + t.amount, 0);
      const limit = Number(b.limit);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      return {
        id: b.id,
        categoryId: b.category_id,
        limit,
        month: b.month,
        year: b.year,
        categoryName: categories.find((c: any) => c.id === b.category_id)?.name ?? "Unknown",
        spent,
        remaining: limit - spent,
        percentage,
        status: budgetStatus(percentage),
      };
    });

    return {
      totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
      accounts,
      cashFlow,
      previousNet,
      expenseByCategory,
      incomeVsExpense,
      recentTransactions: [...scoped]
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
        .slice(0, 5),
      budgets,
      categories: categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        icon: c.icon,
        color: c.color,
      })) as Category[],
    };
  },
};