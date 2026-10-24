import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const containerVariants = cva("mx-auto w-full px-6 lg:px-10", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export type ContainerProps = React.ComponentProps<"div"> &
  VariantProps<typeof containerVariants>;

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
