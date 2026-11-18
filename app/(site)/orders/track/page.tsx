import { OrderTrackingForm } from "@/components/order-tracking-form";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Track your order",
  description: "Check the status of your Maison Noir order.",
};

export default function TrackOrderPage() {
  return (
    <Container size="sm">
      <div className="py-12 sm:py-16">
        <p className="text-xs uppercase tracking-label text-gold">Orders</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Track your order
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Enter the order number and email address from your confirmation.
        </p>

        <div className="mt-10 sm:mt-12">
          <OrderTrackingForm />
        </div>
      </div>
    </Container>
  );
}
