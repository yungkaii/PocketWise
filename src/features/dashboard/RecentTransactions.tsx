import { Link } from "@tanstack/react-router";
import { Amount } from "@/components/common/Amount";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/utils/format";
import type { Account, Category, Transaction } from "@/types/finance";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

/** Recent transactions list — the ledger rows of the dashboard. */
export function RecentTransactions({
  transactions,
  categories,
  accounts,
}: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="ReceiptText"
        title="No transactions yet"
        description="Your latest income and expenses will show up here."
      />
    );
  }

  return (
    <ul className="mt-3 divide-y divide-border">
      {transactions.map((trx) => {
        const category = categories.find((c) => c.id === trx.categoryId);
        const account = accounts.find((a) => a.id === trx.accountId);
        const isIncome = trx.type === "income";

        return (
          <li key={trx.id} className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-secondary sm:px-5">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-md",
                isIncome ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
              )}
            >
              <DynamicIcon name={category?.icon ?? "Circle"} className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{trx.note}</p>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {category?.name} · {account?.name} · {formatDate(trx.date, { year: undefined })}
              </p>
            </div>
            <Amount
              value={isIncome ? trx.amount : -trx.amount}
              signed
              privacy
              className={cn(
                "shrink-0 font-display text-xs font-bold sm:text-sm",
                isIncome ? "text-success" : "text-danger",
              )}
            />
          </li>
        );
      })}
      <li className="px-5 py-3">
        <Link to="/transactions" className="text-sm font-semibold text-brand hover:underline">
          View all transactions →
        </Link>
      </li>
    </ul>
  );
}
