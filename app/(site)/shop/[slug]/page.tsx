import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { productImageUrl } from "@/lib/seed-images";
import { SEED_PRODUCTS } from "@/lib/seed-catalog";
import {
  getFeaturedProducts,
  getProductDetail,
  getVisibleProductSlugs,
} from "@/lib/site-data";

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  coverImage: string;
  galleryImage?: string | null;
  price: number;
  compareAtPrice?: number | null;
  isNew: boolean;
  variants: {
    id: string;
    sizeMl: number;
    price: number;
    compareAtPrice: number | null;
    stock: number;
  }[];
};

async function getRelatedProducts(slug: string): Promise<RelatedProduct[]> {
  const featured = (await getFeaturedProducts())
    .filter((product) => product.slug !== slug)
    .slice(0, 4);

  if (featured.length > 0) {
    return featured.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand ?? "Maison Noir",
      coverImage: product.cover_image_url ?? productImageUrl(product.slug),
      galleryImage: product.galleryImage,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      isNew: product.is_new,
      variants: product.variants,
    }));
  }

  return SEED_PRODUCTS.filter((product) => product.slug !== slug)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      coverImage: product.images[0],
      galleryImage: product.images[1],
      price: product.variants[0]?.price ?? 0,
      compareAtPrice: product.variants[0]?.compareAtPrice ?? null,
      isNew: product.isNew,
      variants: product.variants,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  const name = product?.name ?? slug.replace(/-/g, " ");
  const brand = product?.brand ?? "Maison Noir";
  const description =
    product?.description || "A composition by Maison Noir, blended in Cairo.";

  return {
    title: name,
    description,
    openGraph: {
      title: `${name} | ${brand}`,
      description,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getVisibleProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(slug);

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
      lowPrice: product.variants.length
        ? Math.min(...product.variants.map((v) => v.price))
        : 0,
      highPrice: product.variants.length
        ? Math.max(...product.variants.map((v) => v.price))
        : 0,
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
            <div className="order-2 mx-auto w-full min-w-0 max-w-xl lg:sticky lg:top-32 lg:max-w-none lg:self-start">
              <AddToCartPanel
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                brand={product.brand}
                concentration={product.concentration}
                image={product.images[0] ?? null}
                variants={product.variants}
              />
            </div>

            <div className="order-1 mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
              <ProductGallery
                images={Array.from(new Set(product.images)).map((url, index) => ({
                  url,
                  alt: `${product.name}, image ${index + 1}`,
                }))}
              />
            </div>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <FadeIn>
              <div>
                <p className="text-[11px] uppercase tracking-label text-gold-on-light">
                  Description
                </p>
                <p className="mt-6 text-base leading-relaxed text-ink">
                  {product.description}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="text-[11px] uppercase tracking-label text-gold-on-light">
                  Notes pyramid
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="w-full max-w-xs border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Top</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.topNotes.join(" · ")}
                    </p>
                  </div>
                  <div className="w-full max-w-sm border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Heart</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.heartNotes.join(" · ")}
                    </p>
                  </div>
                  <div className="w-full max-w-md border border-line px-6 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-label text-muted">Base</p>
                    <p className="mt-2 text-sm text-ink">
                      {product.baseNotes.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="mt-16">
              <p className="text-[11px] uppercase tracking-label text-gold-on-light">Details</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Concentration", value: product.concentration },
                  { label: "Scent family", value: product.scentFamily },
                  {
                    label: "Gender",
                    value:
                      product.gender.charAt(0).toUpperCase() + product.gender.slice(1),
                  },
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

      {related.length > 0 ? (
        <section className="mt-24">
          <Container size="lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-label text-gold-on-light">
                  You may also like
                </p>
                <h2 className="mt-4 font-display text-3xl text-ink">
                  From the same house
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-[11px] uppercase tracking-label text-muted transition-colors hover:text-ink"
              >
                View all
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 scrollbar-hidden">
              {related.map((item, index) => (
                <div key={item.id} className="w-full max-w-xs sm:max-w-none">
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    slug={item.slug}
                    brand={item.brand}
                    coverImage={item.coverImage}
                    galleryImage={item.galleryImage}
                    price={item.price}
                    compareAtPrice={item.compareAtPrice}
                    isNew={item.isNew}
                    variants={item.variants}
                    eager={index < 2}
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
