"use client";

import { useRef, useState } from "react";
import { getUploadSignature } from "@/actions/media/cloudinary-signature";
import { saveMediaRecord, type CloudinaryUploadResult } from "@/actions/media";
import type { CloudinaryFolder } from "@/lib/cloudinary/server";

/**
 * Uploads directly from the admin's browser to Cloudinary using a
 * server-issued signature (the API secret never reaches the client), then
 * records the result in Supabase. Supports multi-file selection.
 */
export default function MediaUploader({ folder }: { folder: CloudinaryFolder }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadOne(file: File) {
    const { timestamp, signature, apiKey, cloudName, folder: signedFolder } =
      await getUploadSignature(folder);

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", apiKey!);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature);
    body.append("folder", signedFolder);

    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body,
    });

    if (!res.ok) throw new Error(`Cloudinary upload failed for ${file.name}`);
    const json = await res.json();

    const upload: CloudinaryUploadResult = {
      public_id: json.public_id,
      secure_url: json.secure_url,
      resource_type: resourceType,
      format: json.format,
      width: json.width ?? 0,
      height: json.height ?? 0,
      bytes: json.bytes ?? 0,
      folder: signedFolder,
    };

    await saveMediaRecord(upload);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadOne(files[i]);
        setProgress({ done: i + 1, total: files.length });
      }
      window.location.reload(); // simplest way to reflect new rows; revalidatePath already ran server-side
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      className="border border-dashed border-neutral-700 rounded-sm p-8 text-center"
    >
      <p className="text-sm text-neutral-400 mb-3">
        Drag and drop photos or videos here, or
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isUploading
          ? `Uploading ${progress?.done ?? 0}/${progress?.total ?? 0}…`
          : "Choose files"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
    </div>
  );
}
