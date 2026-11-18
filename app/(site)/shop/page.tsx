import { Suspense } from "react";

import { ActiveFilterChips } from "@/components/active-filter-chips";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShopFilters } from "@/components/shop-filters";
import { ShopResults } from "@/components/shop-results";
import { createClient } from "@/lib/supabase/server";
import { getShopProducts } from "@/lib/site-data";

const PAGE_SIZE = 12;

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
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const allProducts = await getShopProducts();
  let products = allProducts.slice();

  if (gender.length) products = products.filter((p) => (gender as string[]).includes(p.gender));
  if (concentration.length) products = products.filter((p) => (concentration as string[]).includes(p.concentration));
  if (scentFamily.length) {
    products = products.filter(
      (p) => p.scent_family !== null && (scentFamily as string[]).includes(p.scent_family),
    );
  }
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
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const paged = products.slice(start, start + PAGE_SIZE).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    coverImage: product.cover_image_url,
    galleryImage: product.galleryImage,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    isNew: product.is_new,
    variants: product.variants,
  }));

  const scentFamilies = Array.from(
    new Set(
      allProducts
        .map((p) => p.scent_family)
        .filter((family): family is string => Boolean(family)),
    ),
  ).sort();

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

            <Suspense fallback={null}>
              <ShopResults products={paged} page={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
