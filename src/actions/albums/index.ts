"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

const AlbumSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(3000).optional().or(z.literal("")),
  category_id: z.string().uuid().optional().or(z.literal("")),
  cover_media_id: z.string().uuid().optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
});

export type AlbumFormState = { error: string | null };

export async function createAlbum(_prev: AlbumFormState, formData: FormData): Promise<AlbumFormState> {
  const parsed = AlbumSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  const { count } = await supabase.from("albums").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("albums").insert({
    title: parsed.data.title,
    slug,
    description: parsed.data.description || null,
    category_id: parsed.data.category_id || null,
    cover_media_id: parsed.data.cover_media_id || null,
    event_date: parsed.data.event_date || null,
    sort_order: count ?? 0,
  });

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: "Could not create album." };
  }

  revalidatePath("/admin/albums");
  revalidatePath("/");
  return { error: null };
}

export async function updateAlbum(id: string, formData: FormData): Promise<AlbumFormState> {
  const parsed = AlbumSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);

  const { error } = await supabase
    .from("albums")
    .update({
      title: parsed.data.title,
      slug,
      description: parsed.data.description || null,
      category_id: parsed.data.category_id || null,
      cover_media_id: parsed.data.cover_media_id || null,
      event_date: parsed.data.event_date || null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: "Could not update album." };
  }

  revalidatePath("/admin/albums");
  revalidatePath("/");
  revalidatePath(`/albums/${slug}`);
  return { error: null };
}

export async function deleteAlbum(id: string) {
  const supabase = await createClient();
  await supabase.from("albums").delete().eq("id", id);
  revalidatePath("/admin/albums");
  revalidatePath("/");
}

export async function togglePublished(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("albums").update({ is_published: value }).eq("id", id);
  revalidatePath("/admin/albums");
  revalidatePath("/");
}

export async function toggleHidden(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("albums").update({ is_hidden: value }).eq("id", id);
  revalidatePath("/admin/albums");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("albums").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/albums");
  revalidatePath("/");
}
