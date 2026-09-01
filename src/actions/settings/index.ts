"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SettingsSchema = z.object({
  brand_name: z.string().max(100).optional().or(z.literal("")),
  tagline: z.string().max(200).optional().or(z.literal("")),
  whatsapp_number: z.string().max(30).optional().or(z.literal("")),
  whatsapp_message: z.string().max(300).optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().max(30).optional().or(z.literal("")),
  contact_location: z.string().max(200).optional().or(z.literal("")),
  seo_default_title: z.string().max(200).optional().or(z.literal("")),
  seo_default_description: z.string().max(300).optional().or(z.literal("")),
});

export type SettingsFormState = { error: string | null; success?: boolean };

export async function updateSettings(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      brand_name: parsed.data.brand_name || "DR DSLR",
      tagline: parsed.data.tagline || "Capturing Moments Beyond Vision",
      whatsapp_number: parsed.data.whatsapp_number || null,
      whatsapp_message: parsed.data.whatsapp_message || null,
      contact_email: parsed.data.contact_email || null,
      contact_phone: parsed.data.contact_phone || null,
      contact_location: parsed.data.contact_location || null,
      seo_default_title: parsed.data.seo_default_title || null,
      seo_default_description: parsed.data.seo_default_description || null,
    })
    .eq("id", true);

  if (error) return { error: "Could not save settings." };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: null, success: true };
}
