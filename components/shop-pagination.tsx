"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ShopPaginationProps = {
  page: number;
  totalPages: number;
  onNavigate: (href: string) => void;
  pendingHref?: string | null;
};

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  const items: PageItem[] = [];

  for (let target = 1; target <= totalPages; target += 1) {
    const isNearCurrent = Math.abs(target - page) <= 1;
    if (target === 1 || target === totalPages || isNearCurrent) {
      items.push(target);
      continue;
    }
    if (items[items.length - 1] !== "ellipsis") items.push("ellipsis");
  }

  return items;
}

export function ShopPagination({
  page,
  totalPages,
  onNavigate,
  pendingHref,
}: ShopPaginationProps) {
  const pathname = usePathname();
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
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  };

  const linkClassName = (href: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "gap-1.5",
      pendingHref === href && "animate-pulse opacity-60",
    );

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          aria-label="Previous page"
          onClick={(event) => handleClick(event, buildHref(page - 1))}
          className={linkClassName(buildHref(page - 1))}
        >
          <ChevronLeft className="size-3.5" aria-hidden />
          <span>Previous</span>
        </Link>
      ) : null}

      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-xs text-muted"
            aria-hidden
          >
            &hellip;
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className={cn(
              buttonVariants({ variant: "solid", size: "sm" }),
              "px-3",
            )}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            aria-label={`Go to page ${item}`}
            onClick={(event) => handleClick(event, buildHref(item))}
            className={cn(linkClassName(buildHref(item)), "px-3")}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          aria-label="Next page"
          onClick={(event) => handleClick(event, buildHref(page + 1))}
          className={linkClassName(buildHref(page + 1))}
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
