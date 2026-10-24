import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const skeletonVariants = cva("animate-pulse bg-cream-deep", {
  variants: {
    variant: {
      text: "h-3.5 w-full",
      title: "h-8 w-2/3",
      rect: "h-24 w-full",
      circle: "size-10 rounded-full",
      card: "aspect-3/4 w-full",
    },
  },
  defaultVariants: {
    variant: "rect",
  },
});

export type SkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div className={cn(skeletonVariants({ variant }), className)} {...props} />
  );
}
