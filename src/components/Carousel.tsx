"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** A row of slides moved by arrow buttons or swiping; the scrollbar is hidden. */
export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Fires once on observe, then whenever the row resizes.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  function slide(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="group/carousel relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 py-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {children}
      </div>
      <SlideButton direction={-1} visible={canPrev} onClick={() => slide(-1)} />
      <SlideButton direction={1} visible={canNext} onClick={() => slide(1)} />
    </div>
  );
}

function SlideButton({
  direction,
  visible,
  onClick,
}: {
  direction: 1 | -1;
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? "Next slides" : "Previous slides"}
      tabIndex={visible ? 0 : -1}
      className={
        "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white shadow-lg ring-1 ring-white/20 backdrop-blur transition hover:scale-110 hover:bg-white hover:text-black sm:flex " +
        (direction === 1 ? "-right-3 " : "-left-3 ") +
        (visible
          ? "opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          : "pointer-events-none opacity-0")
      }
    >
      {direction === 1 ? "›" : "‹"}
    </button>
  );
}

/** Fixed-width cell inside a Carousel. */
export function Slide({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={(wide ? "w-64 sm:w-80" : "w-36 sm:w-44") + " shrink-0 snap-start"}>
      {children}
    </div>
  );
}
