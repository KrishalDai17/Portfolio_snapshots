"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

const VideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  source_type: z.enum(["cloudinary", "youtube", "vimeo"]),
  media_id: z.string().uuid().optional().or(z.literal("")),
  external_url: z.string().max(500).optional().or(z.literal("")),
  thumbnail_media_id: z.string().uuid().optional().or(z.literal("")),
  category_id: z.string().uuid().optional().or(z.literal("")),
});

export type VideoFormState = { error: string | null };

export async function createVideo(_prev: VideoFormState, formData: FormData): Promise<VideoFormState> {
  const parsed = VideoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (parsed.data.source_type === "cloudinary" && !parsed.data.media_id) {
    return { error: "Choose a video from the Media Library." };
  }
  if (parsed.data.source_type !== "cloudinary" && !parsed.data.external_url) {
    return { error: "Enter a YouTube or Vimeo URL." };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("videos").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("videos").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title) + "-" + Date.now().toString(36),
    description: parsed.data.description || null,
    source_type: parsed.data.source_type,
    media_id: parsed.data.source_type === "cloudinary" ? parsed.data.media_id : null,
    external_url: parsed.data.source_type !== "cloudinary" ? parsed.data.external_url : null,
    thumbnail_media_id: parsed.data.thumbnail_media_id || null,
    category_id: parsed.data.category_id || null,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not add film." };

  revalidatePath("/admin/films");
  revalidatePath("/");
  return { error: null };
}

export async function deleteVideo(id: string) {
  const supabase = await createClient();
  await supabase.from("videos").delete().eq("id", id);
  revalidatePath("/admin/films");
  revalidatePath("/");
}

export async function togglePublished(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("videos").update({ is_published: value }).eq("id", id);
  revalidatePath("/admin/films");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("videos").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/films");
  revalidatePath("/");
}

export async function createVideoCategory(name: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("video_categories").select("id", { count: "exact", head: true });
  await supabase.from("video_categories").insert({ name, slug: slugify(name), sort_order: count ?? 0 });
  revalidatePath("/admin/films");
}
