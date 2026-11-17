"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";

/** Restores the persisted cart on the client without causing SSR mismatches. */
export function CartHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
