import { Suspense } from "react";

import { ActiveFilterChips } from "@/components/active-filter-chips";
import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShopFilters } from "@/components/shop-filters";
import { ShopPagination } from "@/components/shop-pagination";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 12;

const SEED_PRODUCTS = [
  { id: "oud-noir", name: "Oud Noir", slug: "oud-noir", brand: "Maison Noir", gender: "men", concentration: "Parfum", scent_family: "Woody", price: 1450, compareAtPrice: 2450, cover_image_url: "https://picsum.photos/seed/oud-noir-cover/900/1200", galleryImage: "https://picsum.photos/seed/oud-noir-gallery-1/900/1200", is_new: true },
  { id: "velours-rouge", name: "Velours Rouge", slug: "velours-rouge", brand: "Maison Noir", gender: "women", concentration: "EDP", scent_family: "Oriental Floral", price: 1250, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/velours-rouge-cover/900/1200", galleryImage: "https://picsum.photos/seed/velours-rouge-gallery-1/900/1200", is_new: true },
  { id: "blanc-de-nuit", name: "Blanc de Nuit", slug: "blanc-de-nuit", brand: "Maison Noir", gender: "unisex", concentration: "EDT", scent_family: "Fresh Floral", price: 1150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/blanc-de-nuit-cover/900/1200", galleryImage: "https://picsum.photos/seed/blanc-de-nuit-gallery-1/900/1200", is_new: false },
  { id: "amber-empress", name: "Amber Empress", slug: "amber-empress", brand: "Maison Noir", gender: "women", concentration: "Parfum", scent_family: "Amber", price: 2150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/amber-empress-cover/900/1200", galleryImage: "https://picsum.photos/seed/amber-empress-gallery-1/900/1200", is_new: true },
  { id: "desert-santal", name: "Desert Santal", slug: "desert-santal", brand: "Maison Noir", gender: "unisex", concentration: "EDP", scent_family: "Woody", price: 1850, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/desert-santal-cover/900/1200", galleryImage: "https://picsum.photos/seed/desert-santal-gallery-1/900/1200", is_new: false },
  { id: "cairo-nights", name: "Cairo Nights", slug: "cairo-nights", brand: "Maison Noir", gender: "women", concentration: "EDP", scent_family: "Smoky Floral", price: 1850, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/cairo-nights-cover/900/1200", galleryImage: "https://picsum.photos/seed/cairo-nights-gallery-1/900/1200", is_new: true },
  { id: "tobacco-noir", name: "Tobacco Noir", slug: "tobacco-noir", brand: "Maison Noir", gender: "men", concentration: "Parfum", scent_family: "Amber Woody", price: 2150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/tobacco-noir-cover/900/1200", galleryImage: "https://picsum.photos/seed/tobacco-noir-gallery-1/900/1200", is_new: false },
  { id: "fig-and-cedar", name: "Fig & Cedar", slug: "fig-and-cedar", brand: "Maison Noir", gender: "men", concentration: "EDT", scent_family: "Green Woody", price: 1650, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/fig-and-cedar-cover/900/1200", galleryImage: "https://picsum.photos/seed/fig-and-cedar-gallery-1/900/1200", is_new: false },
  { id: "rose-ivoire", name: "Rose Ivoire", slug: "rose-ivoire", brand: "Maison Noir", gender: "women", concentration: "EDP", scent_family: "Floral", price: 1850, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/rose-ivoire-cover/900/1200", galleryImage: "https://picsum.photos/seed/rose-ivoire-gallery-1/900/1200", is_new: false },
  { id: "myrrh-royale", name: "Myrrh Royale", slug: "myrrh-royale", brand: "Maison Noir", gender: "unisex", concentration: "Parfum", scent_family: "Resin", price: 2150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/myrrh-royale-cover/900/1200", galleryImage: "https://picsum.photos/seed/myrrh-royale-gallery-1/900/1200", is_new: true },
  { id: "bergamot-silk", name: "Bergamot Silk", slug: "bergamot-silk", brand: "Maison Noir", gender: "unisex", concentration: "EDT", scent_family: "Citrus Floral", price: 1650, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/bergamot-silk-cover/900/1200", galleryImage: "https://picsum.photos/seed/bergamot-silk-gallery-1/900/1200", is_new: false },
  { id: "leather-and-oud", name: "Leather & Oud", slug: "leather-and-oud", brand: "Maison Noir", gender: "men", concentration: "Parfum", scent_family: "Leather", price: 2150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/leather-and-oud-cover/900/1200", galleryImage: "https://picsum.photos/seed/leather-and-oud-gallery-1/900/1200", is_new: false },
] as const;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const gender = Array.isArray(params.gender) ? params.gender : params.gender ? [params.gender] : [];
  const concentration = Array.isArray(params.concentration) ? params.concentration : params.concentration ? [params.concentration] : [];
  const scentFamily = Array.isArray(params.scent_family) ? params.scent_family : params.scent_family ? [params.scent_family] : [];
  const size = Array.isArray(params.size) ? params.size : params.size ? [params.size] : [];
  const collection = typeof params.collection === "string" ? params.collection : null;
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const inStock = params.in_stock === "1";
  const page = Math.max(1, Number(params.page) || 1);

  let products = SEED_PRODUCTS.slice();

  if (gender.length) products = products.filter((p) => (gender as string[]).includes(p.gender));
  if (concentration.length) products = products.filter((p) => (concentration as string[]).includes(p.concentration));
  if (scentFamily.length) products = products.filter((p) => (scentFamily as string[]).includes(p.scent_family));
  if (q) {
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }

  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "newest") products = [...products].sort((a, b) => Number(b.is_new) - Number(a.is_new));

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paged = products.slice(start, start + PAGE_SIZE);

  const scentFamilies = Array.from(new Set(SEED_PRODUCTS.map((p) => p.scent_family))).sort();

  const activeCount =
    gender.length +
    concentration.length +
    scentFamily.length +
    size.length +
    (collection ? 1 : 0) +
    (sort !== "featured" ? 1 : 0) +
    (q ? 1 : 0) +
    (inStock ? 1 : 0);

  let collections: { slug: string; name: string }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collections")
      .select("slug, name")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    collections = data ?? [];
  } catch {
    collections = [
      { slug: "men", name: "Men" },
      { slug: "women", name: "Women" },
      { slug: "unisex", name: "Unisex" },
      { slug: "best-sellers", name: "Best Sellers" },
    ];
  }

  return (
    <div className="pb-24">
      <Container size="lg">
        <div className="pt-10 md:pt-14">
          <SectionHeading
            label="Shop"
            title="All fragrances"
            description="Composed in small batches in Cairo. Each scent is built slowly, to linger."
          />
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <aside className="w-full lg:w-64 lg:shrink-0">
            <Suspense fallback={null}>
              <ShopFilters
                collections={collections}
                scentFamilies={scentFamilies}
                activeCount={activeCount}
              />
            </Suspense>
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] uppercase tracking-label text-muted">
                {total} result{total === 1 ? "" : "s"}
              </p>
              <Suspense fallback={null}>
                <ActiveFilterChips />
              </Suspense>
            </div>

            {paged.length === 0 ? (
              <div className="flex flex-col items-center gap-4 border border-line py-16 text-center">
                <p className="font-display text-xl text-ink">No fragrances found</p>
                <p className="text-sm text-muted">
                  Try adjusting your filters or clearing them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
                {paged.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    brand={product.brand}
                    coverImage={product.cover_image_url}
                    galleryImage={product.galleryImage}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    isNew={product.is_new}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}

            <Suspense fallback={null}>
              <ShopPagination page={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
