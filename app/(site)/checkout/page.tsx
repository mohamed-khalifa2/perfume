export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">Checkout</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Checkout
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xs uppercase tracking-label text-ink">
              Contact
            </h2>
            <div className="mt-5 border-t border-line pt-5 text-sm text-muted">
              Loading
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-label text-ink">
              Shipping address
            </h2>
            <div className="mt-5 border-t border-line pt-5 text-sm text-muted">
              Loading
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-label text-ink">
              Payment
            </h2>
            <div className="mt-5 space-y-3 border-t border-line pt-5">
              <label className="flex items-center gap-3 text-sm text-ink">
                <input
                  type="radio"
                  name="payment-method"
                  value="cod"
                  defaultChecked
                  className="accent-ink"
                />
                Cash on delivery
              </label>
              <label className="flex items-center gap-3 text-sm text-ink">
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  className="accent-ink"
                />
                Card (Paymob)
              </label>
            </div>
          </section>
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
          <button
            type="button"
            className="mt-8 w-full bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
          >
            Place order
          </button>
        </aside>
      </div>
    </div>
  );
}
