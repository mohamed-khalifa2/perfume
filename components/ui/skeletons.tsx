import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export function PageHeadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton variant="text" className="w-20" />
      <Skeleton variant="title" className="h-10 w-64 max-w-full" />
      <Skeleton variant="text" className="w-2/3 max-w-xl" />
    </div>
  );
}

export function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative min-h-[60vh] overflow-hidden bg-cream-deep", className)}>
      <Skeleton className="size-full rounded-none bg-cream/50" />
      <Container size="lg" className="absolute inset-0 flex items-end pb-16 lg:pb-20">
        <div className="w-full max-w-2xl space-y-5">
          <Skeleton variant="text" className="w-24 bg-cream/70" />
          <Skeleton variant="title" className="h-12 w-3/4 bg-cream/70" />
          <Skeleton variant="text" className="w-2/3 bg-cream/70" />
        </div>
      </Container>
    </div>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} role="presentation">
      <Skeleton variant="card" />
      <Skeleton variant="text" className="w-16" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-24" />
    </div>
  );
}

export function ProductGridSkeleton({
  count = 12,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3", className)}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-12" />
      ))}
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" className="w-24" />
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-3 border-t border-line pt-4">
          <Skeleton variant="text" className="w-20" />
          <Skeleton variant="text" className="w-32" />
        </div>
      ))}
    </div>
  );
}
