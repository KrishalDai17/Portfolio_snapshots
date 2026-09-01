"use client";

import { useState, useEffect, useCallback } from "react";
import { cldImageUrl } from "@/lib/cloudinary/url";

export type GalleryPhoto = {
  id: string;
  public_id: string;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

export default function MasonryGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(() => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length]);
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {photos.map((p, i) => {
          const ratio = p.width && p.height ? p.height / p.width : 1.25;
          return (
            <button
              key={p.id}
              onClick={() => setActiveIndex(i)}
              data-cursor="VIEW"
              className="block w-full break-inside-avoid group relative overflow-hidden"
              style={{ aspectRatio: `1 / ${ratio}` }}
              aria-label={`View ${p.title ?? "photograph"} fullscreen`}
            >
              <img
                src={cldImageUrl(p.public_id, { width: 800 })}
                alt={p.alt_text ?? p.title ?? "Photograph"}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl"
          >
            ›
          </button>

          <figure className="max-h-[85vh] max-w-5xl">
            <img
              src={cldImageUrl(active.public_id, { width: 1600 })}
              alt={active.alt_text ?? active.title ?? "Photograph"}
              className="max-h-[85vh] w-auto mx-auto object-contain"
            />
            {active.caption && (
              <figcaption className="text-center text-neutral-400 text-sm mt-4">{active.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
