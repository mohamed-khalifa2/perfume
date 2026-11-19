import { HeaderShell } from "@/components/header-shell";
import { MobileMenu } from "@/components/mobile-menu";
import { getSiteSettings, getVisibleCollections } from "@/lib/site-data";

export async function SiteHeader() {
  const [settings, collections] = await Promise.all([
    getSiteSettings(),
    getVisibleCollections(),
  ]);

  return (
    <HeaderShell settings={settings} collections={collections}>
      <MobileMenu settings={settings} collections={collections} />
    </HeaderShell>
  );
}
