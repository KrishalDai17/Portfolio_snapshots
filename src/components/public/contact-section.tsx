import { createClient } from "@/lib/supabase/server";
import ContactForm from "./contact-form";

export default async function ContactSection() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("whatsapp_number, whatsapp_message, contact_email")
    .maybeSingle();

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-neutral-950">
      <h2 className="font-serif text-3xl mb-4 text-center">Request a Quote</h2>
      <p className="text-center text-neutral-400 mb-10">
        Tell me a little about your event and I&apos;ll get back to you.
      </p>
      <div className="max-w-xl mx-auto">
        <ContactForm />
        {settings?.whatsapp_number && (
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
              settings.whatsapp_message ?? "Hello Himal, I would like to inquire about photography for my event."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block text-center text-sm text-[#c9a24b] underline"
          >
            Or message on WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
