"use client";

import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";

import {
  trackOrder,
  type TrackOrderState,
} from "@/app/(site)/orders/track/actions";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEgp } from "@/components/ui/price";
import { cn } from "@/lib/cn";

const INITIAL_STATE: TrackOrderState = {
  status: "idle",
  message: "",
};

function label(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function OrderTrackingForm() {
  const [state, formAction, isPending] = useActionState(
    trackOrder,
    INITIAL_STATE,
  );

  return (
    <div>
      <form action={formAction} className="space-y-5">
        <Input
          name="orderNumber"
          label="Order number"
          required
          maxLength={40}
          placeholder="PF-000001"
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
        <button
          type="submit"
          disabled={isPending}
          className={cn(buttonVariants({ variant: "solid", size: "lg" }), "w-full")}
        >
          {isPending ? "Checking..." : "Track order"}
        </button>
      </form>

      {state.status === "error" ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 text-sm text-gold-on-light"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      ) : null}

      {state.status === "success" && state.order ? (
        <section className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-label text-muted">
                Order
              </p>
              <p className="mt-2 font-display text-xl text-ink">
                {state.order.orderNumber}
              </p>
              <p className="mt-1 text-xs text-muted">
                Placed {formatDate(state.order.createdAt)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[11px] uppercase tracking-label text-muted">
                Total
              </p>
              <p className="mt-2 text-base text-ink tabular-nums">
                {formatEgp(state.order.total)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="border border-line px-4 py-3">
              <p className="text-[11px] uppercase tracking-label text-muted">
                Status
              </p>
              <p className="mt-1 text-sm text-ink">
                {label(state.order.status)}
              </p>
            </div>
            <div className="border border-line px-4 py-3">
              <p className="text-[11px] uppercase tracking-label text-muted">
                Payment
              </p>
              <p className="mt-1 text-sm text-ink">
                {label(state.order.paymentStatus)}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {state.order.items.map((item, index) => (
              <li
                key={`${item.productName}-${index}`}
                className="flex items-start justify-between gap-4 border-b border-line pb-3 text-sm"
              >
                <div>
                  <p className="text-ink">{item.productName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.sizeMl} ml, quantity {item.quantity}
                  </p>
                </div>
                <p className="text-ink tabular-nums">
                  {formatEgp(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
