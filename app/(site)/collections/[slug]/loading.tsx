import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-24">
      <div className="relative min-h-[60vh] overflow-hidden bg-cream-deep">
        <Skeleton className="size-full rounded-none bg-cream/50" />
        <Container
          size="lg"
          className="absolute inset-0 flex items-end pb-16"
        >
          <div className="w-full max-w-2xl space-y-5">
            <Skeleton variant="text" className="w-28 bg-cream/70" />
            <Skeleton variant="title" className="h-12 w-3/4 bg-cream/70" />
            <Skeleton variant="text" className="w-2/3 bg-cream/70" />
          </div>
        </Container>
      </div>

      <Container size="lg" className="mt-16">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="title" className="mt-4 h-9 w-80" />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
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
