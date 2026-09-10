import { Eye, EyeOff, TrendingDown, TrendingUp } from "lucide-react";
import { Amount } from "@/components/common/Amount";
import { usePreferences } from "@/contexts/PreferencesContext";
import { ACCOUNT_TYPE_LABEL } from "@/constants/finance";
import type { Account, AccountType, CashFlow } from "@/types/finance";

interface BalanceHeroProps {
  totalBalance: number;
  accounts: Account[];
  cashFlow: CashFlow;
  previousNet: number;
}

/** Total balance + account summary + monthly cash flow, on the torn brand sheet. */
export function BalanceHero({ totalBalance, accounts, cashFlow, previousNet }: BalanceHeroProps) {
  const { balanceHidden, toggleBalance } = usePreferences();
  const delta = previousNet === 0 ? 0 : ((cashFlow.net - previousNet) / Math.abs(previousNet)) * 100;
  const Trend = delta >= 0 ? TrendingUp : TrendingDown;

  const byType = (["cash", "bank", "ewallet"] as AccountType[]).map((type) => {
    const total = accounts.filter((a) => a.type === type).reduce((s, a) => s + a.balance, 0);
    return {
      type,
      total,
      share: totalBalance > 0 ? (total / totalBalance) * 100 : 0,
    };
  });

  return (
    <section className="torn relative rounded-lg bg-brand p-6 pb-12 text-brand-foreground shadow-cut sm:p-8 sm:pb-14">
      <span className="tape" style={{ top: -11, right: 56, transform: "rotate(6deg)" }} />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-foreground/70">
            Total balance · {accounts.length} accounts
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Amount
              value={totalBalance}
              privacy
              className="font-display text-4xl font-bold tracking-tight sm:text-6xl"
            />
            <button
              onClick={toggleBalance}
              aria-label={balanceHidden ? "Show balance" : "Hide balance"}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-foreground/15 transition-colors hover:bg-brand-foreground/25"
            >
              {balanceHidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-foreground/80">
            <Trend className="size-4" />
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}% net cash flow vs last month
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-foreground/70">
            Cash flow this period
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-brand-foreground/90">
              Income{" "}
              <strong className="font-display text-lg">
                <Amount value={cashFlow.income} privacy />
              </strong>
            </span>
            <span className="text-brand-foreground/90">
              Expense{" "}
              <strong className="font-display text-lg">
                <Amount value={cashFlow.expense} privacy />
              </strong>
            </span>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-brand-foreground/20 px-3 py-1 text-xs font-semibold sm:ml-auto">
            Net <Amount value={cashFlow.net} signed privacy className="ml-1" />
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-brand-foreground/20 pt-5 sm:grid-cols-3">
        {byType.map((row) => (
          <div key={row.type}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-brand-foreground/70">
              {ACCOUNT_TYPE_LABEL[row.type]}
            </p>
            <Amount value={row.total} privacy className="font-display text-xl font-semibold" />
            <div className="mt-1 h-1.5 w-full rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.max(row.share, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
