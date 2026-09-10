/** Category service — mock implementation, API-ready surface. */
import { delay, makeId, store } from "./mock-store";
import type { Category } from "@/types/finance";

export type CategoryInput = Omit<Category, "id">;

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return delay([...store.categories]);
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const category: Category = { ...input, id: makeId("cat") };
    store.categories = [...store.categories, category];
    return delay(category);
  },

  async updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category> {
    store.categories = store.categories.map((c) => (c.id === id ? { ...c, ...input } : c));
    return delay(store.categories.find((c) => c.id === id)!);
  },

  async deleteCategory(id: string): Promise<void> {
    store.categories = store.categories.filter((c) => c.id !== id);
    return delay(undefined);
  },
};
