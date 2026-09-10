/** Transaction service — mock implementation with a query surface that mirrors REST. */
import { delay, makeId, store } from "./mock-store";
import type { Paginated, Transaction, TransactionQuery } from "@/types/finance";

export type TransactionInput = Omit<Transaction, "id">;

function categoryName(id: string) {
  return store.categories.find((c) => c.id === id)?.name ?? "";
}

function accountName(id: string) {
  return store.accounts.find((a) => a.id === id)?.name ?? "";
}

function applyQuery(list: Transaction[], query: TransactionQuery) {
  const {
    search = "",
    type = "all",
    categoryId = "all",
    accountId = "all",
    from,
    to,
    sortBy = "date",
    sortDir = "desc",
  } = query;

  const term = search.trim().toLowerCase();

  let result = list.filter((t) => {
    if (type !== "all" && t.type !== type) return false;
    if (categoryId !== "all" && t.categoryId !== categoryId) return false;
    if (accountId !== "all" && t.accountId !== accountId) return false;
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    if (term) {
      const haystack =
        `${t.note} ${categoryName(t.categoryId)} ${accountName(t.accountId)}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  result = result.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "amount") return (a.amount - b.amount) * dir;
    return `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`) * dir;
  });

  return result;
}

export const transactionService = {
  async getTransactions(query: TransactionQuery = {}): Promise<Paginated<Transaction>> {
    const filtered = applyQuery(store.transactions, query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    return delay({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  },

  /** Unpaginated read used by dashboard/analytics aggregation. */
  async getAllTransactions(query: TransactionQuery = {}): Promise<Transaction[]> {
    return delay(applyQuery(store.transactions, query));
  },

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return delay(store.transactions.find((t) => t.id === id));
  },

  async createTransaction(input: TransactionInput): Promise<Transaction> {
    const transaction: Transaction = { ...input, id: makeId("trx") };
    store.transactions = [transaction, ...store.transactions];
    return delay(transaction);
  },

  async updateTransaction(id: string, input: Partial<TransactionInput>): Promise<Transaction> {
    store.transactions = store.transactions.map((t) => (t.id === id ? { ...t, ...input } : t));
    return delay(store.transactions.find((t) => t.id === id)!);
  },

  async deleteTransaction(id: string): Promise<void> {
    store.transactions = store.transactions.filter((t) => t.id !== id);
    return delay(undefined);
  },
};
