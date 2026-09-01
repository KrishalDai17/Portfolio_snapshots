"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

const ServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  media_id: z.string().uuid().optional().or(z.literal("")),
  price_label: z.string().max(100).optional().or(z.literal("")),
  show_price: z.coerce.boolean().optional(),
  cta_label: z.string().max(60).optional().or(z.literal("")),
  cta_url: z.string().max(300).optional().or(z.literal("")),
});

export type ServiceFormState = { error: string | null };

export async function createService(_prev: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
  const parsed = ServiceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase.from("services").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("services").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    description: parsed.data.description || null,
    media_id: parsed.data.media_id || null,
    price_label: parsed.data.price_label || null,
    show_price: Boolean(parsed.data.show_price),
    cta_label: parsed.data.cta_label || "Request a Quote",
    cta_url: parsed.data.cta_url || "/#contact",
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not create service." };

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { error: null };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function toggleServiceVisible(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("services").update({ is_visible: value }).eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function toggleServicePrice(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("services").update({ show_price: value }).eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function moveService(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("services").select("id, sort_order").order("sort_order", { ascending: true });
  if (!rows) return;
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const current = rows[index];
  const swap = rows[swapIndex];
  await Promise.all([
    supabase.from("services").update({ sort_order: swap.sort_order }).eq("id", current.id),
    supabase.from("services").update({ sort_order: current.sort_order }).eq("id", swap.id),
  ]);
  revalidatePath("/admin/services");
  revalidatePath("/");
}
