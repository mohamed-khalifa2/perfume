export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">
        Orders
      </p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Track your order
      </h1>

      <form className="mt-12 space-y-6">
        <div>
          <label
            htmlFor="order-number"
            className="text-xs uppercase tracking-label text-ink"
          >
            Order number
          </label>
          <input
            id="order-number"
            name="order-number"
            type="text"
            className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
          />
        </div>
        <div>
          <label
            htmlFor="order-email"
            className="text-xs uppercase tracking-label text-ink"
          >
            Email address
          </label>
          <input
            id="order-email"
            name="order-email"
            type="email"
            className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
          />
        </div>
        <button
          type="submit"
          className="bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
        >
          Track order
        </button>
      </form>

      <div className="mt-16 border-t border-line pt-8 text-sm text-muted">
        Loading
      </div>
    </div>
  );
}
