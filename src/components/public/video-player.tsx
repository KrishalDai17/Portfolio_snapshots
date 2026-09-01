import { cldVideoUrl, cldImageUrl } from "@/lib/cloudinary/url";
import { youtubeEmbedUrl, vimeoEmbedUrl } from "@/lib/utils/video-embed";

type Props = {
  sourceType: "cloudinary" | "youtube" | "vimeo";
  publicId?: string | null;
  externalUrl?: string | null;
  thumbnailPublicId?: string | null;
  title: string;
};

export default function VideoPlayer({ sourceType, publicId, externalUrl, thumbnailPublicId, title }: Props) {
  if (sourceType === "cloudinary" && publicId) {
    return (
      <video
        controls
        preload="metadata"
        poster={thumbnailPublicId ? cldImageUrl(thumbnailPublicId, { width: 1200 }) : undefined}
        className="w-full h-full object-cover"
      >
        <source src={cldVideoUrl(publicId)} type="video/mp4" />
      </video>
    );
  }

  const embedUrl =
    sourceType === "youtube" && externalUrl
      ? youtubeEmbedUrl(externalUrl)
      : sourceType === "vimeo" && externalUrl
      ? vimeoEmbedUrl(externalUrl)
      : null;

  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={title}
      allow="fullscreen; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
}
