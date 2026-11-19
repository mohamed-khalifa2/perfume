import { CheckoutForm, type ShippingZoneOption } from "@/components/checkout-form";
import { Container } from "@/components/ui/container";
import { isPaymobConfigured } from "@/lib/paymob";
import { getSiteSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Checkout",
  description: "Complete your Maison Noir order.",
};

export default async function CheckoutPage() {
  const [settings, supabase] = await Promise.all([
    getSiteSettings(),
    createClient(),
  ]);

  const { data } = await supabase
    .from("shipping_zones")
    .select("governorate, fee, is_active")
    .eq("is_active", true)
    .order("governorate", { ascending: true });

  const zones: ShippingZoneOption[] = (data ?? []).map((zone) => ({
    governorate: zone.governorate,
    fee: Number(zone.fee),
  }));

  return (
    <Container size="lg">
      <div className="py-12 sm:py-16">
        <p className="text-xs uppercase tracking-label text-gold-on-light">Checkout</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Checkout
        </h1>

        <div className="mt-10 sm:mt-12">
          <CheckoutForm
            zones={zones}
            freeShippingThreshold={Number(settings.free_shipping_threshold ?? 0)}
            paymobEnabled={isPaymobConfigured()}
          />
        </div>
      </div>
    </Container>
  );
}
