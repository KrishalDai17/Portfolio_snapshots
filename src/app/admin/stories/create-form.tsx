"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createStory, type StoryFormState } from "@/actions/stories";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: StoryFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

export default function CreateStoryForm({
  mediaOptions,
}: {
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
}) {
  const [state, formAction, isPending] = useActionState(createStory, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showSeo, setShowSeo] = useState(false);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input name="title" placeholder="Story title" required className={inputClass} />
        <input name="slug" placeholder="Slug (optional)" className={inputClass} />
        <input name="story_date" type="date" className={inputClass} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <MediaPickerSelect name="cover_media_id" options={mediaOptions} />
        <input name="location" placeholder="Location" className={inputClass} />
      </div>
      <textarea name="intro" placeholder="Introduction (short teaser)" rows={2} className={`${inputClass} w-full`} />
      <textarea name="content_richtext" placeholder="Full story content (HTML or Markdown)" rows={6} className={`${inputClass} w-full`} />
      <input name="tags" placeholder="Tags (comma separated)" className={`${inputClass} w-full`} />

      <button type="button" onClick={() => setShowSeo((v) => !v)} className="text-xs text-neutral-400 underline">
        {showSeo ? "Hide" : "Show"} SEO fields
      </button>
      {showSeo && (
        <div className="grid md:grid-cols-2 gap-3">
          <input name="seo_title" placeholder="SEO title" className={inputClass} />
          <input name="seo_description" placeholder="SEO description" className={inputClass} />
        </div>
      )}

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Story (Draft)"}
      </button>
    </form>
  );
}
