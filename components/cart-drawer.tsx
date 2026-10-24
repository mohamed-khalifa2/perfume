"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatEgp } from "@/components/ui/price";
import {
  selectItemCount,
  selectSubtotal,
  useCartStore,
} from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/lib/ui-store";

const PROGRESS_STEPS = {
  "0": "scale-x-0",
  "5": "scale-x-5",
  "10": "scale-x-10",
  "15": "scale-x-15",
  "20": "scale-x-20",
  "25": "scale-x-25",
  "30": "scale-x-30",
  "35": "scale-x-35",
  "40": "scale-x-40",
  "45": "scale-x-45",
  "50": "scale-x-50",
  "55": "scale-x-55",
  "60": "scale-x-60",
  "65": "scale-x-65",
  "70": "scale-x-70",
  "75": "scale-x-75",
  "80": "scale-x-80",
  "85": "scale-x-85",
  "90": "scale-x-90",
  "95": "scale-x-95",
  "100": "scale-x-100",
} as const;

type ProgressStep = keyof typeof PROGRESS_STEPS;

const progressVariants = cva(
  "h-full w-full origin-left bg-gold transition-transform duration-700 ease-out",
  {
    variants: {
      step: PROGRESS_STEPS,
    },
    defaultVariants: {
      step: "0",
    },
  },
);

export type CartDrawerProps = {
  freeShippingThreshold: number;
};

export function CartDrawer({ freeShippingThreshold }: CartDrawerProps) {
  const isOpen = useUiStore((state) => state.cartOpen);
  const closeCart = useUiStore((state) => state.closeCart);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const threshold = freeShippingThreshold > 0 ? freeShippingThreshold : 0;
  const ratio = threshold > 0 ? Math.min(1, subtotal / threshold) : 1;
  const step = `${Math.round(ratio * 20) * 5}` as ProgressStep;
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Close bag"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-ink/40"
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-cream"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
              <p className="text-[11px] uppercase tracking-label text-ink">
                Your bag
                {itemCount > 0 ? ` (${itemCount})` : ""}
              </p>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="-mr-2 p-2 text-ink transition-opacity hover:opacity-70"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {threshold > 0 ? (
              <div className="border-b border-line px-6 py-5">
                <p className="text-[11px] uppercase tracking-label text-muted">
                  {remaining > 0
                    ? `${formatEgp(remaining)} away from complimentary shipping`
                    : "Complimentary shipping unlocked"}
                </p>
                <div className="mt-3 h-1 w-full bg-cream-deep">
                  <div className={progressVariants({ step })} />
                </div>
              </div>
            ) : null}

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="font-display text-xl text-ink">Your bag is empty</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Discover the collection
                </Link>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6">
                {items.map((item) => (
                  <li
                    key={item.variantId}
                    className="flex gap-4 border-b border-line py-5"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-cream-deep"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={closeCart}
                            className="font-display text-base text-ink transition-opacity hover:opacity-70"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-[11px] uppercase tracking-label text-muted">
                            {item.sizeMl} ml
                          </p>
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

                      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
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
            )}

            <div className="shrink-0 border-t border-line px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-label text-muted">
                  Subtotal
                </p>
                <p className="font-display text-lg text-ink">
                  {formatEgp(subtotal)}
                </p>
              </div>

              <p className="mt-2 text-xs text-muted">
                Taxes and shipping are calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className={cn(
                  buttonVariants({ variant: "solid", size: "lg" }),
                  "mt-5 w-full",
                )}
              >
                Checkout
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-4 block text-center text-[11px] uppercase tracking-label text-muted transition-colors hover:text-ink"
              >
                View bag
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
