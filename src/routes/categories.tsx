import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Amount } from "@/components/common/Amount";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { referenceService } from "@/services/referenceService";
import { transactionService } from "@/services/transactionService";
import type { Account, Category, Transaction } from "@/types/finance";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories · PocketWise" },
      { name: "description", content: "Review spending and income categories." },
    ],
  }),
});

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      referenceService.getCategories(),
      referenceService.getAccounts(),
      transactionService.getTransactions({ pageSize: 1000 }),
    ])
      .then(([cats, accs, txResult]) => {
        setCategories(cats);
        setAccounts(accs);
        setTransactions(txResult.items);
      })
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const data = {
      income: [] as Array<{ id: string; name: string; total: number; icon: string }>,
      expense: [] as Array<{ id: string; name: string; total: number; icon: string }>,
    };

    for (const category of categories) {
      const total = transactions
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      data[category.type].push({
        id: category.id,
        name: category.name,
        total,
        icon: category.icon,
      });
    }

    return {
      income: data.income.sort((a, b) => b.total - a.total),
      expense: data.expense.sort((a, b) => b.total - a.total),
    };
  }, [categories, transactions]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        <PaperPanel>
          <PanelHeading title="Categories" />
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Income categories</p>
              <p className="mt-2 font-display text-2xl font-bold">{totals.income.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expense categories</p>
              <p className="mt-2 font-display text-2xl font-bold">{totals.expense.length}</p>
            </div>
          </div>
        </PaperPanel>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PaperPanel>
            <PanelHeading title="Income" />
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading categories…</div>
            ) : (
              <div className="mt-4 space-y-3">
                {totals.income.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-success/15 text-success">
                        <DynamicIcon name={category.icon} className="size-4" />
                      </span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Amount value={category.total} privacy className="font-display font-bold" />
                  </div>
                ))}
              </div>
            )}
          </PaperPanel>

          <PaperPanel>
            <PanelHeading title="Expense" />
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading categories…</div>
            ) : (
              <div className="mt-4 space-y-3">
                {totals.expense.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-danger/15 text-danger">
                        <DynamicIcon name={category.icon} className="size-4" />
                      </span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Amount value={category.total} privacy className="font-display font-bold" />
                  </div>
                ))}
              </div>
            )}
          </PaperPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}