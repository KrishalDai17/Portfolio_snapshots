"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAboutItem, type ItemFormState } from "@/actions/about";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: ItemFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

type Props = {
  section: "journey" | "experience" | "skill" | "equipment" | "award" | "achievement";
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
};

export default function CreateItemForm({ section, mediaOptions }: Props) {
  const [state, formAction, isPending] = useActionState(createAboutItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  const needsMedia = section === "equipment" || section === "award" || section === "achievement";

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap gap-2 items-start">
      <input type="hidden" name="section" value={section} />
      <input name="title" placeholder="Title" required className={inputClass} />
      <input name="subtitle" placeholder="Subtitle (optional)" className={inputClass} />
      <input name="item_date" type="date" className={inputClass} />
      {needsMedia && <MediaPickerSelect name="media_id" options={mediaOptions} />}
      <input name="description" placeholder="Description (optional)" className={`${inputClass} flex-1 min-w-[150px]`} />
      <label className="flex items-center gap-1.5 text-xs text-neutral-500 self-center">
        <input type="checkbox" name="is_demo" value="true" />
        Demo content
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-3 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        Add
      </button>
      {state.error && <p className="text-sm text-red-400 basis-full">{state.error}</p>}
    </form>
  );
}
