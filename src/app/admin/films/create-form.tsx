"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createVideo, type VideoFormState } from "@/actions/films";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: VideoFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

type Props = {
  categories: { id: string; name: string }[];
  videoMedia: { id: string; public_id: string; alt_text: string | null }[];
  imageMedia: { id: string; public_id: string; alt_text: string | null }[];
};

export default function CreateVideoForm({ categories, videoMedia, imageMedia }: Props) {
  const [state, formAction, isPending] = useActionState(createVideo, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [sourceType, setSourceType] = useState<"cloudinary" | "youtube" | "vimeo">("youtube");

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input name="title" placeholder="Film title" required className={inputClass} />
        <select
          name="source_type"
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as any)}
          className={inputClass}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="cloudinary">Cloudinary upload</option>
        </select>
        <select name="category_id" className={inputClass}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {sourceType === "cloudinary" ? (
        <MediaPickerSelect name="media_id" options={videoMedia} />
      ) : (
        <input name="external_url" placeholder={`${sourceType === "youtube" ? "YouTube" : "Vimeo"} URL`} className={`${inputClass} w-full`} />
      )}

      <div>
        <label className="text-xs text-neutral-500 block mb-1">Thumbnail (optional)</label>
        <MediaPickerSelect name="thumbnail_media_id" options={imageMedia} />
      </div>

      <textarea name="description" placeholder="Description" rows={2} className={`${inputClass} w-full`} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Film"}
      </button>
    </form>
  );
}
