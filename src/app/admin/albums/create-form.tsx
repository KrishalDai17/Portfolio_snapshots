"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAlbum, type AlbumFormState } from "@/actions/albums";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: AlbumFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

type Props = {
  categories: { id: string; name: string }[];
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
};

export default function CreateAlbumForm({ categories, mediaOptions }: Props) {
  const [state, formAction, isPending] = useActionState(createAlbum, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" placeholder="Album title" required className={inputClass} />
        <input name="slug" placeholder="Slug (optional)" className={inputClass} />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <select name="category_id" className={inputClass}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <MediaPickerSelect name="cover_media_id" options={mediaOptions} />
        <input name="event_date" type="date" className={inputClass} />
      </div>
      <textarea name="description" placeholder="Description" rows={2} className={`${inputClass} w-full`} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create Album"}
      </button>
    </form>
  );
}
