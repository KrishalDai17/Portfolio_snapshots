"use client";

import { useActionState } from "react";
import { updateAboutProfile, type ProfileFormState } from "@/actions/about";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: ProfileFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b] w-full";

type Props = {
  intro: string;
  profileMediaId: string | null;
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
};

export default function ProfileForm({ intro, profileMediaId, mediaOptions }: Props) {
  const [state, formAction, isPending] = useActionState(updateAboutProfile, initialState);

  return (
    <form action={formAction} className="border border-neutral-800 p-4 space-y-3 max-w-2xl">
      <MediaPickerSelect name="profile_media_id" defaultValue={profileMediaId} options={mediaOptions} />
      <textarea name="intro" placeholder="Introduction" rows={4} defaultValue={intro} className={inputClass} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-[#c9a24b]">Saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
