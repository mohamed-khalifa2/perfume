import Link from "next/link";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">Cart</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Your cart
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border-t border-line">
            <p className="py-6 text-sm text-muted">Your cart is empty.</p>
          </div>
          <Link
            href="/shop"
            className="mt-8 inline-block border border-line px-8 py-4 text-xs uppercase tracking-label text-ink transition-colors hover:border-ink"
          >
            Continue shopping
          </Link>
        </div>

        <aside className="border-t border-line pt-6">
          <p className="text-xs uppercase tracking-label text-ink">Summary</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">EGP 0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="uppercase tracking-label text-ink">Total</dt>
              <dd className="font-display text-lg text-ink">EGP 0</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-8 block bg-ink px-8 py-4 text-center text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
          >
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
