import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Amount } from "@/components/common/Amount";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { BUDGET_STATUS_LABEL } from "@/constants/finance";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { budgetService } from "@/services/budgetService";
import { referenceService } from "@/services/referenceService";
import type { Account, BudgetProgress } from "@/types/finance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budgets")({
  component: BudgetsPage,
  head: () => ({
    meta: [
      { title: "Budgets · PocketWise" },
      { name: "description", content: "Monitor category limits and monthly budget health." },
    ],
  }),
});

function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetProgress[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      budgetService.getBudgets(new Date().getMonth() + 1, new Date().getFullYear()),
      referenceService.getAccounts(),
    ])
      .then(([budgetData, accs]) => {
        setBudgets(budgetData);
        setAccounts(accs);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const totalLimit = budgets.reduce((sum, item) => sum + item.limit, 0);
    const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0);
    const totalRemaining = budgets.reduce((sum, item) => sum + item.remaining, 0);

    return { totalLimit, totalSpent, totalRemaining };
  }, [budgets]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        <PaperPanel>
          <PanelHeading title="Budgets" />
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total limit</p>
              <Amount value={summary.totalLimit} privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Spent</p>
              <Amount value={summary.totalSpent} privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Remaining</p>
              <Amount value={summary.totalRemaining} privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
          </div>
        </PaperPanel>

        <PaperPanel>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading budgets…</div>
          ) : budgets.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Belum ada anggaran untuk bulan ini.</div>
          ) : (
            <div className="space-y-5">
              {budgets.map((budget) => {
                const statusStyle =
                  budget.status === "exceeded"
                    ? "bg-danger text-danger"
                    : budget.status === "warning"
                      ? "bg-warning text-warning"
                      : "bg-success text-success";

                return (
                  <div key={budget.id} className="rounded-lg border border-border bg-secondary/40 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-display text-lg font-bold">{budget.categoryName}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {budget.month}/{budget.year}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground">
                          <Amount value={budget.spent} privacy className="font-medium" /> / <Amount value={budget.limit} privacy className="font-medium" />
                        </p>
                        <span className={cn("inline-flex items-center rounded-full bg-transparent px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", statusStyle)}>
                          {BUDGET_STATUS_LABEL[budget.status]} · {Math.round(budget.percentage)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-paper-3">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          budget.status === "exceeded"
                            ? "bg-danger"
                            : budget.status === "warning"
                              ? "bg-warning"
                              : "bg-success",
                        )}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Remaining</span>
                      <Amount value={budget.remaining} privacy className="font-medium text-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
} 