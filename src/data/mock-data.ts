/**
 * Centralized mock dataset. This is the ONLY place mock data lives —
 * components always go through the service layer (src/services) so the
 * backend team can swap implementations without touching the UI.
 */
import type { Account, Budget, Category, Transaction } from "@/types/finance";
import { toISODate } from "@/utils/date";

export const mockAccounts: Account[] = [
  { id: "acc-cash", name: "Dompet Tunai", type: "cash", balance: 850_000, icon: "Wallet", color: "accent" },
  { id: "acc-bca", name: "BCA Tahapan", type: "bank", balance: 4_700_000, icon: "Landmark", color: "brand" },
  { id: "acc-gopay", name: "GoPay", type: "ewallet", balance: 520_000, icon: "Smartphone", color: "success" },
  { id: "acc-dana", name: "DANA", type: "ewallet", balance: 280_000, icon: "Smartphone", color: "warning" },
];

export const mockCategories: Category[] = [
  { id: "cat-food", name: "Food", type: "expense", icon: "UtensilsCrossed", color: "brand" },
  { id: "cat-transport", name: "Transport", type: "expense", icon: "Bus", color: "accent" },
  { id: "cat-rent", name: "Rent", type: "expense", icon: "House", color: "danger" },
  { id: "cat-bills", name: "Bills", type: "expense", icon: "ReceiptText", color: "success" },
  { id: "cat-entertainment", name: "Entertainment", type: "expense", icon: "Clapperboard", color: "warning" },
  { id: "cat-shopping", name: "Shopping", type: "expense", icon: "ShoppingBag", color: "ink" },
  { id: "cat-other", name: "Other", type: "expense", icon: "CircleEllipsis", color: "ink" },
  { id: "cat-salary", name: "Salary", type: "income", icon: "Briefcase", color: "success" },
  { id: "cat-freelance", name: "Freelance", type: "income", icon: "Laptop", color: "brand" },
  { id: "cat-bonus", name: "Bonus", type: "income", icon: "Gift", color: "accent" },
];

interface Seed {
  categoryId: string;
  notes: string[];
  min: number;
  max: number;
  weight: number;
}

const expenseSeeds: Seed[] = [
  { categoryId: "cat-food", notes: ["Warung Bako", "GoFood makan siang", "Kopi Tuku", "Belanja sayur", "Nasi padang"], min: 18_000, max: 165_000, weight: 34 },
  { categoryId: "cat-transport", notes: ["GoRide ke kantor", "KRL Commuter", "Bensin Pertamax", "Parkir mall", "Grab malam"], min: 12_000, max: 120_000, weight: 14 },
  { categoryId: "cat-bills", notes: ["Listrik PLN", "Internet IndiHome", "Spotify Premium", "Pulsa & data", "Air PDAM"], min: 45_000, max: 480_000, weight: 12 },
  { categoryId: "cat-entertainment", notes: ["Bioskop XXI", "Netflix", "Konser indie", "Board game cafe"], min: 55_000, max: 320_000, weight: 9 },
  { categoryId: "cat-shopping", notes: ["Tokopedia skincare", "Uniqlo kaos", "Shopee gadget", "Buku Gramedia"], min: 75_000, max: 850_000, weight: 15 },
  { categoryId: "cat-other", notes: ["Donasi", "Servis motor", "Kado ulang tahun", "Obat apotek"], min: 30_000, max: 400_000, weight: 8 },
];

const accountIds = mockAccounts.map((a) => a.id);

