"use client";

import { useActionState, useRef, useEffect } from "react";
import { createSocialLink, type SocialLinkFormState } from "@/actions/social";
import { PLACEMENT_OPTIONS } from "@/lib/utils/social-placements";

const initialState: SocialLinkFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

const PLATFORMS = ["instagram", "facebook", "tiktok", "youtube", "whatsapp", "messenger", "viber", "email", "phone"];

export default function CreateSocialLinkForm() {
  const [state, formAction, isPending] = useActionState(createSocialLink, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <select name="platform" required className={inputClass}>
          <option value="">Choose platform…</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input name="label" placeholder="Display label (optional)" className={inputClass} />
        <input name="url" placeholder="https://…" required className={inputClass} />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-1.5">Show this link in:</p>
        <div className="flex flex-wrap gap-3">
          {PLACEMENT_OPTIONS.map((p) => (
            <label key={p} className="flex items-center gap-1.5 text-xs text-neutral-400">
              <input type="checkbox" name="placements" value={p} />
              {p}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Link"}
      </button>
    </form>
  );
}
