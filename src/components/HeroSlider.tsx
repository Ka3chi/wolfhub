"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = {
  key: string;
  href: string;
  title: string;
  overview: string;
  imageUrl: string;
  badge: string;
  /** Tailwind text color class for the badge. */
  badgeClass: string;
  year: number | null;
  rating: number | null;
  /** Has an official free stream to play in-app. */
  free: boolean;
};

const INTERVAL_MS = 7000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  if (count === 0) return null;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section
      className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-2xl shadow-violet-950/40 ring-1 ring-white/10 sm:aspect-21/9"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          aria-hidden={i !== index}
          className={
            "absolute inset-0 transition-opacity duration-1000 " +
            (i === index ? "opacity-100" : "pointer-events-none opacity-0")
          }
        >
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            preload={i === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className={
              "object-cover transition-transform duration-[8000ms] ease-out " +
              (i === index ? "scale-105" : "scale-100")
            }
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0d0b1f] via-[#0d0b1f]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0d0b1f]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 max-w-2xl p-6 pb-14 sm:p-10 sm:pb-16">
            <p className={"text-xs font-bold uppercase tracking-[0.2em] " + slide.badgeClass}>
              {slide.badge}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h2>
            <p className="mt-2 flex gap-3 text-sm text-zinc-300">
              {slide.rating ? (
                <span className="font-semibold text-amber-400">★ {slide.rating.toFixed(1)}</span>
              ) : null}
              {slide.year ? <span>{slide.year}</span> : null}
            </p>
            <p className="mt-3 line-clamp-2 text-sm text-zinc-300 sm:line-clamp-3 sm:text-base">
              {slide.overview}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {slide.free ? (
                <Link
                  href={`${slide.href}#watch`}
                  tabIndex={i === index ? 0 : -1}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:bg-emerald-400"
                >
                  ▶ Watch free
                </Link>
              ) : null}
              <Link
                href={slide.href}
                tabIndex={i === index ? 0 : -1}
                className={
                  "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition hover:scale-105 " +
                  (slide.free ? "glass hover:bg-white/15" : "bg-white text-black hover:bg-zinc-200")
                }
              >
                {slide.free ? "Details" : "▶ View details"}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-6 flex gap-2 sm:left-10">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70")
            }
          />
        ))}
      </div>
      <div className="absolute bottom-4 right-4 hidden gap-2 sm:flex">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="glass h-10 w-10 rounded-full text-xl hover:bg-white/20"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="glass h-10 w-10 rounded-full text-xl hover:bg-white/20"
        >
          ›
        </button>
      </div>
    </section>
  );
}
