"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Slide = {
  id: string;
  heading: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  durationMs: number;
  imageUrl: string | null;
  alt: string;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setTimeout(next, slide.durationMs);
    return () => clearTimeout(t);
  }, [index, next, slide.durationMs, slides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {slide.imageUrl ? (
        <img
          key={slide.id}
          src={slide.imageUrl}
          alt={slide.alt}
          className="absolute inset-0 h-full w-full object-cover motion-safe:animate-[kenburns_8s_ease-out_forwards] opacity-70"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-5xl md:text-7xl tracking-wide text-[#f5f0e6]">
          {slide.heading}
        </h1>
        <p className="mt-4 text-sm md:text-base uppercase tracking-[0.25em] text-neutral-300">
          {slide.subtitle}
        </p>
        <Link
          href={slide.ctaUrl}
          data-cursor="EXPLORE"
          className="mt-10 inline-block border border-[#c9a24b] text-[#c9a24b] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#c9a24b] hover:text-black transition-colors"
        >
          {slide.ctaLabel}
        </Link>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 w-8 transition-colors ${i === index ? "bg-[#c9a24b]" : "bg-white/30"}`}
              />
            ))}
          </div>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
