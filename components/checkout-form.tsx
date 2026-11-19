"use client";

import { Check, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useActionState } from "react";

import { submitOrder, type CheckoutState } from "@/app/(site)/checkout/actions";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEgp } from "@/components/ui/price";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { selectSubtotal, useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

export type ShippingZoneOption = {
  governorate: string;
  fee: number;
};

type CheckoutFormProps = {
  zones: ShippingZoneOption[];
  freeShippingThreshold: number;
  paymobEnabled: boolean;
};

const INITIAL_STATE: CheckoutState = {
  status: "idle",
  message: "",
};

const PAYMOB_ORIGIN = "https://accept.paymobsolutions.com";

export function CheckoutForm({
  zones,
  freeShippingThreshold,
  paymobEnabled,
}: CheckoutFormProps) {
  const router = useRouter();
  const handledSuccess = useRef<string | null>(null);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [governorate, setGovernorate] = useState(
    zones[0]?.governorate ?? "Cairo",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "paymob">("cod");

  const zone = zones.find(
    (entry) => entry.governorate.toLowerCase() === governorate.toLowerCase(),
  );
  const shipping =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
      ? 0
      : (zone?.fee ?? 0);
  const total = subtotal + shipping;

  const checkoutItems = items.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));
  const submitAction = submitOrder.bind(null, checkoutItems);
  const [state, formAction, isPending] = useActionState(
    submitAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status !== "success" || !state.order) return;

    const key = state.order.order_number;
    if (handledSuccess.current === key) return;
    handledSuccess.current = key;

    if (!state.iframeUrl) {
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(key)}`);
    }
  }, [state, clearCart, router]);

  useEffect(() => {
    if (!state.iframeUrl || !state.order) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== PAYMOB_ORIGIN) return;

      let data: Record<string, unknown> = {};
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data) as Record<string, unknown>;
        } catch {
          return;
        }
      } else if (event.data && typeof event.data === "object") {
        data = event.data as Record<string, unknown>;
      }

      const success = data.success === true || data.success === "true";
      if (!success) return;

      clearCart();
      router.push(
        `/checkout/success?order=${encodeURIComponent(state.order!.order_number)}`,
      );
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [state.iframeUrl, state.order, clearCart, router]);

  if (items.length === 0 && !state.iframeUrl) {
    return (
      <div className="mx-auto max-w-2xl border border-line px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink">Your bag is empty</h2>
        <p className="mt-3 text-sm text-muted">
          Add a fragrance before continuing to checkout.
        </p>
        <Link
          href="/shop"
          className={cn(buttonVariants({ variant: "solid" }), "mt-8")}
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
      <form
        id="checkout-form"
        action={formAction}
        className="space-y-10 lg:col-span-2"
      >
        <section>
          <h2 className="text-xs uppercase tracking-label text-ink">Contact</h2>
          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <Input
              name="name"
              label="Full name"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Your name"
            />
            <Input
              name="email"
              label="Email address"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Input
              name="phone"
              label="Phone number"
              type="tel"
              required
              maxLength={20}
              autoComplete="tel"
              placeholder="+20 100 000 0000"
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-label text-ink">
            Shipping address
          </h2>
          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <Select
              name="governorate"
              label="Governorate"
              required
              value={governorate}
              onChange={(event) => setGovernorate(event.target.value)}
            >
              {zones.map((entry) => (
                <option key={entry.governorate} value={entry.governorate}>
                  {entry.governorate}
                </option>
              ))}
            </Select>
            <Input
              name="city"
              label="City or area"
              maxLength={120}
              autoComplete="address-level2"
              placeholder="Optional"
            />
            <Input
              name="address"
              label="Street address"
              required
              maxLength={300}
              autoComplete="street-address"
              placeholder="Street, building and floor"
              className="sm:col-span-2"
            />
            <Textarea
              name="notes"
              label="Delivery notes"
              rows={3}
              maxLength={1000}
              placeholder="Optional details for our delivery team"
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-label text-ink">Discount</h2>
          <div className="mt-5 border-t border-line pt-5">
            <Input
              name="coupon"
              label="Coupon code"
              maxLength={40}
              placeholder="Optional"
              hint="The code is validated when the order is placed."
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-label text-ink">Payment</h2>
          <div className="mt-5 space-y-3 border-t border-line pt-5">
            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-ink"
              />
              Cash on delivery
            </label>
            <label
              className={cn(
                "flex items-center gap-3 text-sm",
                paymobEnabled ? "text-ink" : "text-muted",
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="paymob"
                checked={paymentMethod === "paymob"}
                onChange={() => setPaymentMethod("paymob")}
                disabled={!paymobEnabled}
                className="accent-ink"
              />
              Card payment
            </label>
            {!paymobEnabled ? (
              <p className="text-xs text-muted">
                Card payment will be available once the Paymob credentials are
                configured.
              </p>
            ) : null}
          </div>
        </section>

        {state.status === "error" ? (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-gold-on-light"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {state.message}
          </p>
        ) : null}
      </form>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="border border-line px-5 py-6 sm:px-6">
          <p className="text-xs uppercase tracking-label text-ink">Your order</p>

          {items.length > 0 ? (
            <ul className="mt-6 space-y-4 border-b border-line pb-6">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  <div className="relative aspect-3/4 w-16 shrink-0 overflow-hidden bg-cream-deep">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm text-ink">
                      {item.name}
                    </p>
                    {item.sizeMl ? (
                      <p className="mt-1 text-[11px] uppercase tracking-label text-muted">
                        {item.sizeMl} ml
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">
                      Quantity {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs text-ink tabular-nums">
                    {formatEgp(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink tabular-nums">{formatEgp(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-ink tabular-nums">
                {shipping === 0 ? "Complimentary" : formatEgp(shipping)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3">
              <dt className="uppercase tracking-label text-ink">Total</dt>
              <dd className="font-display text-lg text-ink tabular-nums">
                {formatEgp(total)}
              </dd>
            </div>
          </dl>

          {state.status === "success" && state.iframeUrl ? (
            <div className="mt-8">
              <p className="flex items-start gap-2 text-sm text-ink">
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                {state.message}
              </p>
              <div className="mt-4 border border-line">
                <iframe
                  src={state.iframeUrl}
                  title="Card payment"
                  className="aspect-[4/3] w-full"
                  allow="payment"
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                Complete the payment in the secure panel above.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              form="checkout-form"
              disabled={isPending || items.length === 0}
              className={cn(
                buttonVariants({ variant: "solid", size: "lg" }),
                "mt-8 w-full",
              )}
            >
              {isPending
                ? "Placing order..."
                : paymentMethod === "paymob"
                  ? "Continue to payment"
                  : "Place order"}
            </button>
          )}

          <p className="mt-4 text-center text-[11px] uppercase tracking-label text-muted">
            Taxes included where applicable
          </p>
        </div>
      </aside>
    </div>
  );
}
