import Image from "next/image";
import Link from "next/link";

import { ProductCardQuickAdd } from "@/components/product-card-quick-add";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/cn";

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
  priority?: boolean;
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
  priority = false,
}: ProductCardProps) {
  const sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw";

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative aspect-3/4 overflow-hidden bg-cream-deep">
        <Link
          href={`/shop/${slug}`}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink"
          aria-label={name}
        >
          <Image
            src={coverImage}
            alt={name}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(
              "object-cover transition-opacity duration-700 ease-out",
              galleryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]",
            )}
          />

          {galleryImage ? (
            <Image
              src={galleryImage}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {isNew ? (
          <Badge variant="gold" size="sm" className="absolute top-3 left-3 z-10">
            New
          </Badge>
        ) : null}

        <div className="absolute right-3 bottom-3 z-10 translate-y-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <ProductCardQuickAdd productId={id} productName={name} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
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

        <Price amount={price} compareAt={compareAtPrice} size="sm" prefix="from" />
      </div>
    </article>
  );
}
