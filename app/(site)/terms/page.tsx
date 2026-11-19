import Link from "next/link";

export const metadata = {
  title: "Terms and conditions",
  description:
    "The terms that apply to orders placed with Maison Noir in Egypt.",
};

const SECTIONS = [
  {
    title: "Using this site",
    body: "By browsing or placing an order with Maison Noir, you agree to these terms. Please read them before completing a purchase. If you do not agree, you should not use the store.",
  },
  {
    title: "Orders and pricing",
    body: "All prices are shown in Egyptian pounds. The total confirmed at checkout is calculated from the current prices, delivery governorate and any valid discount code. We may cancel or refuse an order if a product is unavailable, a price is clearly incorrect, or a payment cannot be verified.",
  },
  {
    title: "Payment",
    body: "Cash on delivery and card payment through Paymob are available where shown. Card payments are processed securely by Paymob. Maison Noir does not store full card details.",
  },
  {
    title: "Delivery",
    body: "We deliver within Egypt. Delivery fees depend on the governorate and are shown before an order is confirmed. Orders over the free shipping threshold qualify for complimentary delivery where the option is available.",
  },
  {
    title: "Images and content",
    body: "Product photography and written content on this site belong to Maison Noir or its partners. Please do not reproduce them without permission.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent through our contact page. We may update these terms when the store changes, and the current version will always be available here.",
  },
];

export default function TermsPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <p className="text-xs uppercase tracking-label text-gold-on-light">Legal</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Terms and conditions
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          These terms govern your use of the Maison Noir store and any order you
          place with us.
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
          For questions,{" "}
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
