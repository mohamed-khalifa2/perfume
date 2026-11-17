import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Keeps the site layout stable while any storefront page is loading. */
export default function Loading() {
  return (
    <div className="pb-24">
      <div className="relative min-h-[65vh] overflow-hidden bg-cream-deep">
        <Skeleton className="size-full rounded-none bg-cream/50" />
        <Container
          size="lg"
          className="absolute inset-0 flex items-end pb-16 lg:pb-20"
        >
          <div className="w-full max-w-2xl space-y-5">
            <Skeleton variant="text" className="w-24 bg-cream/70" />
            <Skeleton variant="title" className="h-14 w-full bg-cream/70" />
            <Skeleton variant="text" className="w-2/3 bg-cream/70" />
          </div>
        </Container>
      </div>

      <Container size="lg" className="mt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-4 lg:col-span-7">
            <Skeleton variant="text" className="w-32" />
            <Skeleton variant="rect" className="h-5 w-full" />
            <Skeleton variant="rect" className="h-5 w-full" />
            <Skeleton variant="rect" className="h-5 w-4/5" />
            <Skeleton variant="rect" className="mt-8 h-24 w-full" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton variant="card" className="aspect-4/5" />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton variant="card" />
              <Skeleton variant="text" className="w-16" />
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-24" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
