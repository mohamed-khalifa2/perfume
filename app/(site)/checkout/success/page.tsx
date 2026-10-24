import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">
        Order confirmed
      </p>
      <h1 className="mt-6 font-display text-4xl text-ink lg:text-5xl">
        Thank you
      </h1>
      <p className="mt-6 text-sm text-muted">
        A confirmation has been sent to your email address.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/orders/track"
          className="border border-line px-8 py-4 text-xs uppercase tracking-label text-ink transition-colors hover:border-ink"
        >
          Track order
        </Link>
        <Link
          href="/shop"
          className="bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
