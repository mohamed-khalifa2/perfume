"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  sizeMl: number;
  price: number;
  image: string | null;
  quantity: number;
};

export type AddCartItem = Omit<CartItem, "quantity"> & { quantity?: number };

export const MAX_QUANTITY = 99;

export type CartStore = {
  items: CartItem[];
  addItem: (item: AddCartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const quantity = Math.min(item.quantity ?? 1, MAX_QUANTITY);
          const existing = state.items.find(
            (entry) => entry.variantId === item.variantId,
          );

          if (!existing) {
            return {
              items: [...state.items, { ...item, quantity }],
            };
          }

          return {
            items: state.items.map((entry) =>
              entry.variantId === item.variantId
                ? {
                    ...entry,
                    quantity: Math.min(entry.quantity + quantity, MAX_QUANTITY),
                  }
                : entry,
            ),
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((entry) => entry.variantId !== variantId)
              : state.items.map((entry) =>
                  entry.variantId === variantId
                    ? {
                        ...entry,
                        quantity: Math.min(Math.max(quantity, 1), MAX_QUANTITY),
                      }
                    : entry,
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "maison-noir-cart",
      skipHydration: true,
    },
  ),
);

export const selectItemCount = (state: CartStore) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
