"use client";

import { cn } from "@/lib/cn";

export type ProductCardQuickAddProps = {
  productId: string;
  variantId?: string | null;
  productName: string;
  className?: string;
};

export function ProductCardQuickAdd({
  productId,
  variantId,
  productName,
  className,
}: ProductCardQuickAddProps) {
  return (
    <button
      type="button"
      aria-label={`Add ${productName} to bag`}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("maison-noir:quick-add", {
            detail: { productId, variantId: variantId ?? null, productName },
          }),
        );
      }}
      className={cn(
        "inline-flex h-10 items-center justify-center bg-ink px-5 text-[11px] uppercase tracking-label text-cream transition-colors hover:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink",
        className,
      )}
    >
      Add to bag
    </button>
  );
}
