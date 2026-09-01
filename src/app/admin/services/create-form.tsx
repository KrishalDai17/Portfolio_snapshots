"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createService, type ServiceFormState } from "@/actions/services";
import MediaPickerSelect from "@/components/admin/media-picker-select";

const initialState: ServiceFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

export default function CreateServiceForm({
  mediaOptions,
}: {
  mediaOptions: { id: string; public_id: string; alt_text: string | null }[];
}) {
  const [state, formAction, isPending] = useActionState(createService, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" placeholder="Service title" required className={inputClass} />
        <MediaPickerSelect name="media_id" options={mediaOptions} />
      </div>
      <textarea name="description" placeholder="Description" rows={2} className={`${inputClass} w-full`} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            name="show_price"
            value="true"
            checked={showPrice}
            onChange={(e) => setShowPrice(e.target.checked)}
          />
          Show price publicly
        </label>
        {showPrice && <input name="price_label" placeholder="Price label (e.g. From NPR 25,000)" className={inputClass} />}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="cta_label" placeholder="CTA label (default: Request a Quote)" className={inputClass} />
        <input name="cta_url" placeholder="CTA link (default: /#contact)" className={inputClass} />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Service"}
      </button>
    </form>
  );
}
