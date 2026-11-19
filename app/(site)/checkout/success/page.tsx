import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Order confirmed",
  description: "Your Maison Noir order confirmation.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <Container size="sm">
      <div className="py-20 text-center sm:py-24">
        <p className="text-xs uppercase tracking-label text-gold-on-light">
          Order confirmed
        </p>
        <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Thank you
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">
          Your order has been received. We will contact you with delivery
          details shortly.
        </p>

        {order ? (
          <div className="mx-auto mt-8 max-w-sm border border-line px-6 py-5">
            <p className="text-[11px] uppercase tracking-label text-muted">
              Order number
            </p>
            <p className="mt-2 font-display text-xl text-ink">{order}</p>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/orders/track"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Track order
          </Link>
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "solid" }))}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
