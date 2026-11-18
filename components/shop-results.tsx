"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ProductCard } from "@/components/product-card";
import { ShopPagination } from "@/components/shop-pagination";
import { ShopProductSkeleton } from "@/components/shop-results-skeleton";
import type { ProductVariantOption } from "@/lib/product-variants";

export type ShopResultProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  coverImage: string;
  galleryImage: string | null;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  variants: ProductVariantOption[];
};

type ShopResultsProps = {
  products: ShopResultProduct[];
  page: number;
  totalPages: number;
};

export function ShopResults({ products, page, totalPages }: ShopResultsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const navigate = (href: string) => {
    setPendingHref(href);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    startTransition(() => router.push(href, { scroll: false }));
  };

  return (
    <>
      {isPending ? (
        <ShopProductSkeleton count={products.length || 12} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-line py-16 text-center">
          <p className="font-display text-xl text-ink">No fragrances found</p>
          <p className="text-sm text-muted">
            Try adjusting your filters or clearing them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              brand={product.brand}
              coverImage={product.coverImage}
              galleryImage={product.galleryImage}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              isNew={product.isNew}
              variants={product.variants}
              eager={index < 4}
            />
          ))}
        </div>
      )}

      <ShopPagination
        page={page}
        totalPages={totalPages}
        onNavigate={navigate}
        pendingHref={isPending ? pendingHref : null}
      />
    </>
  );
}
