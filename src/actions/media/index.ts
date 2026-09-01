"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { destroyAsset } from "@/lib/cloudinary/server";

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
};

/** Persists Cloudinary's response as a reusable media row. Called right
 * after a successful direct-to-Cloudinary browser upload. */
export async function saveMediaRecord(upload: CloudinaryUploadResult, altText?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .insert({
      public_id: upload.public_id,
      secure_url: upload.secure_url,
      resource_type: upload.resource_type,
      format: upload.format,
      width: upload.width,
      height: upload.height,
      bytes: upload.bytes,
      folder: upload.folder,
      alt_text: altText ?? null,
    })
    .select("id, public_id, secure_url, resource_type, folder, alt_text, created_at")
    .single();

  if (error) throw new Error("Could not save media record.");

  revalidatePath("/admin/media");
  return data;
}

/** Deletes from Cloudinary AND Supabase. If anything currently references
 * this media row via a foreign key, the delete is safely rejected by
 * Postgres — reassign or remove those references first. */
export async function deleteMedia(id: string, publicId: string, resourceType: "image" | "video") {
  const supabase = await createClient();

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    return { error: "This media is still in use elsewhere on the site — remove those references first." };
  }

  await destroyAsset(publicId, resourceType);
  revalidatePath("/admin/media");
  return { error: null };
}

export async function updateMediaAltText(id: string, altText: string) {
  const supabase = await createClient();
  await supabase.from("media").update({ alt_text: altText }).eq("id", id);
  revalidatePath("/admin/media");
}
