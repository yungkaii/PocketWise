/** Account service. Swap the mock-store body for HTTP calls when the API is ready. */
import { delay, makeId, store } from "./mock-store";
import type { Account } from "@/types/finance";

export type AccountInput = Omit<Account, "id">;

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    return delay([...store.accounts]);
  },

  async getAccount(id: string): Promise<Account | undefined> {
    return delay(store.accounts.find((a) => a.id === id));
  },

  async createAccount(input: AccountInput): Promise<Account> {
    const account: Account = { ...input, id: makeId("acc") };
    store.accounts = [...store.accounts, account];
    return delay(account);
  },

  async updateAccount(id: string, input: Partial<AccountInput>): Promise<Account> {
    store.accounts = store.accounts.map((a) => (a.id === id ? { ...a, ...input } : a));
    return delay(store.accounts.find((a) => a.id === id)!);
  },

  async deleteAccount(id: string): Promise<void> {
    store.accounts = store.accounts.filter((a) => a.id !== id);
    return delay(undefined);
  },
};
