"use server";

import { generateUploadSignature, type CloudinaryFolder } from "@/lib/cloudinary/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns a short-lived signature so the ADMIN'S browser can upload directly
 * to Cloudinary (keeps large files off Vercel's serverless functions).
 * Requires an authenticated admin session — the RLS-bound client read below
 * doubles as an auth check since admin_profile is only readable by the admin.
 */
export async function getUploadSignature(folder: CloudinaryFolder) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data: adminRow } = await supabase.from("admin_profile").select("id").eq("id", user.id).maybeSingle();
  if (!adminRow) throw new Error("Not authorized.");

  return generateUploadSignature(folder);
}
