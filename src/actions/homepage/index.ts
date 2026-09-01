"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Homepage sections: enable/disable + reorder
// ---------------------------------------------------------------------------

export async function toggleSectionEnabled(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("homepage_sections").update({ is_enabled: value }).eq("id", id);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function moveSection(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("homepage_sections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;

  const current = rows[index];
  const swap = rows[swapIndex];

  await Promise.all([
    supabase.from("homepage_sections").update({ sort_order: swap.sort_order }).eq("id", current.id),
    supabase.from("homepage_sections").update({ sort_order: current.sort_order }).eq("id", swap.id),
  ]);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Hero slides: full CRUD
// ---------------------------------------------------------------------------

const HeroSlideSchema = z.object({
  media_id: z.string().uuid("Choose an image for this slide."),
  heading: z.string().max(200).optional().or(z.literal("")),
  subtitle: z.string().max(300).optional().or(z.literal("")),
  cta_label: z.string().max(60).optional().or(z.literal("")),
  cta_url: z.string().max(300).optional().or(z.literal("")),
  duration_ms: z.coerce.number().min(1000).max(30000).optional(),
});

export type HeroSlideFormState = { error: string | null };

export async function createHeroSlide(
  _prev: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  const parsed = HeroSlideSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase.from("hero_slides").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("hero_slides").insert({
    media_id: parsed.data.media_id,
    heading: parsed.data.heading || null,
    subtitle: parsed.data.subtitle || null,
    cta_label: parsed.data.cta_label || null,
    cta_url: parsed.data.cta_url || null,
    duration_ms: parsed.data.duration_ms || 6000,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not create hero slide." };

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { error: null };
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();
  await supabase.from("hero_slides").delete().eq("id", id);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function toggleHeroSlideEnabled(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("hero_slides").update({ is_enabled: value }).eq("id", id);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function moveHeroSlide(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("hero_slides")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;

  const current = rows[index];
  const swap = rows[swapIndex];

  await Promise.all([
    supabase.from("hero_slides").update({ sort_order: swap.sort_order }).eq("id", current.id),
    supabase.from("hero_slides").update({ sort_order: current.sort_order }).eq("id", swap.id),
  ]);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}
