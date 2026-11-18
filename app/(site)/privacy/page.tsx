import Link from "next/link";

export const metadata = {
  title: "Privacy policy",
  description: "How Maison Noir collects, uses and protects your information.",
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: "When you place an order, we collect your name, email address, phone number, delivery address and order details. When you send an inquiry, we collect the details you choose to provide in the message.",
  },
  {
    title: "How we use it",
    body: "We use your information to process and deliver orders, respond to questions, keep records for support, and improve the store. We do not sell your personal information.",
  },
  {
    title: "Payments",
    body: "Card payments are handled by Paymob. We receive confirmation of the payment and order status, but we do not store full card numbers or security codes.",
  },
  {
    title: "Sharing",
    body: "We share only the information needed to complete an order with the delivery and payment providers involved. We may also disclose information when required by law.",
  },
  {
    title: "Your choices",
    body: "You can ask us to correct or remove your contact information, subject to records we need to keep for completed orders. Use the contact page to make a request.",
  },
  {
    title: "Contact",
    body: "If you have questions about this policy or how your information is handled, please reach out through the contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <p className="text-xs uppercase tracking-label text-gold">Legal</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          This policy explains what Maison Noir collects and why.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section, index) => (
            <section key={section.title} className="border-t border-line pt-6">
              <p className="text-[11px] uppercase tracking-label text-gold">
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
          To make a request,{" "}
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
