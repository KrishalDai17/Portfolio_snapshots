import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // server-only, never exposed to the client
  secure: true,
});

export { cloudinary };

export type CloudinaryFolder =
  | "dr-dslr/portfolio"
  | "dr-dslr/albums"
  | "dr-dslr/hero"
  | "dr-dslr/profile"
  | "dr-dslr/stories"
  | "dr-dslr/services"
  | "dr-dslr/testimonials"
  | "dr-dslr/videos";

/**
 * Generates a short-lived signature the admin's browser can use to upload
 * directly to Cloudinary (unsigned uploads are never used — this keeps the
 * API secret server-side while avoiding routing large files through Vercel).
 */
export function generateUploadSignature(folder: CloudinaryFolder) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

export async function destroyAsset(publicId: string, resourceType: "image" | "video") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
