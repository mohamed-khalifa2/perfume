import { cn } from "@/lib/cn";

export type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
};

function distanceClass(distance: number): string {
  if (distance <= 14) return "fade-in--distance-14";
  if (distance <= 18) return "fade-in--distance-18";
  return "fade-in--distance-24";
}

function delayClass(delay: number): string {
  if (delay <= 0.01) return "";
  if (delay <= 0.09) return "fade-in--delay-80";
  if (delay <= 0.11) return "fade-in--delay-100";
  if (delay <= 0.14) return "fade-in--delay-120";
  if (delay <= 0.22) return "fade-in--delay-200";
  if (delay <= 0.26) return "fade-in--delay-240";
  return "fade-in--delay-360";
}

export function FadeIn({
  children,
  delay = 0,
  distance = 24,
  className,
}: FadeInProps) {
  return (
    <div
      data-visible="false"
      className={cn(
        "fade-in",
        distanceClass(distance),
        delayClass(delay),
        className,
      )}
    >
      {children}
    </div>
  );
}
