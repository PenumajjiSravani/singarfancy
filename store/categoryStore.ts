import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const defaultCategories: Category[] = [
  { id: "1", name: "Fine Jewelry", description: "Breathtaking necklaces, rings, and diamonds." },
  { id: "2", name: "Premium Cosmetics", description: "All-organic ingredients, glowing oils and highlights." },
  { id: "3", name: "Designer Accessories", description: "Signature watches, scarves, and editorial handbags." },
  { id: "4", name: "Exclusive Gifting", description: "Premium curations for your special celebrations." },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      addCategory: (category) => {
        set((state) => ({ categories: [...state.categories, category] }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },
    }),
    {
      name: "singar-categories",
    }
  )
);
