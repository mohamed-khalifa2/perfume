import { Container } from "@/components/ui/container";
import {
  HeroSkeleton,
  PageHeadingSkeleton,
  ProductGridSkeleton,
} from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="pb-24">
      <HeroSkeleton />

      <Container size="lg" className="mt-16">
        <PageHeadingSkeleton />
        <ProductGridSkeleton
          count={6}
          className="mt-12 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        />
      </Container>
    </div>
  );
}
