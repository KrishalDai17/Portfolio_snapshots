import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select(
      "brand_name, tagline, whatsapp_number, whatsapp_message, contact_email, contact_phone, contact_location, seo_default_title, seo_default_description"
    )
    .maybeSingle();

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
