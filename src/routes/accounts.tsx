import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Amount } from "@/components/common/Amount";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { ACCOUNT_TYPE_LABEL } from "@/constants/finance";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { accountService } from "@/services/accountService";
import { store } from "@/services/mock-store";
import type { Account } from "@/types/finance";

export const Route = createFileRoute("/accounts")({
  component: AccountsPage,
  head: () => ({
    meta: [
      { title: "Accounts · PocketWise" },
      { name: "description", content: "See balances, account types, and cash allocation." },
    ],
  }),
});

function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void accountService
      .getAccounts()
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const byType = {
      cash: 0,
      bank: 0,
      ewallet: 0,
    } as Record<Account["type"], number>;

    for (const account of accounts) {
      byType[account.type] += account.balance;
    }

    return byType;
  }, [accounts]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8">
        <PaperPanel>
          <PanelHeading title="Accounts" />
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {([
              ["cash", "Cash"],
              ["bank", "Bank"],
              ["ewallet", "E-Wallet"],
            ] as const).map(([type, label]) => (
              <div key={type} className="rounded-lg border border-border bg-secondary/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <Amount
                  value={totals[type]}
                  privacy
                  className="mt-2 block font-display text-2xl font-bold"
                />
              </div>
            ))}
          </div>
        </PaperPanel>

        <PaperPanel>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading accounts…</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {accounts.map((account) => (
                <div key={account.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-md bg-brand/10 text-brand">
                        <DynamicIcon name={account.icon} className="size-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold">{account.name}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {ACCOUNT_TYPE_LABEL[account.type]}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-border bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {account.type}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Balance</p>
                    <Amount value={account.balance} privacy className="mt-2 block font-display text-2xl font-bold" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
}
