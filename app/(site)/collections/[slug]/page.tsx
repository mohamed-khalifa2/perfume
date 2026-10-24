import { notFound } from "next/navigation";
import Image from "next/image";

import { ProductCard } from "@/components/product-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { createClient } from "@/lib/supabase/server";

const SEED_PRODUCTS = [
  { id: "oud-noir", name: "Oud Noir", slug: "oud-noir", brand: "Maison Noir", price: 1450, compareAtPrice: 2450, cover_image_url: "https://picsum.photos/seed/oud-noir-cover/900/1200", galleryImage: "https://picsum.photos/seed/oud-noir-gallery-1/900/1200", is_new: true },
  { id: "velours-rouge", name: "Velours Rouge", slug: "velours-rouge", brand: "Maison Noir", price: 1250, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/velours-rouge-cover/900/1200", galleryImage: "https://picsum.photos/seed/velours-rouge-gallery-1/900/1200", is_new: true },
  { id: "blanc-de-nuit", name: "Blanc de Nuit", slug: "blanc-de-nuit", brand: "Maison Noir", price: 1150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/blanc-de-nuit-cover/900/1200", galleryImage: "https://picsum.photos/seed/blanc-de-nuit-gallery-1/900/1200", is_new: false },
  { id: "amber-empress", name: "Amber Empress", slug: "amber-empress", brand: "Maison Noir", price: 2150, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/amber-empress-cover/900/1200", galleryImage: "https://picsum.photos/seed/amber-empress-gallery-1/900/1200", is_new: true },
  { id: "desert-santal", name: "Desert Santal", slug: "desert-santal", brand: "Maison Noir", price: 1850, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/desert-santal-cover/900/1200", galleryImage: "https://picsum.photos/seed/desert-santal-gallery-1/900/1200", is_new: false },
  { id: "cairo-nights", name: "Cairo Nights", slug: "cairo-nights", brand: "Maison Noir", price: 1850, compareAtPrice: null, cover_image_url: "https://picsum.photos/seed/cairo-nights-cover/900/1200", galleryImage: "https://picsum.photos/seed/cairo-nights-gallery-1/900/1200", is_new: true },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data: collection } = await supabase
      .from("collections")
      .select("name, description")
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();

    if (!collection) {
      return { title: "Collection" };
    }

    return {
      title: collection.name,
      description: collection.description ?? undefined,
    };
  } catch {
    return { title: slug.replace(/-/g, " ") };
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collections")
      .select("slug")
      .eq("is_visible", true);

    return (data ?? []).map((collection) => ({ slug: collection.slug }));
  } catch {
    return [
      { slug: "men" },
      { slug: "women" },
      { slug: "unisex" },
      { slug: "best-sellers" },
    ];
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let collection: { name: string; description: string | null; image_url: string | null } | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collections")
      .select("name, description, image_url")
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();
    collection = data;
  } catch {
    collection = null;
  }

  if (!collection && !["men", "women", "unisex", "best-sellers"].includes(slug)) {
    notFound();
  }

  const displayCollection = collection ?? {
    name: slug === "best-sellers" ? "Best Sellers" : slug.charAt(0).toUpperCase() + slug.slice(1),
    description:
      slug === "men"
        ? "Compositions for him — oud, leather, tobacco and smoke."
        : slug === "women"
          ? "Florals, resins and soft musks."
          : slug === "unisex"
            ? "Shared signatures, made to be worn by anyone."
            : "The house favourites, chosen by our clients.",
    image_url: `https://picsum.photos/seed/collection-${slug}/1200/1500`,
  };

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/9] min-h-[60vh]">
          {displayCollection.image_url ? (
            <Image
              src={displayCollection.image_url}
              alt={displayCollection.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-cream-deep" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        </div>

        <Container size="lg" className="absolute inset-0 flex items-end pb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-label text-gold">Collection</p>
            <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl lg:text-6xl">
              {displayCollection.name}
            </h1>
            {displayCollection.description ? (
              <p className="mt-4 text-base text-cream/80">
                {displayCollection.description}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <Container size="lg" className="mt-16">
        <SectionHeading
          label="The edit"
          title="Curated for this collection"
        />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {SEED_PRODUCTS.slice(0, 6).map((product, index) => (
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
              priority={index < 2}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
