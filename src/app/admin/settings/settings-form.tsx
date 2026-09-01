"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsFormState } from "@/actions/settings";

const initialState: SettingsFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b] w-full";

type Settings = {
  brand_name: string;
  tagline: string;
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_location: string | null;
  seo_default_title: string | null;
  seo_default_description: string | null;
} | null;

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500">Brand</h2>
        <input name="brand_name" placeholder="Brand name" defaultValue={settings?.brand_name ?? "DR DSLR"} className={inputClass} />
        <input name="tagline" placeholder="Tagline" defaultValue={settings?.tagline ?? ""} className={inputClass} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500">Contact</h2>
        <input name="whatsapp_number" placeholder="WhatsApp number (with country code, digits only)" defaultValue={settings?.whatsapp_number ?? ""} className={inputClass} />
        <input name="whatsapp_message" placeholder="Prefilled WhatsApp message" defaultValue={settings?.whatsapp_message ?? ""} className={inputClass} />
        <input name="contact_email" type="email" placeholder="Contact email" defaultValue={settings?.contact_email ?? ""} className={inputClass} />
        <input name="contact_phone" placeholder="Contact phone" defaultValue={settings?.contact_phone ?? ""} className={inputClass} />
        <input name="contact_location" placeholder="Location" defaultValue={settings?.contact_location ?? ""} className={inputClass} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500">Default SEO</h2>
        <input name="seo_default_title" placeholder="Default SEO title" defaultValue={settings?.seo_default_title ?? ""} className={inputClass} />
        <textarea name="seo_default_description" placeholder="Default SEO description" rows={2} defaultValue={settings?.seo_default_description ?? ""} className={inputClass} />
      </section>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-[#c9a24b]">Settings saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
