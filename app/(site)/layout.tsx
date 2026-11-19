import { CartHydrator } from "@/components/cart-hydrator";
import { DeferredOverlays } from "@/components/deferred-overlays";
import { FadeInObserver } from "@/components/fade-in-observer";
import { ProductCardInteractions } from "@/components/product-card-interactions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <CartHydrator />
      <FadeInObserver />
      <ProductCardInteractions />
      <SiteHeader />
      <main className="flex-1 pt-[var(--spacing-header)] md:pt-[calc(var(--spacing-header)+1rem)]">
        {children}
      </main>
      <SiteFooter />
      <DeferredOverlays
        freeShippingThreshold={settings.free_shipping_threshold ?? 0}
      />
    </div>
  );
}
