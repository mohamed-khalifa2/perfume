"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";
import { showToast } from "@/lib/toast";
import { useUiStore } from "@/lib/ui-store";

type AddToCartPayload = {
  productId: string;
  slug: string;
  productName: string;
  price: number;
  image: string;
  variantId?: string | null;
  sizeMl?: number | null;
};

function loadHoverImage(media: HTMLElement) {
  if (media.dataset.hoverLoaded === "true") return;

  const src = media.dataset.hoverSrc;
  if (!src) return;
  media.dataset.hoverLoaded = "true";

  const link = media.querySelector("a");
  if (!link) return;

  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.className =
    "product-card-hover absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out";

  image.addEventListener(
    "load",
    () => {
      media.dataset.hoverReady = "true";
    },
    { once: true },
  );
  image.addEventListener("error", () => image.remove(), { once: true });

  if (image.complete && image.naturalWidth > 0) {
    media.dataset.hoverReady = "true";
  }

  link.appendChild(image);
}

export function ProductCardInteractions() {
  useEffect(() => {
    const handleHover = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const media = target.closest<HTMLElement>(".product-card-media");
      if (media) loadHoverImage(media);
    };

    const handleAddToCart = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLButtonElement>("button[data-add-to-cart]");
      if (!button || button.disabled) return;

      let payload: AddToCartPayload;
      try {
        payload = JSON.parse(button.dataset.addToCart ?? "") as AddToCartPayload;
      } catch {
        return;
      }

      useCartStore.getState().addItem({
        variantId: payload.variantId ?? payload.productId,
        productId: payload.productId,
        slug: payload.slug,
        name: payload.productName,
        sizeMl: payload.sizeMl ?? undefined,
        price: payload.price,
        image: payload.image,
      });

      showToast({
        title: "Added to bag",
        description: payload.sizeMl
          ? `${payload.productName}, ${payload.sizeMl} ml`
          : payload.productName,
      });
      useUiStore.getState().openCart();
    };

    document.addEventListener("pointerover", handleHover, { passive: true });
    document.addEventListener("focusin", handleHover);
    document.addEventListener("click", handleAddToCart);

    return () => {
      document.removeEventListener("pointerover", handleHover);
      document.removeEventListener("focusin", handleHover);
      document.removeEventListener("click", handleAddToCart);
    };
  }, []);

  return null;
}
