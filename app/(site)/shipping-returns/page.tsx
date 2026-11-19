import Link from "next/link";

export const metadata = {
  title: "Shipping and returns",
  description: "Delivery information and return guidance for Maison Noir orders.",
};

const SECTIONS = [
  {
    title: "Where we deliver",
    body: "We deliver across Egypt. Delivery fees are based on the governorate selected at checkout and are shown before you confirm an order.",
  },
  {
    title: "Complimentary delivery",
    body: "Orders that reach the free shipping threshold qualify for complimentary delivery. The current threshold is shown in the bag and at checkout.",
  },
  {
    title: "Order status",
    body: "Once an order is placed, you can use the order number and email address from confirmation to check its status. Delivery updates may take a short time to appear.",
  },
  {
    title: "Returns",
    body: "If something is not right with your order, please contact us before returning a product. We will review the request and tell you how to proceed. Products should be returned unused and in their original packaging where possible.",
  },
  {
    title: "Damaged or incorrect items",
    body: "If an item arrives damaged or differs from what you ordered, contact us with your order number and details. We will arrange the appropriate replacement or refund.",
  },
  {
    title: "Need help?",
    body: "Our team can help with delivery questions, address changes and return requests through the contact page.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <p className="text-xs uppercase tracking-label text-gold-on-light">Help</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Shipping and returns
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Everything you need to know about delivery and returns in Egypt.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section, index) => (
            <section key={section.title} className="border-t border-line pt-6">
              <p className="text-[11px] uppercase tracking-label text-gold-on-light">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-xl text-ink sm:text-2xl">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted">
          For help with an order,{" "}
          <Link
            href="/contact"
            className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
