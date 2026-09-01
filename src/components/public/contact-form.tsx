"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryFormState } from "@/actions/inquiries/create";

const initialState: InquiryFormState = { success: false, error: null };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState);

  if (state.success) {
    return (
      <p className="text-center text-[#c9a24b] py-8">
        Thank you — your inquiry has been received. Himal will be in touch soon.
      </p>
    );
  }

  const inputClass =
    "w-full rounded-sm bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b] transition-colors";

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" placeholder="Name" required className={inputClass} />
        <input name="email" type="email" placeholder="Email" required className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="phone" placeholder="Phone" className={inputClass} />
        <input name="whatsapp" placeholder="WhatsApp" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="event_type" placeholder="Event type" className={inputClass} />
        <input name="event_date" type="date" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="location" placeholder="Location" className={inputClass} />
        <input name="budget" placeholder="Budget (optional)" className={inputClass} />
      </div>
      <textarea name="message" placeholder="Tell me about your event…" rows={4} className={inputClass} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-sm bg-[#c9a24b] text-black font-medium py-3 hover:bg-[#d8b566] transition-colors disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Request a Quote"}
      </button>
    </form>
  );
}
