"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const TestimonialSchema = z.object({
  client_name: z.string().min(1, "Client name is required").max(200),
  review: z.string().min(1, "Review is required").max(2000),
  rating: z.coerce.number().min(1).max(5).optional(),
  event_type: z.string().max(100).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  client_media_id: z.string().uuid().optional().or(z.literal("")),
});

export type TestimonialFormState = { error: string | null };

export async function createTestimonial(
  _prev: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const parsed = TestimonialSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const supabase = await createClient();
  const { count } = await supabase.from("testimonials").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("testimonials").insert({
    client_name: parsed.data.client_name,
    review: parsed.data.review,
    rating: parsed.data.rating || null,
    event_type: parsed.data.event_type || null,
    event_date: parsed.data.event_date || null,
    client_media_id: parsed.data.client_media_id || null,
    sort_order: count ?? 0,
  });

  if (error) return { error: "Could not add testimonial." };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function togglePublished(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("testimonials").update({ is_published: value }).eq("id", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
