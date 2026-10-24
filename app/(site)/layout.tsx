import { AppToaster } from "@/components/app-toaster";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16 md:pt-[calc(var(--spacing-header)+2.25rem)]">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer freeShippingThreshold={settings.free_shipping_threshold ?? 0} />
      <SearchOverlay />
      <AppToaster />
    </div>
  );
}
