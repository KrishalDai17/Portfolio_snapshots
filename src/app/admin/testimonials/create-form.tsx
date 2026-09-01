"use client";

import { useActionState, useRef, useEffect } from "react";
import { createTestimonial, type TestimonialFormState } from "@/actions/testimonials";

const initialState: TestimonialFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

export default function CreateTestimonialForm() {
  const [state, formAction, isPending] = useActionState(createTestimonial, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="border border-neutral-800 p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input name="client_name" placeholder="Client name" required className={inputClass} />
        <input name="event_type" placeholder="Event type" className={inputClass} />
        <input name="event_date" type="date" className={inputClass} />
      </div>
      <textarea name="review" placeholder="Review" rows={3} required className={`${inputClass} w-full`} />
      <select name="rating" defaultValue="" className={inputClass}>
        <option value="">No rating</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Testimonial"}
      </button>
    </form>
  );
}
