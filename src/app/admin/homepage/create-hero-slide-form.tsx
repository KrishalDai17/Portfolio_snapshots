"use client";

import { useActionState, useRef, useEffect } from "react";
import { createHeroSlide, type HeroSlideFormState } from "@/actions/homepage";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: HeroSlideFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

export default function CreateHeroSlideForm({
  mediaOptions,
}: {
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
}) {
  const [state, formAction, isPending] = useActionState(createHeroSlide, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <MediaPickerSelect name="media_id" options={mediaOptions} />
        <input name="heading" placeholder="Heading (e.g. DR DSLR)" className={inputClass} />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <input name="subtitle" placeholder="Subtitle" className={inputClass} />
        <input name="cta_label" placeholder="CTA label (e.g. Explore Work)" className={inputClass} />
        <input name="cta_url" placeholder="CTA link (e.g. /work)" className={inputClass} />
      </div>
      <input name="duration_ms" type="number" placeholder="Slide duration (ms, default 6000)" className={`${inputClass} w-full md:w-64`} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Slide"}
      </button>
    </form>
  );
}
