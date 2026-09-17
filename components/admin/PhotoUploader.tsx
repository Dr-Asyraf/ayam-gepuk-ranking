"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PhotoUploaderProps = {
  shopId: string;
};

export default function PhotoUploader({ shopId }: PhotoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setMessage("");

    // Create preview
    const previewUrl = URL.createObjectURL(selectedFile);

    setPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const supabase = createClient();

      /*
       * Generate a unique filename.
       *
       * Example:
       * shop-id/1726501234567-photo.jpg
       */
      const fileExtension = file.name.split(".").pop();

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `${shopId}/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("shop-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("PHOTO UPLOAD ERROR:", uploadError);

        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("shop-photos")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      /*
       * Make all existing photos for this shop
       * non-primary.
       */
      const { error: updateError } = await supabase
        .from("photos")
        .update({
          is_primary: false,
        })
        .eq("shop_id", shopId);

      if (updateError) {
        console.error("PHOTO UPDATE ERROR:", updateError);

        throw new Error(updateError.message);
      }

      // Insert the new photo
      const { error: insertError } = await supabase.from("photos").insert({
        shop_id: shopId,
        image_url: imageUrl,
        caption: caption.trim() || null,
        is_primary: true,
      });

      if (insertError) {
        console.error("PHOTO DATABASE ERROR:", insertError);

        throw new Error(insertError.message);
      }

      setMessage("Photo uploaded successfully!");

      setFile(null);
      setPreview(null);
      setCaption("");

      // Refresh the page so the new photo appears
      window.location.reload();
    } catch (error) {
      console.error("PHOTO UPLOAD FAILED:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to upload photo.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-bold">Shop Photo</h2>

      <p className="mt-1 text-sm text-gray-500">
        Upload a photo for this shop. The latest uploaded photo will become the
        primary photo.
      </p>

      {/* File input */}
      <div className="mt-5">
        <label htmlFor="shop-photo" className="block text-sm font-medium">
          Choose image
        </label>

        <input
          id="shop-photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm"
        />

        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG, WebP etc. Maximum 5 MB.
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Preview</p>

          <img
            src={preview}
            alt="Preview"
            className="max-h-80 w-full rounded-xl object-cover"
          />
        </div>
      )}

      {/* Caption */}
      <div className="mt-5">
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption
        </label>

        <input
          id="caption"
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="e.g. Ayam gepuk with sambal"
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
        />
      </div>

      {/* Upload button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload photo"}
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
