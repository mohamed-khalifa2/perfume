import Image from "next/image";
import Link from "next/link";

type ProductCardMediaProps = {
  slug: string;
  name: string;
  coverImage: string;
  galleryImage?: string | null;
  eager?: boolean;
  sizes?: string;
  children: React.ReactNode;
};

export function ProductCardMedia({
  slug,
  name,
  coverImage,
  galleryImage,
  eager = false,
  sizes,
  children,
}: ProductCardMediaProps) {
  return (
    <div
      className="product-card-media relative order-1 aspect-3/4 overflow-hidden bg-cream-deep"
      data-hover-src={galleryImage ?? undefined}
    >
      <Link
        href={`/shop/${slug}`}
        className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink"
        aria-label={name}
      >
        <Image
          src={coverImage}
          alt={name}
          fill
          loading={eager ? "eager" : undefined}
          sizes={sizes}
          className="product-card-cover object-cover transition-opacity duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      {children}
    </div>
  );
}
