"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PhotoSchema = z.object({
  media_id: z.string().uuid("Choose a photo from the media library."),
  title: z.string().max(200).optional().or(z.literal("")),
  caption: z.string().max(500).optional().or(z.literal("")),
  alt_text: z.string().max(300).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  taken_at: z.string().optional().or(z.literal("")),
  category_id: z.string().uuid().optional().or(z.literal("")),
  album_id: z.string().uuid().optional().or(z.literal("")),
  camera: z.string().max(100).optional().or(z.literal("")),
  lens: z.string().max(100).optional().or(z.literal("")),
  aperture: z.string().max(20).optional().or(z.literal("")),
  shutter_speed: z.string().max(20).optional().or(z.literal("")),
  iso: z.string().max(20).optional().or(z.literal("")),
  tags: z.string().max(500).optional().or(z.literal("")),
});

export type PhotoFormState = { error: string | null };

export async function createPhoto(_prev: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  const parsed = PhotoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase.from("photos").select("id", { count: "exact", head: true });

  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("photos").insert({
    media_id: parsed.data.media_id,
    title: parsed.data.title || null,
    caption: parsed.data.caption || null,
    alt_text: parsed.data.alt_text || null,
    location: parsed.data.location || null,
    taken_at: parsed.data.taken_at || null,
    category_id: parsed.data.category_id || null,
    album_id: parsed.data.album_id || null,
    camera: parsed.data.camera || null,
    lens: parsed.data.lens || null,
    aperture: parsed.data.aperture || null,
    shutter_speed: parsed.data.shutter_speed || null,
    iso: parsed.data.iso || null,
    tags,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not add photo. It may already be attached to this media." };

  revalidatePath("/admin/photos");
  revalidatePath("/");
  return { error: null };
}

export async function deletePhoto(id: string) {
  const supabase = await createClient();
  await supabase.from("photos").delete().eq("id", id);
  revalidatePath("/admin/photos");
  revalidatePath("/");
}

export async function togglePhotoFeatured(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("photos").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/photos");
  revalidatePath("/");
}

export async function togglePhotoVisible(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("photos").update({ is_visible: value }).eq("id", id);
  revalidatePath("/admin/photos");
  revalidatePath("/");
}
