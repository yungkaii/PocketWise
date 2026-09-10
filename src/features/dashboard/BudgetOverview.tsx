import { BUDGET_STATUS_LABEL } from "@/constants/finance";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCompactCurrency } from "@/utils/format";
import type { BudgetProgress, BudgetStatus } from "@/types/finance";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<BudgetStatus, { bar: string; text: string }> = {
  healthy: { bar: "bg-success", text: "text-success" },
  warning: { bar: "bg-warning", text: "text-warning" },
  exceeded: { bar: "bg-danger", text: "text-danger" },
};

/** Budget progress list with healthy / warning / exceeded states. */
export function BudgetOverview({ budgets }: { budgets: BudgetProgress[] }) {
  if (budgets.length === 0) {
    return (
      <EmptyState
        icon="Target"
        title="No budgets yet"
        description="Set a monthly limit per category to keep spending in check."
      />
    );
  }

  return (
    <ul className="mt-4 space-y-4">
      {budgets.map((budget) => {
        const style = STATUS_STYLE[budget.status];
        return (
          <li key={budget.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">{budget.categoryName}</span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatCompactCurrency(budget.spent)} / {formatCompactCurrency(budget.limit)}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-paper-3">
              <div
                className={cn("h-full rounded-full transition-all", style.bar)}
                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
              />
            </div>
            <span
              className={cn(
                "mt-1 inline-block text-[10px] font-semibold uppercase tracking-[0.12em]",
                style.text,
              )}
            >
              {BUDGET_STATUS_LABEL[budget.status]} · {budget.percentage.toFixed(0)}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
