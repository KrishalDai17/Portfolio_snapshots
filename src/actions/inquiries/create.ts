"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const InquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(50).optional().or(z.literal("")),
  whatsapp: z.string().max(50).optional().or(z.literal("")),
  event_type: z.string().max(200).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  budget: z.string().max(200).optional().or(z.literal("")),
  service_id: z.string().uuid().optional().or(z.literal("")),
  message: z.string().max(5000).optional().or(z.literal("")),
});

export type InquiryFormState = {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string>;
};

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = InquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    event_type: parsed.data.event_type || null,
    event_date: parsed.data.event_date || null,
    location: parsed.data.location || null,
    budget: parsed.data.budget || null,
    service_id: parsed.data.service_id || null,
    message: parsed.data.message || null,
  });

  if (error) {
    // Don't leak internal DB errors to the visitor.
    return { success: false, error: "Something went wrong. Please try again or reach out via WhatsApp." };
  }

  return { success: true, error: null };
}
