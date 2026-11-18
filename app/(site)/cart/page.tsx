import { CartView } from "@/components/cart-view";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/site-data";

export const metadata = {
  title: "Your bag",
  description: "Review the fragrances in your Maison Noir bag.",
};

export default async function CartPage() {
  const settings = await getSiteSettings();

  return (
    <Container size="lg">
      <div className="py-12 sm:py-16">
        <p className="text-xs uppercase tracking-label text-gold">Bag</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Your bag
        </h1>

        <div className="mt-10 sm:mt-12">
          <CartView
            freeShippingThreshold={Number(
              settings.free_shipping_threshold ?? 0,
            )}
          />
        </div>
      </div>
    </Container>
  );
}
