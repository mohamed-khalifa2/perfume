import { Skeleton } from "@/components/ui/skeleton";

export function ShopProductSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton variant="card" />
          <Skeleton variant="text" className="w-16" />
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-24" />
        </div>
      ))}
    </div>
  );
}

export function ShopPaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-12" />
      ))}
    </div>
  );
}