/** Deterministic PRNG so mock data is stable across renders and SSR. */
function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildTransactions(): Transaction[] {
  const rand = makeRandom(20240514);
  const list: Transaction[] = [];
  const today = new Date();
  let id = 0;

  // 8 months of history so filtering, pagination, trends and budgets are testable.
  for (let monthsBack = 7; monthsBack >= 0; monthsBack--) {
    const anchor = new Date(today.getFullYear(), today.getMonth() - monthsBack, 1);
    const daysInMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
    const lastDay = monthsBack === 0 ? today.getDate() : daysInMonth;

    // Salary on the 1st
    list.push({
      id: `trx-${++id}`,
      type: "income",
      amount: 7_500_000,
      categoryId: "cat-salary",
      accountId: "acc-bca",
      date: toISODate(new Date(anchor.getFullYear(), anchor.getMonth(), 1)),
      time: "09:00",
      note: "Salary — Studio Karya",
    });

    if (rand() > 0.45) {
      list.push({
        id: `trx-${++id}`,
        type: "income",
        amount: Math.round((900_000 + rand() * 2_600_000) / 50_000) * 50_000,
        categoryId: rand() > 0.5 ? "cat-freelance" : "cat-bonus",
        accountId: rand() > 0.5 ? "acc-bca" : "acc-gopay",
        date: toISODate(new Date(anchor.getFullYear(), anchor.getMonth(), Math.min(lastDay, 12))),
        time: "14:20",
        note: rand() > 0.5 ? "Project landing page" : "Bonus kuartal",
      });
    }

    // Rent on the 3rd
    list.push({
      id: `trx-${++id}`,
      type: "expense",
      amount: 2_200_000,
      categoryId: "cat-rent",
      accountId: "acc-bca",
      date: toISODate(new Date(anchor.getFullYear(), anchor.getMonth(), Math.min(3, lastDay))),
      time: "08:15",
      note: "Sewa kos bulanan",
    });

    const weighted = expenseSeeds.flatMap((s) => Array<Seed>(s.weight).fill(s));
    const count = 22 + Math.floor(rand() * 12);

    for (let i = 0; i < count; i++) {
      const seed: Seed =
        weighted[Math.floor(rand() * weighted.length)] ??
        expenseSeeds[0] ??
        { categoryId: "cat-food", notes: ["Expense"], min: 0, max: 0, weight: 1 };
      const selectedAccountId = accountIds[Math.floor(rand() * accountIds.length)] ?? accountIds[0]!;
      const day = 1 + Math.floor(rand() * lastDay);
      const hour = `${6 + Math.floor(rand() * 15)}`.padStart(2, "0");
      const minute = `${Math.floor(rand() * 12) * 5}`.padStart(2, "0");
      const note = seed.notes[Math.floor(rand() * seed.notes.length)] ?? "Expense";

      list.push({
        id: `trx-${++id}`,
        type: "expense",
        amount: Math.round((seed.min + rand() * (seed.max - seed.min)) / 1_000) * 1_000,
        categoryId: seed.categoryId,
        accountId: selectedAccountId,
        date: toISODate(new Date(anchor.getFullYear(), anchor.getMonth(), day)),
        time: `${hour}:${minute}`,
        note,
      });
    }
  }

  return list.sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
}

export const mockTransactions: Transaction[] = buildTransactions();

const now = new Date();

export const mockBudgets: Budget[] = [
  { id: "bdg-food", categoryId: "cat-food", limit: 4_000_000, month: now.getMonth() + 1, year: now.getFullYear() },
  { id: "bdg-transport", categoryId: "cat-transport", limit: 1_200_000, month: now.getMonth() + 1, year: now.getFullYear() },
  { id: "bdg-shopping", categoryId: "cat-shopping", limit: 2_000_000, month: now.getMonth() + 1, year: now.getFullYear() },
  { id: "bdg-entertainment", categoryId: "cat-entertainment", limit: 900_000, month: now.getMonth() + 1, year: now.getFullYear() },
  { id: "bdg-bills", categoryId: "cat-bills", limit: 1_500_000, month: now.getMonth() + 1, year: now.getFullYear() },
];

export const mockProfile = {
  name: "Andi Pratama",
  email: "andi@pocketwise.id",
  initials: "AP",
  plan: "Personal",
};
