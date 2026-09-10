/**
 * In-memory store standing in for the future backend.
 * Services are the only consumers; components never import this directly.
 */
import { mockAccounts, mockBudgets, mockCategories, mockTransactions } from "@/data/mock-data";
import type { Account, Budget, Category, Transaction } from "@/types/finance";

export const store = {
  accounts: [...mockAccounts] as Account[],
  categories: [...mockCategories] as Category[],
  transactions: [...mockTransactions] as Transaction[],
  budgets: [...mockBudgets] as Budget[],
};

/** Simulates network latency so loading/skeleton states are exercised. */
export function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
