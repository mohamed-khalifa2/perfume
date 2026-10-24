import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ProductGallery } from "@/components/product-gallery";
import { FadeIn } from "@/components/ui/fade-in";
import { createClient } from "@/lib/supabase/server";

const SEED_PRODUCT = {
  oud: {
    id: "oud-noir",
    name: "Oud Noir",
    slug: "oud-noir",
    brand: "Maison Noir",
    description:
      "A deep, resinous oud sharpened with saffron and rose, finished on warm sandalwood. Composed in Cairo in small batches, it settles into a quietly commanding trail.",
    gender: "men",
    concentration: "Parfum",
    scent_family: "Woody",
    top_notes: ["Saffron", "Bergamot", "Pink Pepper"],
    heart_notes: ["Rose", "Leather", "Dates"],
    base_notes: ["Oud", "Amber", "Sandalwood"],
    images: [
      "https://picsum.photos/seed/oud-noir-cover/900/1200",
      "https://picsum.photos/seed/oud-noir-gallery-1/900/1200",
      "https://picsum.photos/seed/oud-noir-gallery-2/900/1200",
      "https://picsum.photos/seed/oud-noir-gallery-3/900/1200",
    ],
    variants: [
      { id: "v-oud-30", sizeMl: 30, price: 1450, compareAtPrice: null, stock: 18 },
      { id: "v-oud-50", sizeMl: 50, price: 2150, compareAtPrice: 2450, stock: 12 },
      { id: "v-oud-100", sizeMl: 100, price: 3400, compareAtPrice: null, stock: 3 },
    ],
  },
  velours: {
    id: "velours-rouge",
    name: "Velours Rouge",
    slug: "velours-rouge",
    brand: "Maison Noir",
    description:
      "A red velvet floral, opening on ripe berries and settling into warm vanilla. Soft, luminous and unmistakably sensual.",
    gender: "women",
    concentration: "EDP",
    scent_family: "Oriental Floral",
    top_notes: ["Strawberry", "Lychee"],
    heart_notes: ["Peony", "Jasmine", "Rose"],
    base_notes: ["Vanilla", "Cashmeran", "White Musk"],
    images: [
      "https://picsum.photos/seed/velours-rouge-cover/900/1200",
      "https://picsum.photos/seed/velours-rouge-gallery-1/900/1200",
      "https://picsum.photos/seed/velours-rouge-gallery-2/900/1200",
      "https://picsum.photos/seed/velours-rouge-gallery-3/900/1200",
    ],
    variants: [
      { id: "v-vlr-30", sizeMl: 30, price: 1250, compareAtPrice: null, stock: 22 },
      { id: "v-vlr-50", sizeMl: 50, price: 1850, compareAtPrice: 2150, stock: 16 },
      { id: "v-vlr-100", sizeMl: 100, price: 2950, compareAtPrice: null, stock: 8 },
    ],
  },
};

const SEED_RELATED = [
  { id: "amber-empress", name: "Amber Empress", slug: "amber-empress", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/amber-empress-cover/900/1200", galleryImage: "https://picsum.photos/seed/amber-empress-gallery-1/900/1200", price: 2150, compareAtPrice: null, is_new: true },
  { id: "cairo-nights", name: "Cairo Nights", slug: "cairo-nights", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/cairo-nights-cover/900/1200", galleryImage: "https://picsum.photos/seed/cairo-nights-gallery-1/900/1200", price: 1850, compareAtPrice: null, is_new: true },
  { id: "myrrh-royale", name: "Myrrh Royale", slug: "myrrh-royale", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/myrrh-royale-cover/900/1200", galleryImage: "https://picsum.photos/seed/myrrh-royale-gallery-1/900/1200", price: 2150, compareAtPrice: null, is_new: true },
  { id: "desert-santal", name: "Desert Santal", slug: "desert-santal", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/desert-santal-cover/900/1200", galleryImage: "https://picsum.photos/seed/desert-santal-gallery-1/900/1200", price: 1850, compareAtPrice: null, is_new: false },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = slug === "velours-rouge" ? "Velours Rouge" : "Oud Noir";
  const brand = "Maison Noir";

  return {
    title: name,
    description: "A composition by Maison Noir, blended in Cairo.",
    openGraph: {
      title: `${name} — ${brand}`,
      description: "A composition by Maison Noir, blended in Cairo.",
    },
  };
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("slug").eq("is_visible", true);
    if (data && data.length > 0) {
      return data.map((p) => ({ slug: p.slug }));
    }
  } catch {}

  return [{ slug: "oud-noir" }, { slug: "velours-rouge" }];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = slug === "velours-rouge" ? SEED_PRODUCT.velours : slug === "oud-noir" ? SEED_PRODUCT.oud : null;

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.images,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EGP",
      lowPrice: Math.min(...product.variants.map((v) => v.price)),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="lg">
        <div className="pt-8 md:pt-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={product.images.map((url, index) => ({
                url,
                alt: `${product.name} — image ${index + 1}`,
              }))}
            />

            <div className="lg:sticky lg:top-32 lg:self-start">
              <AddToCartPanel
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                brand={product.brand}
                concentration={product.concentration}
                image={product.images[0]}
                variants={product.variants}
              />
            </div>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <FadeIn>
              <div>
                <p className="text-[11px] uppercase tracking-label text-gold">
                  Description
                </p>
                <p className="mt-6 text-base leading-relaxed text-ink">
                  {product.description}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="text-[11px] uppercase tracking-label text-gold">
                  Notes pyramid
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="w-full max-w-xs border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Top</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.top_notes.join(" · ")}
                    </p>
                  </div>
                  <div className="w-full max-w-sm border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Heart</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.heart_notes.join(" · ")}
                    </p>
                  </div>
                  <div className="w-full max-w-md border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Base</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.base_notes.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="mt-16">
              <p className="text-[11px] uppercase tracking-label text-gold">Details</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Concentration", value: product.concentration },
                  { label: "Scent family", value: product.scent_family },
                  { label: "Gender", value: product.gender.charAt(0).toUpperCase() + product.gender.slice(1) },
                  { label: "House", value: product.brand },
                ].map((item) => (
                  <div key={item.label} className="border border-line px-6 py-5">
                    <p className="text-[11px] uppercase tracking-label text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      <section className="mt-24">
        <Container size="lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-label text-gold">
                You may also like
              </p>
              <p className="mt-4 font-display text-3xl text-ink">
                From the same house
              </p>
            </div>
            <Link href="/shop" className="text-[11px] uppercase tracking-label text-muted transition-colors hover:text-ink">
              View all
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {SEED_RELATED.map((item, index) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                slug={item.slug}
                brand={item.brand}
                coverImage={item.cover_image_url}
                galleryImage={item.galleryImage}
                price={item.price}
                compareAtPrice={item.compareAtPrice}
                isNew={item.is_new}
                priority={index < 2}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
