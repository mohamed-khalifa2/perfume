import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  getFeaturedProducts,
  getHero,
  getNewArrivals,
  getSiteSettings,
  getVisibleCollections,
} from "@/lib/site-data";

const TRUST_ITEMS = [
  { icon: Truck, title: "Free shipping", description: "On qualifying orders" },
  { icon: Banknote, title: "Cash on delivery", description: "Across Egypt" },
  { icon: ShieldCheck, title: "Authentic products", description: "Composed in Cairo" },
  { icon: RefreshCcw, title: "Easy returns", description: "Simple & considered" },
];

function Banknote({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="0" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

export default async function HomePage() {
  const [settings, hero, collections, featured, newArrivals] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getVisibleCollections(),
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  const headline = hero?.headline ?? "Fragrance,\ncomposed.";
  const subheadline =
    hero?.subheadline ??
    "Small-batch eaux de parfum, blended in Cairo and shipped across Egypt.";
  const heroImage = hero?.image_url ?? "https://picsum.photos/seed/maison-noir-hero/1920/1080";
  const ctaLabel = hero?.cta_label ?? "Shop the collection";
  const ctaLink = hero?.cta_link ?? "/shop";

  const threshold = settings.free_shipping_threshold ?? 0;

  const brandStory =
    "Maison Noir is a study in restraint. Each composition is built slowly — an interplay of light and shadow, resin and bloom — distilled into something quietly enduring. Crafted in small batches, designed to linger.";

  const displayCollections =
    collections.length > 0
      ? collections
      : [
          { id: "men", name: "Men", slug: "men", description: "Oud, leather, tobacco and smoke.", image_url: "https://picsum.photos/seed/collection-men/1200/1500", sort_order: 1, is_visible: true },
          { id: "women", name: "Women", slug: "women", description: "Florals, resins and soft musks.", image_url: "https://picsum.photos/seed/collection-women/1200/1500", sort_order: 2, is_visible: true },
          { id: "unisex", name: "Unisex", slug: "unisex", description: "Shared signatures, made to be worn by anyone.", image_url: "https://picsum.photos/seed/collection-unisex/1200/1500", sort_order: 3, is_visible: true },
          { id: "best-sellers", name: "Best Sellers", slug: "best-sellers", description: "The house favourites, chosen by our clients.", image_url: "https://picsum.photos/seed/collection-best-sellers/1200/1500", sort_order: 4, is_visible: true },
        ];

  const displayFeatured =
    featured.length > 0
      ? featured
      : [
          { id: "oud-noir", name: "Oud Noir", slug: "oud-noir", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/oud-noir-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 1, price: 1450, compareAtPrice: 2450, galleryImage: "https://picsum.photos/seed/oud-noir-gallery-1/900/1200" },
          { id: "velours-rouge", name: "Velours Rouge", slug: "velours-rouge", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/velours-rouge-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 2, price: 1250, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/velours-rouge-gallery-1/900/1200" },
          { id: "amber-empress", name: "Amber Empress", slug: "amber-empress", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/amber-empress-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 3, price: 2150, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/amber-empress-gallery-1/900/1200" },
          { id: "cairo-nights", name: "Cairo Nights", slug: "cairo-nights", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/cairo-nights-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 4, price: 1850, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/cairo-nights-gallery-1/900/1200" },
          { id: "myrrh-royale", name: "Myrrh Royale", slug: "myrrh-royale", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/myrrh-royale-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 5, price: 2150, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/myrrh-royale-gallery-1/900/1200" },
          { id: "desert-santal", name: "Desert Santal", slug: "desert-santal", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/desert-santal-cover/900/1200", is_featured: true, is_new: false, is_visible: true, sort_order: 6, price: 1850, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/desert-santal-gallery-1/900/1200" },
          { id: "tobacco-noir", name: "Tobacco Noir", slug: "tobacco-noir", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/tobacco-noir-cover/900/1200", is_featured: true, is_new: false, is_visible: true, sort_order: 7, price: 2150, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/tobacco-noir-gallery-1/900/1200" },
          { id: "musk-imperial", name: "Musk Imperial", slug: "musk-imperial", brand: "Maison Noir", cover_image_url: "https://picsum.photos/seed/musk-imperial-cover/900/1200", is_featured: true, is_new: true, is_visible: true, sort_order: 8, price: 2150, compareAtPrice: null, galleryImage: "https://picsum.photos/seed/musk-imperial-gallery-1/900/1200" },
        ];

  const displayNewArrivals =
    newArrivals.length > 0
      ? newArrivals
      : displayFeatured.slice(0, 6);

  return (
    <div className="-mt-16 md:-mt-[calc(var(--spacing-header)+2.25rem)]">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={heroImage}
          alt={headline.replace("\n", " ")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

        <Container size="lg" className="relative pb-16 md:pb-24">
          <div className="max-w-3xl">
            <FadeIn distance={18}>
              <p className="text-[11px] uppercase tracking-label text-gold">
                {settings.store_name}
              </p>
            </FadeIn>

            <FadeIn delay={0.12} distance={24}>
              <h1 className="mt-6 whitespace-pre-line font-display text-5xl leading-[0.98] text-cream sm:text-6xl lg:text-8xl">
                {headline}
              </h1>
            </FadeIn>

            <FadeIn delay={0.24} distance={18}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/80">
                {subheadline}
              </p>
            </FadeIn>

            <FadeIn delay={0.36} distance={14}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href={ctaLink}
                  className={cn(buttonVariants({ variant: "solid" }))}
                >
                  {ctaLabel}
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-cream/40 text-cream hover:bg-cream hover:text-ink",
                  )}
                >
                  Our story
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50">
          <ArrowDown className="size-4 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 lg:py-28">
        <Container size="lg">
          <SectionHeading
            label="Collections"
            title="Compose your wardrobe of scent"
            description="Distinct signatures, designed to be worn alone or layered in the house."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {displayCollections.map((collection, index) => (
              <FadeIn
                key={collection.id}
                delay={index * 0.08}
                className={cn(
                  index === 0 || index === collections.length - 1
                    ? "md:col-span-2"
                    : "",
                )}
              >
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group relative block aspect-16/9 overflow-hidden"
                >
                  {collection.image_url ? (
                    <Image
                      src={collection.image_url}
                      alt={collection.name}
                      fill
                      sizes="(min-width: 1280px) 80vw, 100vw"
                      className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-cream-deep" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-8 lg:p-12">
                    <p className="text-[11px] uppercase tracking-label text-gold">
                      {collection.name}
                    </p>
                    <p className="mt-3 font-display text-3xl text-cream lg:text-4xl">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {displayFeatured.length > 0 ? (
        <section className="border-t border-line py-20 lg:py-28">
          <Container size="lg">
            <SectionHeading
              label="Featured"
              title="The house signatures"
              description="Eight compositions selected for their character and staying power."
            />

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {displayFeatured.map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.06}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    brand={product.brand}
                    coverImage={product.cover_image_url ?? "https://picsum.photos/seed/placeholder/900/1200"}
                    galleryImage={product.galleryImage}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    isNew={product.is_new}
                    priority={index < 2}
                  />
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.2}>
              <div className="mt-14 text-center">
                <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
                  View all fragrances
                </Link>
              </div>
            </FadeIn>
          </Container>
        </section>
      ) : null}

      {/* Brand story banner */}
      <section className="py-10 lg:py-16">
        <div className="relative overflow-hidden">
          <div className="relative aspect-16/9 min-h-[70vh] lg:aspect-[21/9]">
            <Image
              src="https://picsum.photos/seed/maison-noir-story/1920/1080"
              alt="Maison Noir atelier"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/60" />
          </div>

          <Container size="lg" className="absolute inset-0 flex items-center">
            <FadeIn className="max-w-xl">
              <p className="text-[11px] uppercase tracking-label text-gold">
                Our story
              </p>
              <p className="mt-6 font-display text-3xl leading-snug text-cream lg:text-4xl">
                {brandStory}
              </p>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-10 border-cream/40 text-cream hover:bg-cream hover:text-ink",
                )}
              >
                Read more
              </Link>
            </FadeIn>
          </Container>
        </div>
      </section>

      {/* New arrivals */}
      {displayNewArrivals.length > 0 ? (
        <section className="py-20 lg:py-28">
          <Container size="lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                label="New arrivals"
                title="Fresh from the house"
                description="Recent compositions, released in limited small batches."
              />
              <Link
                href="/shop"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Shop new arrivals
              </Link>
            </div>
          </Container>

          <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 lg:px-10">
            {displayNewArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[75vw] shrink-0 snap-start sm:w-[42vw] lg:w-[24vw]"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  brand={product.brand}
                  coverImage={product.cover_image_url ?? "https://picsum.photos/seed/placeholder/900/1200"}
                  galleryImage={product.galleryImage}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  isNew={product.is_new}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Scent notes explainer */}
      <section className="border-t border-line py-20 lg:py-28">
        <Container size="lg">
          <SectionHeading
            label="The composition"
            title="Top, heart, base"
            description="A classical structure, stripped to its essentials."
            align="center"
            className="mx-auto"
          />

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                label: "Top",
                title: "First impression",
                body: "Bright, volatile notes that open the fragrance with immediate character.",
              },
              {
                label: "Heart",
                title: "The soul",
                body: "The core of the composition — florals, spices or resins that give it identity.",
              },
              {
                label: "Base",
                title: "The trail",
                body: "Warm woods, amber and musk that settle in and linger for hours.",
              },
            ].map((note, index) => (
              <FadeIn key={note.label} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-label text-gold">
                    {note.label}
                  </p>
                  <p className="mt-4 font-display text-2xl text-ink">
                    {note.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {note.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-t border-line py-14">
        <Container size="lg">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map((item, index) => {
              const Icon = item.icon;

              return (
                <FadeIn key={item.title} delay={index * 0.08}>
                  <div className="flex items-start gap-4">
                    <Icon className="mt-0.5 size-5 text-gold" aria-hidden />
                    <div>
                      <p className="text-[11px] uppercase tracking-label text-ink">
                        {item.title}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {item.title === "Free shipping" && threshold > 0
                          ? `Complimentary shipping over ${threshold.toLocaleString("en-US")} EGP`
                          : item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Closing CTA banner */}
      <section className="py-16 lg:py-24">
        <Container size="lg">
          <div className="relative overflow-hidden bg-ink px-8 py-16 text-center lg:px-16 lg:py-24">
            <div className="relative">
              <p className="text-[11px] uppercase tracking-label text-gold">
                The collection
              </p>
              <h2 className="mt-6 font-display text-4xl text-cream lg:text-6xl">
                Find your signature
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base text-cream/70">
                Eight distinct signatures. Small batch. Bottled in Cairo.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/shop"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-cream/40 text-cream hover:bg-cream hover:text-ink",
                  )}
                >
                  Shop all
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
