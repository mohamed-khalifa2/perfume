import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container size="lg">
      <div className="py-16">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="title" className="mt-4 h-10 w-56" />

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-5 border-b border-line pb-6">
                <Skeleton variant="card" className="w-24 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="text" className="w-1/2" />
                  <Skeleton variant="text" className="w-24" />
                  <Skeleton variant="rect" className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-line pt-6">
            <Skeleton variant="text" className="w-28" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-4">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="text" className="w-16" />
              </div>
            ))}
            <Skeleton variant="rect" className="mt-8 h-12 w-full" />
          </div>
        </div>
      </div>
    </Container>
  );
}
