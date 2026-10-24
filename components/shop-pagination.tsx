"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ShopPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;

  const buildHref = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(target));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Previous
        </Link>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: p === page ? "solid" : "ghost", size: "sm" }),
            "px-3",
          )}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
