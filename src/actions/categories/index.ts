"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  slug: z.string().max(200).optional().or(z.literal("")),
});

export type CategoryFormState = { error: string | null };

/** Every write here runs through the RLS-bound client — Postgres itself
 * rejects the write if the session isn't the verified admin, so there's no
 * separate server-side role check needed beyond that. */
export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const parsed = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const { count } = await supabase.from("categories").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    slug,
    sort_order: count ?? 0,
  });

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: "Could not create category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { error: null };
}

export async function updateCategory(id: string, formData: FormData): Promise<CategoryFormState> {
  const parsed = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const { error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name, description: parsed.data.description || null, slug })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: "Could not update category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function toggleCategoryVisibility(id: string, isVisible: boolean) {
  const supabase = await createClient();
  await supabase.from("categories").update({ is_visible: isVisible }).eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

/** Swaps sort_order with the adjacent row in the given direction. */
export async function moveCategory(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;

  const current = rows[index];
  const swap = rows[swapIndex];

  await Promise.all([
    supabase.from("categories").update({ sort_order: swap.sort_order }).eq("id", current.id),
    supabase.from("categories").update({ sort_order: current.sort_order }).eq("id", swap.id),
  ]);

  revalidatePath("/admin/categories");
  revalidatePath("/");
}
