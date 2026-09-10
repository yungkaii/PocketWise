import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Amount } from "@/components/common/Amount";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { store } from "@/services/mock-store";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports · PocketWise" },
      { name: "description", content: "Review monthly reports and high-level performance." },
    ],
  }),
});

function ReportsPage() {
  const [loading] = useState(false);

  const monthlyReports = useMemo(() => {
    const reports: Array<{
      month: string;
      monthName: string;
      income: number;
      expense: number;
      net: number;
      savingsRate: number;
    }> = [];

    const monthMap: Record<
      string,
      { income: number; expense: number; transactionCount: number }
    > = {};

    // Group transactions by month
    for (const tx of store.transactions) {
      const [year, month] = tx.date.split("-");
      const yearMonth = `${year}-${month}`;

      if (!monthMap[yearMonth]) {
        monthMap[yearMonth] = { income: 0, expense: 0, transactionCount: 0 };
      }

      if (tx.type === "income") {
        monthMap[yearMonth].income += tx.amount;
      } else {
        monthMap[yearMonth].expense += tx.amount;
      }
      monthMap[yearMonth].transactionCount += 1;
    }

    // Convert to report format
    Object.entries(monthMap)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([yearMonth, data]) => {
        const net = data.income - data.expense;
        const savingsRate = data.income > 0 ? (net / data.income) * 100 : 0;

        reports.push({
          month: yearMonth,
          monthName: new Date(`${yearMonth}-01`).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          income: data.income,
          expense: data.expense,
          net,
          savingsRate,
        });
      });

    return reports;
  }, []);

  const totalBalance = store.accounts.reduce((sum, account) => sum + account.balance, 0);

  const averageIncome = monthlyReports.length > 0 ? monthlyReports.reduce((sum, r) => sum + r.income, 0) / monthlyReports.length : 0;
  const averageExpense = monthlyReports.length > 0 ? monthlyReports.reduce((sum, r) => sum + r.expense, 0) / monthlyReports.length : 0;
  const averageSavings = monthlyReports.length > 0 ? monthlyReports.reduce((sum, r) => sum + r.net, 0) / monthlyReports.length : 0;

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Avg. Monthly Income</p>
              <p className="mt-3 font-display text-2xl font-bold text-success">
                <Amount value={averageIncome} privacy />
              </p>
            </div>
          </PaperPanel>

          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Avg. Monthly Expense</p>
              <p className="mt-3 font-display text-2xl font-bold text-danger">
                <Amount value={averageExpense} privacy />
              </p>
            </div>
          </PaperPanel>

          <PaperPanel>
            <div className="flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Avg. Monthly Savings</p>
              <p className={`mt-3 font-display text-2xl font-bold ${averageSavings >= 0 ? "text-success" : "text-danger"}`}>
                <Amount value={averageSavings} privacy />
              </p>
            </div>
          </PaperPanel>
        </div>

        {/* Monthly Reports Table */}
        <PaperPanel>
          <PanelHeading title="Monthly Reports" />
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading reports…</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left font-medium text-muted-foreground">Month</th>
                    <th className="py-3 text-right font-medium text-muted-foreground">Income</th>
                    <th className="py-3 text-right font-medium text-muted-foreground">Expense</th>
                    <th className="py-3 text-right font-medium text-muted-foreground">Net</th>
                    <th className="py-3 text-right font-medium text-muted-foreground">Savings Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monthlyReports.map((report) => (
                    <tr key={report.month} className="hover:bg-secondary/50">
                      <td className="py-3 font-medium">{report.monthName}</td>
                      <td className="py-3 text-right text-success">
                        <Amount value={report.income} privacy />
                      </td>
                      <td className="py-3 text-right text-danger">
                        <Amount value={report.expense} privacy />
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          report.net >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        <Amount value={report.net} privacy />
                      </td>
                      <td className="py-3 text-right">
                        <span className={report.savingsRate >= 0 ? "text-success" : "text-danger"}>
                          {report.savingsRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
}
