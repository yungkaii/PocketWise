import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { CurrencyInput } from "@/components/common/CurrencyInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { transactionService } from "@/services/transactionService";
import { referenceService } from "@/services/referenceService";
import type { Account, Category, TransactionType } from "@/types/finance";

export const Route = createFileRoute("/add")({
  component: AddTransactionPage,
  head: () => ({
    meta: [
      { title: "Add Transaction · PocketWise" },
      { name: "description", content: "Add a new income or expense transaction." },
    ],
  }),
});

function AddTransactionPage() {
  const navigate = useNavigate();
  const defaultDate = new Date().toISOString().split("T")[0] ?? new Date().toISOString().substring(0, 10);

  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("12:00");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const categories = allCategories.filter((c) => c.type === type);

  useEffect(() => {
    Promise.all([referenceService.getAccounts(), referenceService.getCategories()])
      .then(([accs, cats]) => {
        setAccounts(accs);
        setAllCategories(cats);
      })
      .catch((err) => setError(err.message ?? "Gagal memuat data."))
      .finally(() => setLoadingData(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    if (!accountId) {
      setError("Please select an account");
      return;
    }
    if (!amount) {
      setError("Please enter an amount");
      return;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await transactionService.createTransaction({
        type,
        categoryId,
        accountId,
        amount: Math.round(numAmount),
        date,
        time,
        note,
      });

      await navigate({ to: "/transactions" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction");
      setLoading(false);
    }
  };

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8 max-w-2xl">
        <PaperPanel>
          <PanelHeading title="Add Transaction" />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                {error}
              </div>
            )}

            {/* Type Selection */}
            <div>
              <Label className="text-sm font-medium">Transaction Type</Label>
              <div className="mt-2 flex gap-3">
                {(["income", "expense"] as const).map((txType) => (
                  <button
                    key={txType}
                    type="button"
                    onClick={() => {
                      setType(txType);
                      setCategoryId("");
                    }}
                    className={`flex-1 rounded-md border px-4 py-2 font-medium transition-colors ${
                      type === txType
                        ? txType === "income"
                          ? "border-success bg-success text-white"
                          : "border-danger bg-danger text-white"
                        : "border-border bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {txType === "income" ? "Income" : "Expense"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={loadingData}>
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon name={cat.icon} className="size-4" />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (Rp)
              </Label>
              <CurrencyInput
                value={amount}
                onChange={setAmount}
                placeholder="e.g., 1jt, 500rb, or 1000000"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Type "1jt" for 1 million, "500rb" for 500 thousand
              </p>
            </div>

            {/* Account */}
            <div>
              <Label htmlFor="account" className="text-sm font-medium">
                Account
              </Label>
              <Select value={accountId} onValueChange={setAccountId} disabled={loadingData}>
                <SelectTrigger id="account" className="mt-2">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select an account"} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon name={acc.icon} className="size-4" />
                        {acc.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time" className="text-sm font-medium">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Note */}
            <div>
              <Label htmlFor="note" className="text-sm font-medium">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/transactions" })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingData} className="flex-1">
                {loading ? "Saving..." : "Add Transaction"}
              </Button>
            </div>
          </form>
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
}