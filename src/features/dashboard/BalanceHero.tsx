import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Landmark, Smartphone, TrendingDown, TrendingUp, Wallet } from "lucide-react";
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

const ACCOUNT_TYPE_ICON: Record<AccountType, typeof Wallet> = {
  cash: Wallet,
  bank: Landmark,
  ewallet: Smartphone,
};

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
    <section className="torn relative overflow-hidden rounded-lg bg-brand p-4 pb-10 text-brand-foreground shadow-cut sm:p-8 sm:pb-14">
      <span className="tape" style={{ top: -11, right: 56, transform: "rotate(6deg)" }} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-foreground/70 sm:text-xs">
            Total balance · {accounts.length} accounts
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Amount
              value={totalBalance}
              privacy
              className="font-display text-[1.7rem] font-bold tracking-tight sm:text-6xl"
            />
            <button
              onClick={toggleBalance}
              aria-label={balanceHidden ? "Show balance" : "Hide balance"}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-foreground/15 transition-colors hover:bg-brand-foreground/25"
            >
              {balanceHidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-brand-foreground/80 sm:text-sm">
            <Trend className="size-4" />
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}% net cash flow vs last month
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-foreground/70 sm:text-xs">
            Cash flow this period
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] sm:gap-4 sm:text-sm">
            <span className="flex items-center gap-1 text-brand-foreground/90">
              <ArrowDownLeft className="size-3.5 text-emerald-300" />
              Income{" "}
              <strong className="font-display text-base sm:text-lg">
                <Amount value={cashFlow.income} privacy />
              </strong>
            </span>
            <span className="flex items-center gap-1 text-brand-foreground/90">
              <ArrowUpRight className="size-3.5 text-rose-300" />
              Expense{" "}
              <strong className="font-display text-base sm:text-lg">
                <Amount value={cashFlow.expense} privacy />
              </strong>
            </span>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-brand-foreground/20 px-2.5 py-1 text-[10px] font-semibold sm:ml-auto sm:px-3 sm:text-xs">
            Net <Amount value={cashFlow.net} signed privacy className="ml-1" />
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 border-t border-brand-foreground/20 pt-5 sm:grid-cols-3 sm:gap-4">
        {byType.map((row) => {
          const Icon = ACCOUNT_TYPE_ICON[row.type];
          return (
            <div key={row.type}>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-brand-foreground/70 sm:text-[11px]">
                <Icon className="size-3.5 shrink-0" />
                {ACCOUNT_TYPE_LABEL[row.type]}
              </p>
              <Amount value={row.total} privacy className="font-display text-base font-semibold sm:text-xl" />
              <div className="mt-1 h-1.5 w-full rounded-full bg-brand-foreground/20">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(row.share, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}