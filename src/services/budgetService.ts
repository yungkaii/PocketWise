/** Budget service backed by Supabase. */
import { supabase } from "@/lib/supabase";
import type { BudgetProgress, BudgetStatus } from "@/types/finance";

export function budgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "exceeded";
  if (percentage >= 80) return "warning";
  return "healthy";
}

export const budgetService = {
  async getBudgets(month: number, year: number): Promise<BudgetProgress[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: budgetRows, error: budgetErr } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .eq("year", year);

    if (budgetErr) throw new Error(budgetErr.message);
    if (!budgetRows || budgetRows.length === 0) return [];

    const { data: categoryRows, error: catErr } = await supabase.from("categories").select("*");
    if (catErr) throw new Error(catErr.message);

    const monthPrefix = `${year}-${`${month}`.padStart(2, "0")}`;

    const { data: txRows, error: txErr } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .gte("transaction_date", `${monthPrefix}-01`)
      .lte("transaction_date", `${monthPrefix}-31`);

    if (txErr) throw new Error(txErr.message);

    return budgetRows.map((b: any) => {
      const spent = (txRows ?? [])
        .filter((t: any) => t.category_id === b.category_id)
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      const limit = Number(b.limit);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        id: b.id,
        categoryId: b.category_id,
        limit,
        month: b.month,
        year: b.year,
        categoryName: categoryRows?.find((c: any) => c.id === b.category_id)?.name ?? "Unknown",
        spent,
        remaining: limit - spent,
        percentage,
        status: budgetStatus(percentage),
      };
    });
  },

  async createBudget(input: { categoryId: string; limit: number; month: number; year: number }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Tidak ada user yang login.");

    const { data, error } = await supabase
      .from("budgets")
      .insert({
        user_id: user.id,
        category_id: input.categoryId,
        limit: input.limit,
        month: input.month,
        year: input.year,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateBudget(
    id: string,
    input: Partial<{ categoryId: string; limit: number; month: number; year: number }>,
  ) {
    const payload: Record<string, any> = {};
    if (input.categoryId !== undefined) payload.category_id = input.categoryId;
    if (input.limit !== undefined) payload.limit = input.limit;
    if (input.month !== undefined) payload.month = input.month;
    if (input.year !== undefined) payload.year = input.year;

    const { data, error } = await supabase
      .from("budgets")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};  