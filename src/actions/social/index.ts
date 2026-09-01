"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { PLACEMENT_OPTIONS } from "@/lib/utils/social-placements";

const SocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required").max(50),
  label: z.string().max(100).optional().or(z.literal("")),
  url: z.string().url("Enter a valid URL"),
  placements: z.array(z.enum(PLACEMENT_OPTIONS)).min(1, "Choose at least one placement"),
});

export type SocialLinkFormState = { error: string | null };

export async function createSocialLink(_prev: SocialLinkFormState, formData: FormData): Promise<SocialLinkFormState> {
  const raw = {
    platform: formData.get("platform"),
    label: formData.get("label"),
    url: formData.get("url"),
    placements: formData.getAll("placements"),
  };
  const parsed = SocialLinkSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase.from("social_links").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("social_links").insert({
    platform: parsed.data.platform,
    label: parsed.data.label || null,
    url: parsed.data.url,
    placements: parsed.data.placements,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not add social link." };

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { error: null };
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();
  await supabase.from("social_links").delete().eq("id", id);
  revalidatePath("/admin/social");
  revalidatePath("/");
}

export async function toggleSocialLinkEnabled(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("social_links").update({ is_enabled: value }).eq("id", id);
  revalidatePath("/admin/social");
  revalidatePath("/");
}
