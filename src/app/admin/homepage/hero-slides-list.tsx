"use client";

import DragReorderList from "@/components/admin/drag-reorder-list";
import { deleteHeroSlide, toggleHeroSlideEnabled } from "@/actions/homepage";

type Slide = {
  id: string;
  heading: string | null;
  subtitle: string | null;
  is_enabled: boolean;
  media: {
    public_id: string;
    secure_url: string | null;
  } | null;
};

export default function HeroSlidesList({ slides }: { slides: Slide[] }) {
  if (slides.length === 0) {
    return (
      <p className="text-sm text-neutral-500 py-6 text-center border border-neutral-800">
        No hero slides yet — add one above.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <DragReorderList
        table="hero_slides"
        items={slides}
        revalidatePaths={["/admin/homepage", "/"]}
        renderItem={(s, dragHandle) => (
          <div className="border border-neutral-800 p-4 flex items-center gap-4">
            <span
              {...dragHandle}
              className="text-neutral-600 hover:text-[#c9a24b] cursor-grab select-none"
            >
              ⠿
            </span>

            <div className="w-20 h-12 shrink-0 bg-neutral-900 overflow-hidden rounded-sm">
              {s.media?.secure_url && (
                <img
                  src={s.media.secure_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {s.heading || "Untitled slide"}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {s.subtitle}
              </p>
            </div>

            <form
              action={toggleHeroSlideEnabled.bind(
                null,
                s.id,
                !s.is_enabled
              )}
            >
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${
                  s.is_enabled
                    ? "border-[#c9a24b] text-[#c9a24b]"
                    : "border-neutral-700 text-neutral-500"
                }`}
              >
                {s.is_enabled ? "Enabled" : "Disabled"}
              </button>
            </form>

            <form action={deleteHeroSlide.bind(null, s.id)}>
              <button
                type="submit"
                className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400"
              >
                Delete
              </button>
            </form>
          </div>
        )}
      />
    </div>
  );
}