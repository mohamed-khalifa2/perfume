export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">House</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">About</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>Loading</p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-paper-deep" />
        </div>
      </div>
    </div>
  );
}
