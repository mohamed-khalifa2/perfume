"use client";

import { toast } from "sonner";

import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/lib/ui-store";

export type ProductCardQuickAddProps = {
  productId: string;
  slug: string;
  productName: string;
  price: number;
  image: string;
  variantId?: string | null;
  sizeMl?: number | null;
  disabled?: boolean;
  className?: string;
};

export function ProductCardQuickAdd({
  productId,
  slug,
  productName,
  price,
  image,
  variantId,
  sizeMl,
  disabled = false,
  className,
}: ProductCardQuickAddProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);

  const handleAdd = () => {
    if (disabled) return;

    addItem({
      variantId: variantId ?? productId,
      productId,
      slug,
      name: productName,
      sizeMl: sizeMl ?? undefined,
      price,
      image,
    });

    toast.success("Added to bag", {
      description: sizeMl ? `${productName} — ${sizeMl} ml` : productName,
    });
    openCart();
  };

  return (
    <button
      type="button"
      aria-label={`Add ${productName} to bag`}
      onClick={handleAdd}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center bg-ink px-5 text-[11px] uppercase tracking-label text-cream transition-colors hover:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {disabled ? "Sold out" : "Add to bag"}
    </button>
  );
}
