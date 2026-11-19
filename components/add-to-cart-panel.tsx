"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatEgp } from "@/components/ui/price";
import { useCartStore, MAX_QUANTITY } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import {
  allVariantsSoldOut,
  firstInStockVariant,
  type ProductVariantOption,
} from "@/lib/product-variants";
import { showToast } from "@/lib/toast";
import { useUiStore } from "@/lib/ui-store";

export type AddToCartPanelProps = {
  productId: string;
  productSlug: string;
  productName: string;
  brand: string | null;
  concentration: string;
  image: string | null;
  variants: ProductVariantOption[];
};

export function AddToCartPanel({
  productId,
  productSlug,
  productName,
  brand,
  concentration,
  image,
  variants,
}: AddToCartPanelProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);

  const [activeVariantId, setActiveVariantId] = useState(
    () => firstInStockVariant(variants)?.id ?? variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const variant =
    variants.find((v) => v.id === activeVariantId) ??
    firstInStockVariant(variants) ??
    variants[0];

  if (!variant) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">This fragrance is currently unavailable.</p>
      </div>
    );
  }

  const everyVariantSoldOut = allVariantsSoldOut(variants);
  const maxQty = Math.max(1, Math.min(variant.stock, MAX_QUANTITY));
  const lowStock = variant.stock > 0 && variant.stock <= 5;

  const handleAddToCart = () => {
    if (variant.stock <= 0) return;
    const qty = Math.min(quantity, maxQty);
    addItem({
      variantId: variant.id,
      productId,
      slug: productSlug,
      name: productName,
      sizeMl: variant.sizeMl,
      price: variant.price,
      image,
      quantity: qty,
    });
    showToast({
      title: "Added to bag",
      description: `${productName}, ${variant.sizeMl} ml`,
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (variant.stock <= 0) return;
    const qty = Math.min(quantity, maxQty);
    addItem({
      variantId: variant.id,
      productId,
      slug: productSlug,
      name: productName,
      sizeMl: variant.sizeMl,
      price: variant.price,
      image,
      quantity: qty,
    });
    openCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        {brand ? (
          <p className="text-[11px] uppercase tracking-label text-muted">{brand}</p>
        ) : null}

        <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          {productName}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <Badge variant="outline">{concentration}</Badge>
          <p className="text-sm text-ink">
            {formatEgp(variant.price)}
            {variant.compareAtPrice && variant.compareAtPrice > variant.price ? (
              <span className="ml-3 text-muted line-through">
                {formatEgp(variant.compareAtPrice)}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-label text-muted">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((v) => {
            const active = v.id === variant.id;
            const disabled = v.stock <= 0;
            return (
              <button
                key={v.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                aria-label={`${v.sizeMl} ml${disabled ? ", out of stock" : ""}`}
                title={disabled ? `${v.sizeMl} ml, out of stock` : undefined}
                onClick={() => {
                  setActiveVariantId(v.id);
                  setQuantity(1);
                }}
                className={cn(
                  "inline-flex h-10 items-center justify-center border px-4 text-[11px] uppercase tracking-label transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink",
                  active ? "border-ink bg-ink text-cream" : "border-line text-ink",
                  disabled &&
                    "cursor-not-allowed border-line text-muted line-through opacity-50 hover:border-line",
                )}
              >
                {v.sizeMl} ml
              </button>
            );
          })}
        </div>

        {everyVariantSoldOut ? (
          <p className="mt-3 text-xs text-gold-on-light">
            Out of stock. All sizes are currently unavailable.
          </p>
        ) : variant.stock <= 0 ? (
          <p className="mt-3 text-xs text-gold-on-light">
            This size is out of stock. Please choose another size.
          </p>
        ) : lowStock ? (
          <p className="mt-3 text-xs text-gold-on-light">
            Only {variant.stock} left in {variant.sizeMl} ml
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted">In stock. Ready to ship.</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-label text-muted">Quantity</p>
          <QuantityStepper
            value={quantity}
            onChange={(value) => setQuantity(Math.min(value, maxQty))}
            max={maxQty}
            size="sm"
            label={`quantity of ${productName}`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={handleAddToCart}
            disabled={variant.stock <= 0 || everyVariantSoldOut}
          >
            {everyVariantSoldOut ? "Out of stock" : "Add to cart"}
          </Button>
          <Button
            variant="outline"
            onClick={handleBuyNow}
            disabled={variant.stock <= 0 || everyVariantSoldOut}
          >
            Buy now
          </Button>
        </div>
      </div>

      <div className="grid gap-3 border-t border-line pt-6 text-sm text-muted">
        <p>Delivery across Egypt. Cash on delivery available.</p>
        <p>Free returns on unopened items within 14 days.</p>
      </div>
    </div>
  );
}
