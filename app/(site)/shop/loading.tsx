import { Container } from "@/components/ui/container";
import { ShopPaginationSkeleton, ShopProductSkeleton } from "@/components/shop-results-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="pb-24">
      <Container size="lg">
        <div className="space-y-4 pt-10 md:pt-14">
          <Skeleton variant="text" className="w-16" />
          <Skeleton variant="title" className="h-10 w-64" />
          <Skeleton variant="text" className="w-2/3" />
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <aside className="w-full lg:w-64 lg:shrink-0">
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
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <Skeleton variant="text" className="w-24" />
            <ShopProductSkeleton />
            <ShopPaginationSkeleton />
          </div>
        </div>
      </Container>
    </div>
  );
}
