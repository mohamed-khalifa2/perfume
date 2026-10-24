export default function Loading() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
        <div className="h-4 w-24 animate-pulse bg-cream-deep" />
        <div className="mt-4 h-10 w-80 animate-pulse bg-cream-deep" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse bg-cream-deep" />
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:gap-16 lg:px-10">
        <div className="hidden w-64 flex-col gap-8 lg:flex">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="h-3 w-24 animate-pulse bg-cream-deep" />
              <div className="h-3 w-full animate-pulse bg-cream-deep" />
              <div className="h-3 w-3/4 animate-pulse bg-cream-deep" />
              <div className="h-3 w-2/3 animate-pulse bg-cream-deep" />
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="aspect-3/4 w-full animate-pulse bg-cream-deep" />
              <div className="h-3 w-16 animate-pulse bg-cream-deep" />
              <div className="h-5 w-3/4 animate-pulse bg-cream-deep" />
              <div className="h-3 w-24 animate-pulse bg-cream-deep" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
