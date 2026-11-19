import Link from "next/link";

import { ProductCardMedia } from "@/components/product-card-media";
import { ProductCardQuickAdd } from "@/components/product-card-quick-add";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/cn";
import {
  allVariantsSoldOut,
  cheapestVariant,
  type ProductVariantOption,
} from "@/lib/product-variants";

export type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  coverImage: string;
  galleryImage?: string | null;
  price: number;
  compareAtPrice?: number | null;
  isNew?: boolean;
  className?: string;
  eager?: boolean;
  sizes?: string;
  variants?: ProductVariantOption[];
};

export function ProductCard({
  id,
  name,
  slug,
  brand,
  coverImage,
  galleryImage,
  price,
  compareAtPrice,
  isNew = false,
  className,
  eager = false,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw",
  variants = [],
}: ProductCardProps) {

  // Cards always advertise and add the cheapest variant that is in stock.
  const addVariant = cheapestVariant(variants, true);
  const displayVariant = addVariant ?? cheapestVariant(variants, false);
  const displayPrice = displayVariant?.price ?? price;
  const displayCompareAt = displayVariant?.compareAtPrice ?? compareAtPrice;
  const soldOut = allVariantsSoldOut(variants);

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="order-2 mt-4 flex flex-col gap-1.5">
        {brand ? (
          <p className="text-[11px] uppercase tracking-label text-muted">{brand}</p>
        ) : null}

        <h3 className="font-display text-lg leading-snug text-ink">
          <Link
            href={`/shop/${slug}`}
            className="transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink"
          >
            {name}
          </Link>
        </h3>

        <Price
          amount={displayPrice}
          compareAt={displayCompareAt}
          size="sm"
          prefix="from"
        />
      </div>

      <ProductCardMedia
        slug={slug}
        name={name}
        coverImage={coverImage}
        galleryImage={galleryImage}
        eager={eager}
        sizes={sizes}
      >
        {isNew ? (
          <Badge variant="gold" size="sm" className="absolute top-3 left-3 z-10">
            New
          </Badge>
        ) : null}

        <div className="absolute right-3 bottom-3 z-10 transition-all duration-500 ease-out md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100">
          <ProductCardQuickAdd
            productId={id}
            slug={slug}
            productName={name}
            price={displayPrice}
            image={coverImage}
            variantId={addVariant?.id}
            sizeMl={addVariant?.sizeMl}
            disabled={soldOut}
          />
        </div>
      </ProductCardMedia>
    </article>
  );
}
