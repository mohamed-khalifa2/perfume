import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

const headingVariants = cva("font-display text-ink", {
  variants: {
    level: {
      h1: "text-4xl leading-tight md:text-5xl",
      h2: "text-3xl leading-tight md:text-4xl",
      h3: "text-2xl leading-snug",
    },
  },
  defaultVariants: {
    level: "h2",
  },
});

export type SectionHeadingProps = {
  label?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  level?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  level = "h2",
  className,
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {label ? (
        <p className="text-[11px] uppercase tracking-label text-gold">{label}</p>
      ) : null}

      <Heading className={cn("mt-4", headingVariants({ level }))}>{title}</Heading>

      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
