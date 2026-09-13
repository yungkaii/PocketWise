import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { ExpenseDonutChart } from "@/components/charts/ExpenseDonutChart";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { Amount } from "@/components/common/Amount";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { referenceService } from "@/services/referenceService";
import { transactionService } from "@/services/transactionService";
import type { Account, Category, Transaction } from "@/types/finance";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics · PocketWise" },
      { name: "description", content: "Visualize spending trends and cash flow patterns." },
    ],
  }),
});

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      transactionService.getTransactions({ pageSize: 1000 }),
      referenceService.getCategories(),
      referenceService.getAccounts(),
    ])
      .then(([txResult, cats, accs]) => {
        setTransactions(txResult.items);
        setCategories(cats);
        setAccounts(accs);
      })
      .finally(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    const categoryExpense: Record<string, { categoryId: string; name: string; color: string; total: number }> = {};

    for (const tx of transactions) {
      const [year, month] = tx.date.split("-");
      const yearMonth = `${year}-${month}`;

      if (!monthly[yearMonth]) {
        monthly[yearMonth] = { income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        monthly[yearMonth].income += tx.amount;
      } else {
        monthly[yearMonth].expense += tx.amount;
        const category = categories.find((c) => c.id === tx.categoryId);
        if (category && !categoryExpense[category.id]) {
          categoryExpense[category.id] = {
            categoryId: category.id,
            name: category.name,
            color: category.color,
            total: 0,
          };
        }
        if (category) {
          const cat = categoryExpense[category.id];
          if (cat) {
            cat.total += tx.amount;
          }
        }
      }
    }

    const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

    const sortedMonthly = Object.entries(monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        label: new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: data.income,
        expense: data.expense,
      }));

    const sortedCategories = Object.values(categoryExpense)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((cat) => ({
        ...cat,
        percentage: totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0,
      }));

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      monthlyTrends: sortedMonthly,
      categoryBreakdown: sortedCategories,
    };
  }, [transactions, categories]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Income</p>
              <p className="mt-3 font-display text-2xl font-bold text-success">
                <Amount value={analytics.totalIncome} privacy />
              </p>
            </div>
          </PaperPanel>

          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Expense</p>
              <p className="mt-3 font-display text-2xl font-bold text-danger">
                <Amount value={analytics.totalExpense} privacy />
              </p>
            </div>
          </PaperPanel>

          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Net Balance</p>
              <p className={`mt-3 font-display text-2xl font-bold ${analytics.net >= 0 ? "text-success" : "text-danger"}`}>
                <Amount value={analytics.net} privacy />
              </p>
            </div>
          </PaperPanel>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Monthly Trends */}
          <PaperPanel>
            <PanelHeading title="Monthly Trends" />
            {loading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">Loading chart…</div>
            ) : (
              <div className="mt-6">
                <IncomeExpenseChart data={analytics.monthlyTrends} />
              </div>
            )}
          </PaperPanel>

          {/* Category Breakdown */}
          <PaperPanel>
            <PanelHeading title="Top Expense Categories" />
            {loading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">Loading chart…</div>
            ) : (
              <div className="mt-6">
                <ExpenseDonutChart data={analytics.categoryBreakdown} />
              </div>
            )}
          </PaperPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}