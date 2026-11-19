"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";

import { useUiStore } from "@/lib/ui-store";

type CartDrawerComponent = ComponentType<{ freeShippingThreshold: number }>;
type SearchOverlayComponent = ComponentType;

let cartModulePromise:
  | Promise<typeof import("@/components/cart-drawer")>
  | undefined;
let searchModulePromise:
  | Promise<typeof import("@/components/search-overlay")>
  | undefined;

function loadCartModule() {
  cartModulePromise ??= import("@/components/cart-drawer");
  return cartModulePromise;
}

function loadSearchModule() {
  searchModulePromise ??= import("@/components/search-overlay");
  return searchModulePromise;
}

type DeferredOverlaysProps = {
  freeShippingThreshold: number;
};

export function DeferredOverlays({ freeShippingThreshold }: DeferredOverlaysProps) {
  const [CartDrawer, setCartDrawer] = useState<CartDrawerComponent | null>(null);
  const [SearchOverlay, setSearchOverlay] =
    useState<SearchOverlayComponent | null>(null);

  const openCartOverlay = useCallback(() => {
    void loadCartModule().then(({ CartDrawer }) => {
      setCartDrawer(() => CartDrawer);
    });
  }, []);

  const openSearchOverlay = useCallback(() => {
    void loadSearchModule().then(({ SearchOverlay }) => {
      setSearchOverlay(() => SearchOverlay);
    });
  }, []);

  useEffect(() => {
    if (useUiStore.getState().cartOpen) openCartOverlay();
    return useUiStore.subscribe((state) => {
      if (state.cartOpen) openCartOverlay();
    });
  }, [openCartOverlay]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        openSearchOverlay();
      }
    };

    window.addEventListener("maison-noir:open-search", openSearchOverlay);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("maison-noir:open-search", openSearchOverlay);
      window.removeEventListener("keydown", handleKey);
    };
  }, [openSearchOverlay]);

  return (
    <>
      {CartDrawer ? (
        <CartDrawer freeShippingThreshold={freeShippingThreshold} />
      ) : null}
      {SearchOverlay ? <SearchOverlay /> : null}
    </>
  );
}
