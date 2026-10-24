export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">Contact</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Contact us
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="contact-name"
              className="text-xs uppercase tracking-label text-ink"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="text-xs uppercase tracking-label text-ink"
            >
              Email address
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="text-xs uppercase tracking-label text-ink"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
          <button
            type="submit"
            className="bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
          >
            Send inquiry
          </button>
        </form>

        <div className="border-t border-line pt-8 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p>Loading</p>
        </div>
      </div>
    </div>
  );
}
