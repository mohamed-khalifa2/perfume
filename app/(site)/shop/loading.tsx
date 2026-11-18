import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilterSidebarSkeleton,
  PageHeadingSkeleton,
  PaginationSkeleton,
  ProductGridSkeleton,
} from "@/components/ui/skeletons";

export default function ShopLoading() {
  return (
    <div className="pb-24">
      <Container size="lg">
        <PageHeadingSkeleton className="pt-10 md:pt-14" />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <aside className="w-full lg:w-64 lg:shrink-0">
            <FilterSidebarSkeleton />
          </aside>

          <div className="flex flex-1 flex-col gap-8">
            <Skeleton variant="text" className="w-24" />
            <ProductGridSkeleton />
            <PaginationSkeleton />
          </div>
        </div>
      </Container>
    </div>
  );
}
