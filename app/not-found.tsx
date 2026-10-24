import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">404</p>
      <h1 className="mt-6 font-display text-4xl text-ink lg:text-5xl">
        Page not found
      </h1>
      <p className="mt-6 text-sm text-muted">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-10 bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
      >
        Back to home
      </Link>
    </div>
  );
}
