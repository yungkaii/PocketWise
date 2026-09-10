import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BalanceHero } from "@/features/dashboard/BalanceHero";
import { BudgetOverview } from "@/features/dashboard/BudgetOverview";
import { DashboardSkeleton } from "@/features/dashboard/DashboardSkeleton";
import { ExpenseDonutChart } from "@/components/charts/ExpenseDonutChart";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { PeriodFilter } from "@/features/dashboard/PeriodFilter";
import { RecentTransactions } from "@/features/dashboard/RecentTransactions";
import { dashboardService, type DashboardSummary } from "@/services/dashboardService";
import { rangeForPreset, type DateRange } from "@/utils/date";
import type { PeriodPreset } from "@/constants/finance";
import { store } from "@/services/mock-store";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const DEFAULT_RANGE: DateRange = rangeForPreset("month");

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dashboard · PocketWise" },
      { name: "description", content: "Overview of balances, cash flow, spending, and budgets." },
    ],
  }),
});

function Index() {
  const [preset, setPreset] = useState<PeriodPreset>("month");
  const [customRange, setCustomRange] = useState<DateRange>(DEFAULT_RANGE);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const range = preset === "custom" ? customRange : rangeForPreset(preset);
    setLoading(true);

    void dashboardService.getSummary(range).then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, [preset, customRange]);

  const currentRange = preset === "custom" ? customRange : rangeForPreset(preset);

  return (
    <DashboardLayout totalBalance={summary?.totalBalance ?? 0} onAdd={() => undefined}>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Overview</p>
            <h1 className="mt-1 font-display text-3xl font-bold">Dashboard</h1>
          </div>
          <PeriodFilter
            value={preset}
            onChange={setPreset}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>

        {loading || !summary ? (
          <DashboardSkeleton />
        ) : (
          <>
            <BalanceHero
              totalBalance={summary.totalBalance}
              accounts={summary.accounts}
              cashFlow={summary.cashFlow}
              previousNet={summary.previousNet}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <PaperPanel className="xl:col-span-1">
                <PanelHeading title="Expense mix" />
                <div className="mt-4">
                  <ExpenseDonutChart data={summary.expenseByCategory} />
                </div>
              </PaperPanel>

              <PaperPanel className="xl:col-span-2">
                <PanelHeading title="Income vs expense" />
                <div className="mt-4">
                  <IncomeExpenseChart data={summary.incomeVsExpense} />
                </div>
              </PaperPanel>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.2fr]">
              <PaperPanel>
                <PanelHeading title="Budget overview" />
                <BudgetOverview budgets={summary.budgets} />
              </PaperPanel>

              <PaperPanel>
                <PanelHeading
                  title="Recent transactions"
                  action={
                    <Link to="/transactions" className="text-sm font-semibold text-brand hover:underline">
                      View all
                    </Link>
                  }
                />
                <RecentTransactions
                  transactions={summary.recentTransactions}
                  categories={store.categories}
                  accounts={summary.accounts}
                />
              </PaperPanel>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
