import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Amount } from "@/components/common/Amount";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { store } from "@/services/mock-store";
import { transactionService } from "@/services/transactionService";
import type { Transaction } from "@/types/finance";
import { formatDate } from "@/utils/format";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
] as const;

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
  head: () => ({
    meta: [
      { title: "Transactions · PocketWise" },
      { name: "description", content: "Track every transaction, movement, and cash flow." },
    ],
  }),
});

function TransactionsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void transactionService
      .getTransactions({ type: filter, pageSize: 30 })
      .then((result) => {
        setTransactions(result.items);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return { income, expense, net: income - expense };
  }, [transactions]);

  const totalBalance = store.accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        <PaperPanel>
          <PanelHeading title="Transactions" />
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === item.id
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:bg-secondary",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Income</p>
              <Amount value={summary.income} privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expense</p>
              <Amount value={summary.expense} privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Net</p>
              <Amount value={summary.net} signed privacy className="mt-2 block font-display text-2xl font-bold" />
            </div>
          </div>
        </PaperPanel>

        <PaperPanel className="overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Tidak ada transaksi untuk filter ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 font-medium">Note</th>
                    <th className="px-3 py-3 font-medium">Account</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((item) => {
                    const category = store.categories.find((entry) => entry.id === item.categoryId);
                    const account = store.accounts.find((entry) => entry.id === item.accountId);
                    const isIncome = item.type === "income";

                    return (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={[
                                "grid size-9 place-items-center rounded-md",
                                isIncome ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
                              ].join(" ")}
                            >
                              <DynamicIcon name={category?.icon ?? "Circle"} className="size-4" />
                            </span>
                            <span className="font-medium">{category?.name ?? "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{item.note}</td>
                        <td className="px-3 py-3 text-muted-foreground">{account?.name ?? "Unknown"}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {formatDate(item.date, { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <Amount
                            value={isIncome ? item.amount : -item.amount}
                            signed
                            privacy
                            className={[
                              "font-display text-base font-bold",
                              isIncome ? "text-success" : "text-danger",
                            ].join(" ")}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
}
