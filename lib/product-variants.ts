import { getSeedProduct } from "@/lib/seed-catalog";

/** The variant data needed by both the detail panel and card quick-add. */
export type ProductVariantOption = {
  id: string;
  sizeMl: number;
  price: number;
  compareAtPrice: number | null;
  stock: number;
};

/** Variants for a seeded product, used whenever a DB product is unavailable. */
export function getSeedVariants(slug: string): ProductVariantOption[] {
  return getSeedProduct(slug)?.variants ?? [];
}

export function firstInStockVariant(
  variants: ProductVariantOption[],
): ProductVariantOption | undefined {
  return variants.find((variant) => variant.stock > 0);
}

export function allVariantsSoldOut(variants: ProductVariantOption[]): boolean {
  return variants.length > 0 && variants.every((variant) => variant.stock <= 0);
}

/**
 * The variant a card should advertise and add: the cheapest one currently in
 * stock. When everything is sold out, the cheapest variant is returned for
 * display only (the caller disables the button).
 */
export function cheapestVariant(
  variants: ProductVariantOption[],
  inStockOnly: boolean,
): ProductVariantOption | undefined {
  const candidates = inStockOnly
    ? variants.filter((variant) => variant.stock > 0)
    : variants;

  return candidates.reduce<ProductVariantOption | undefined>(
    (cheapest, variant) =>
      !cheapest || variant.price < cheapest.price ? variant : cheapest,
    undefined,
  );
}
