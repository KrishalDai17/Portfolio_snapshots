"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

const StorySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(200).optional().or(z.literal("")),
  intro: z.string().max(1000).optional().or(z.literal("")),
  content_richtext: z.string().max(20000).optional().or(z.literal("")),
  cover_media_id: z.string().uuid().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  story_date: z.string().optional().or(z.literal("")),
  tags: z.string().max(500).optional().or(z.literal("")),
  seo_title: z.string().max(200).optional().or(z.literal("")),
  seo_description: z.string().max(300).optional().or(z.literal("")),
});

export type StoryFormState = { error: string | null };

export async function createStory(_prev: StoryFormState, formData: FormData): Promise<StoryFormState> {
  const parsed = StorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  const tags = parsed.data.tags ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("stories").insert({
    title: parsed.data.title,
    slug,
    intro: parsed.data.intro || null,
    content_richtext: parsed.data.content_richtext || null,
    cover_media_id: parsed.data.cover_media_id || null,
    location: parsed.data.location || null,
    story_date: parsed.data.story_date || null,
    tags,
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
  });

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: "Could not create story." };
  }

  revalidatePath("/admin/stories");
  revalidatePath("/");
  return { error: null };
}

export async function deleteStory(id: string) {
  const supabase = await createClient();
  await supabase.from("stories").delete().eq("id", id);
  revalidatePath("/admin/stories");
  revalidatePath("/");
}

export async function togglePublished(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("stories").update({ is_published: value }).eq("id", id);
  revalidatePath("/admin/stories");
  revalidatePath("/");
}
