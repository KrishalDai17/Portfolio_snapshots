import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/public/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("whatsapp_number, whatsapp_message, contact_email, contact_phone, contact_location")
    .maybeSingle();

  return (
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-4xl text-center mb-4">Request a Quote</h1>
        <p className="text-center text-neutral-400 mb-10">
          Tell me a little about your event and I&apos;ll get back to you.
        </p>

        <ContactForm />

        <div className="mt-10 text-center space-y-2">
          {settings?.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
                settings.whatsapp_message ?? "Hello Himal, I would like to inquire about photography for my event."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#c9a24b] underline"
            >
              Message on WhatsApp
            </a>
          )}
          {settings?.contact_phone && <p className="text-sm text-neutral-400">Call: {settings.contact_phone}</p>}
          {settings?.contact_email && <p className="text-sm text-neutral-400">Email: {settings.contact_email}</p>}
          {settings?.contact_location && <p className="text-sm text-neutral-500">{settings.contact_location}</p>}
        </div>
      </div>
    </main>
  );
}
