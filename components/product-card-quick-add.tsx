import { cn } from "@/lib/cn";

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
  const payload = {
    productId,
    slug,
    productName,
    price,
    image,
    variantId: variantId ?? null,
    sizeMl: sizeMl ?? null,
  };

  return (
    <button
      type="button"
      data-add-to-cart={JSON.stringify(payload)}
      aria-label={`Add ${productName} to bag`}
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
