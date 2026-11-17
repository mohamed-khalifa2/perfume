import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-24">
      <Container size="lg">
        <div className="pt-8 md:pt-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton variant="card" className="col-span-2 aspect-[4/3]" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>

            <div className="space-y-7 lg:sticky lg:top-32 lg:self-start">
              <div className="space-y-4">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="title" className="h-12 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton variant="text" className="w-20" />
                  <Skeleton variant="text" className="w-28" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton variant="text" className="w-16" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant="text" className="h-10 w-20" />
                  ))}
                </div>
                <Skeleton variant="text" className="w-40" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton variant="text" className="w-20" />
                  <Skeleton variant="text" className="h-9 w-24" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton variant="rect" className="h-11 w-full" />
                  <Skeleton variant="rect" className="h-11 w-full" />
                </div>
              </div>

              <div className="space-y-3 border-t border-line pt-6">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-2/3" />
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton variant="text" className="w-28" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rect" className="h-4 w-full" />
              ))}
            </div>
            <div className="space-y-5">
              <Skeleton variant="text" className="w-32" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rect" className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <section className="mt-24">
        <Container size="lg">
          <Skeleton variant="text" className="w-48" />
          <Skeleton variant="title" className="mt-4 h-9 w-72" />
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton variant="card" />
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-24" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
