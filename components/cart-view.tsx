"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatEgp } from "@/components/ui/price";
import {
  selectItemCount,
  selectSubtotal,
  useCartStore,
} from "@/lib/cart-store";
import { cn } from "@/lib/cn";

type CartViewProps = {
  freeShippingThreshold: number;
};

export function CartView({ freeShippingThreshold }: CartViewProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl border border-line px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink">Your bag is empty</h2>
        <p className="mt-3 text-sm text-muted">
          Discover a composition made to linger.
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
      <div className="lg:col-span-2">
        <p className="text-xs uppercase tracking-label text-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>

        <ul className="mt-5 border-t border-line">
          {items.map((item) => (
            <li
              key={item.variantId}
              className="flex gap-4 border-b border-line py-5 sm:gap-6"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-cream-deep sm:w-28"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 640px) 112px, 80px"
                    className="object-cover"
                  />
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-display text-base text-ink transition-opacity hover:opacity-70 sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    {item.sizeMl ? (
                      <p className="mt-1 text-[11px] uppercase tracking-label text-muted">
                        {item.sizeMl} ml
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    aria-label={`Remove ${item.name} from bag`}
                    className="text-muted transition-colors hover:text-ink"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(quantity) =>
                      updateQuantity(item.variantId, quantity)
                    }
                    size="sm"
                    label={`quantity of ${item.name}`}
                  />
                  <p className="text-sm text-ink tabular-nums">
                    {formatEgp(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/shop"
          className="mt-8 inline-block text-[11px] uppercase tracking-label text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
        >
          Continue shopping
        </Link>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="border border-line px-5 py-6 sm:px-6">
          <p className="text-xs uppercase tracking-label text-ink">Summary</p>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink tabular-nums">{formatEgp(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-ink">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3">
              <dt className="uppercase tracking-label text-ink">Total</dt>
              <dd className="font-display text-lg text-ink tabular-nums">
                {formatEgp(subtotal)}
              </dd>
            </div>
          </dl>

          {remaining > 0 ? (
            <p className="mt-5 text-xs text-muted">
              {formatEgp(remaining)} away from complimentary delivery.
            </p>
          ) : (
            <p className="mt-5 text-xs text-muted">
              Complimentary delivery unlocked.
            </p>
          )}

          <Link
            href="/checkout"
            className={cn(
              buttonVariants({ variant: "solid", size: "lg" }),
              "mt-6 w-full",
            )}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
