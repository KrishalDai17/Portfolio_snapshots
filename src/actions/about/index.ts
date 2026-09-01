"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ProfileSchema = z.object({
  intro: z.string().max(3000).optional().or(z.literal("")),
  profile_media_id: z.string().uuid().optional().or(z.literal("")),
});

export type ProfileFormState = { error: string | null; success?: boolean };

export async function updateAboutProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { error } = await supabase
  .from("about_profile")
  .upsert(
    {
      id: true,
      intro: parsed.data.intro || null,
      profile_media_id: parsed.data.profile_media_id || null,
    },
    { onConflict: "id" }
  );

  if (error) return { error: "Could not save profile." };

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { error: null, success: true };
}

const ItemSection = z.enum(["journey", "experience", "skill", "equipment", "award", "achievement"]);

const ItemSchema = z.object({
  section: ItemSection,
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  item_date: z.string().optional().or(z.literal("")),
  media_id: z.string().uuid().optional().or(z.literal("")),
  is_demo: z.coerce.boolean().optional(),
});

export type ItemFormState = { error: string | null };

export async function createAboutItem(_prev: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const parsed = ItemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase
    .from("about_items")
    .select("id", { count: "exact", head: true })
    .eq("section", parsed.data.section);

  const { error } = await supabase.from("about_items").insert({
    section: parsed.data.section,
    title: parsed.data.title,
    subtitle: parsed.data.subtitle || null,
    description: parsed.data.description || null,
    item_date: parsed.data.item_date || null,
    media_id: parsed.data.media_id || null,
    is_demo: Boolean(parsed.data.is_demo),
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not add item." };

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { error: null };
}

export async function deleteAboutItem(id: string) {
  const supabase = await createClient();
  await supabase.from("about_items").delete().eq("id", id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
}
