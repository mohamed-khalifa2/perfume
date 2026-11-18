"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type CarouselProps = {
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  controlsClassName?: string;
  trackClassName?: string;
};

const EDGE_TOLERANCE = 4;
const DRAG_THRESHOLD = 6;

export function Carousel({
  ariaLabel,
  children,
  className,
  controlsClassName,
  trackClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanScrollPrev(track.scrollLeft > EDGE_TOLERANCE);
    setCanScrollNext(
      track.scrollLeft + track.clientWidth <
        track.scrollWidth - EDGE_TOLERANCE,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });

    const observer = new ResizeObserver(updateControls);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [updateControls]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstSlide = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = firstSlide ? firstSlide.offsetWidth + gap : track.clientWidth;

    track.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      startX: event.clientX,
      startLeft: track.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;

    const delta = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(delta) > DRAG_THRESHOLD) {
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
    }

    if (drag.moved) {
      track.scrollLeft = drag.startLeft - delta;
    }
  };

  const endDrag = () => {
    const drag = dragRef.current;
    dragRef.current = null;

    if (drag?.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div role="region" aria-label={ariaLabel} className={className}>
      <div className={cn("flex items-center gap-2", controlsClassName)}>
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={!canScrollPrev}
          aria-label={`Previous ${ariaLabel}`}
          className="flex size-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={!canScrollNext}
          aria-label={`Next ${ariaLabel}`}
          className="flex size-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={handleClickCapture}
        className={cn(
          "flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none select-none active:cursor-grabbing",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
