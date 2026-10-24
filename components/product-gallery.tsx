"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

export type GalleryImage = {
  url: string;
  alt: string;
};

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const next = (index + images.length) % images.length;
      setActive(next);
    },
    [images.length],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!lightboxOpen) {
        if (event.key === "ArrowLeft") goTo(active - 1);
        if (event.key === "ArrowRight") goTo(active + 1);
        return;
      }

      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") goTo(active - 1);
      if (event.key === "ArrowRight") goTo(active + 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, goTo, lightboxOpen]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return <div className="aspect-3/4 w-full bg-cream-deep" />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-3/4 w-full overflow-hidden bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink"
          aria-label="Open image lightbox"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active].url}
                alt={images[active].alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>
        </button>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink",
                index === active ? "border-ink" : "border-line",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 text-cream transition-opacity hover:opacity-70"
            >
              <X className="size-6" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cream transition-opacity hover:opacity-70 md:left-10"
            >
              <ChevronLeft className="size-8" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cream transition-opacity hover:opacity-70 md:right-10"
            >
              <ChevronRight className="size-8" aria-hidden />
            </button>

            <div className="relative h-[90vh] w-[90vw] max-w-4xl">
              <Image
                src={images[active].url}
                alt={images[active].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
