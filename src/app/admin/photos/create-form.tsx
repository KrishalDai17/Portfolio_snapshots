"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createPhoto, type PhotoFormState } from "@/actions/photos";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: PhotoFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

type Props = {
  categories: { id: string; name: string }[];
  albums: { id: string; title: string }[];
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
};

export default function CreatePhotoForm({ categories, albums, mediaOptions }: Props) {
  const [state, formAction, isPending] = useActionState(createPhoto, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <MediaPickerSelect name="media_id" options={mediaOptions} />
        <input name="title" placeholder="Title" className={inputClass} />
        <select name="category_id" className={inputClass}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <select name="album_id" className={inputClass}>
          <option value="">No album</option>
          {albums.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <input name="location" placeholder="Location" className={inputClass} />
        <input name="taken_at" type="date" className={inputClass} />
      </div>
      <textarea name="caption" placeholder="Caption" rows={2} className={`${inputClass} w-full`} />

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="text-xs text-neutral-400 underline"
      >
        {showMore ? "Hide" : "Show"} camera metadata &amp; alt text
      </button>

      {showMore && (
        <div className="grid md:grid-cols-3 gap-3">
          <input name="alt_text" placeholder="Alt text" className={inputClass} />
          <input name="tags" placeholder="Tags (comma separated)" className={inputClass} />
          <input name="camera" placeholder="Camera" className={inputClass} />
          <input name="lens" placeholder="Lens" className={inputClass} />
          <input name="aperture" placeholder="Aperture (e.g. f/2.8)" className={inputClass} />
          <input name="shutter_speed" placeholder="Shutter speed (e.g. 1/200)" className={inputClass} />
          <input name="iso" placeholder="ISO" className={inputClass} />
        </div>
      )}

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Photo"}
      </button>
    </form>
  );
}
