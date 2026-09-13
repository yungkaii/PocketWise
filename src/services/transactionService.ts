/** Transaction service backed by Supabase. */
import { supabase } from "@/lib/supabase";
import type { Paginated, Transaction, TransactionQuery, TransactionType } from "@/types/finance";

export interface CreateTransactionInput {
  type: TransactionType;
  categoryId: string;
  accountId: string;
  amount: number;
  date: string;
  time: string;
  note: string;
}

function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    categoryId: row.category_id,
    accountId: row.account_id,
    date: row.transaction_date,
    time: row.time ?? "00:00",
    note: row.note ?? "",
  };
}

export const transactionService = {
  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Tidak ada user yang login.");

    // 1. Simpan transaksi baru
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: input.type,
        category_id: input.categoryId,
        account_id: input.accountId,
        amount: input.amount,
        transaction_date: input.date,
        time: input.time,
        note: input.note,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 2. Update saldo akun terkait (tambah kalau income, kurangi kalau expense)
    const { data: account, error: accErr } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", input.accountId)
      .single();

    if (accErr) throw new Error(accErr.message);

    const delta = input.type === "income" ? input.amount : -input.amount;
    const newBalance = Number(account.balance) + delta;

    const { error: updateErr } = await supabase
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", input.accountId);

    if (updateErr) throw new Error(updateErr.message);

    return mapTransaction(data);
  },

  async getTransactions(query: TransactionQuery = {}): Promise<Paginated<Transaction>> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { items: [], total: 0, page: query.page ?? 1, pageSize: query.pageSize ?? 30 };
    }

    let request = supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (query.type && query.type !== "all") {
      request = request.eq("type", query.type);
    }
    if (query.categoryId && query.categoryId !== "all") {
      request = request.eq("category_id", query.categoryId);
    }
    if (query.accountId && query.accountId !== "all") {
      request = request.eq("account_id", query.accountId);
    }
    if (query.from) {
      request = request.gte("transaction_date", query.from);
    }
    if (query.to) {
      request = request.lte("transaction_date", query.to);
    }

    const sortBy = query.sortBy === "amount" ? "amount" : "transaction_date";
    const ascending = query.sortDir === "asc";
    request = request.order(sortBy, { ascending });

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 30;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    request = request.range(from, to);

    const { data, error, count } = await request;
    if (error) throw new Error(error.message);

    return {
      items: (data ?? []).map(mapTransaction),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};