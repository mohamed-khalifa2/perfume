import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { collectionImageUrl, STORY_IMAGE } from "@/lib/seed-images";
import { getSiteSettings } from "@/lib/site-data";

export const metadata = {
  title: "Our story",
  description:
    "Maison Noir is a study in restraint, small-batch perfumery composed in Cairo.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Composed slowly",
    body: "Each fragrance is built note by note over months, never rushed to fit a season. We release a composition only when it holds its character from first spray to final trace.",
  },
  {
    number: "02",
    title: "Materials with character",
    body: "Ouds, resins, florals and woods are chosen for depth rather than novelty. We work in small batches so every material keeps the nuance that makes it worth wearing.",
  },
  {
    number: "03",
    title: "Made to linger",
    body: "A scent should stay with you quietly, not announce you. Our compositions are designed for closeness, a trail noticed only by those who come near.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const storeName = settings.store_name || "Maison Noir";

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="relative aspect-16/9 min-h-[60vh] lg:aspect-[21/9]">
          <Image
            src={STORY_IMAGE}
            alt="The Maison Noir atelier"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        </div>

        <Container
          size="lg"
          className="absolute inset-0 flex items-end pb-16 lg:pb-24"
        >
          <FadeIn className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-label text-gold">
              Our story
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-cream lg:text-6xl">
              Fragrance, composed with restraint.
            </h1>
          </FadeIn>
        </Container>
      </section>

      <Container size="lg">
        <div className="grid gap-12 pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-24">
          <FadeIn className="lg:col-span-7">
            <div className="space-y-6 text-base leading-relaxed text-muted">
              <p>
                {storeName} began with a simple idea: a fragrance should feel
                considered, not crowded. We started in a small Cairo atelier,
                blending in quantities that let us pay attention to every
                material and every decision.
              </p>
              <p>
                Our compositions sit between light and shadow: resin against
                bloom, smoke against skin. Each one is allowed to develop at its
                own pace, then worn to be discovered slowly rather than
                announced all at once.
              </p>
              <p>
                We remain deliberately small. That means closer attention to
                what goes into each bottle, and a collection that grows only
                when there is something worth saying.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="relative aspect-4/5 w-full overflow-hidden bg-cream-deep">
              <Image
                src={collectionImageUrl("best-sellers")}
                alt="A Maison Noir composition"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        <section className="mt-24 border-t border-line pt-16">
          <SectionHeading
            label="The house"
            title="What we hold to"
            description="Three principles that guide every composition we release."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.number}
                className="border-t border-ink pt-6"
              >
                <p className="text-xs uppercase tracking-label text-gold">
                  {principle.number}
                </p>
                <h2 className="mt-4 font-display text-2xl text-ink">
                  {principle.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <FadeIn>
          <section className="mt-24 flex flex-col gap-8 border border-line px-8 py-12 md:flex-row md:items-center md:justify-between lg:px-12">
            <div>
              <p className="text-xs uppercase tracking-label text-gold">
                From the house
              </p>
              <p className="mt-3 font-display text-2xl text-ink">
                {settings.tagline || "Fragrance, composed."}
              </p>
              {settings.address ? (
                <p className="mt-2 text-sm text-muted">{settings.address}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className={cn(buttonVariants({ variant: "solid" }))}>
                Shop the collection
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
                Get in touch
              </Link>
            </div>
          </section>
        </FadeIn>
      </Container>
    </div>
  );
}
