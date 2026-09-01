/**
 * Builds optimized Cloudinary delivery URLs client-safe (cloud name is
 * public by design). Never construct URLs using the API secret.
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type ImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | number;
};

export function cldImageUrl(publicId: string, opts: ImageOptions = {}) {
  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
  } = opts;

  const transforms = [
    "f_auto",
    `q_${quality}`,
    "dpr_auto",
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    width || height ? `c_${crop}` : null,
    (width || height) && crop === "fill" ? `g_${gravity}` : null,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export function cldVideoUrl(publicId: string, opts: { width?: number } = {}) {
  const transforms = ["f_auto", "q_auto", opts.width ? `w_${opts.width}` : null]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}`;
}

/** Responsive srcset for masonry gallery / hero images. */
export function cldSrcSet(publicId: string, widths: number[] = [480, 768, 1024, 1440, 1920]) {
  return widths.map((w) => `${cldImageUrl(publicId, { width: w })} ${w}w`).join(", ");
}
