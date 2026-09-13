/** Fetches reference data (accounts, categories) used when creating a transaction. */
import { supabase } from "@/lib/supabase";
import type { Account, Category } from "@/types/finance";

function mapAccount(row: any): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: Number(row.balance),
    icon: row.icon ?? "wallet",
    color: row.color ?? "brand",
  };
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
  };
}

export const referenceService = {
  async getAccounts(): Promise<Account[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapAccount);
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapCategory);
  },
};