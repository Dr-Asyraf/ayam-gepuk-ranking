"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Photo = {
  id: string;
  image_url: string;
  caption: string | null;
  is_primary: boolean;
  created_at: string;
};

type PhotoManagerProps = {
  shopId: string;
  photos: Photo[];
};

export default function PhotoManager({
  shopId,
  photos: initialPhotos,
}: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const supabase = createClient();

      /*
       * Basic validation
       */

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5MB.");
      }

      /*
       * Create unique filename
       */

      const extension = file.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `${shopId}/${fileName}`;

      /*
       * Upload image
       */

      const { error: uploadError } = await supabase.storage
        .from("shop-photos")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      /*
       * Get public URL
       */

      const { data: publicUrlData } = supabase.storage
        .from("shop-photos")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      /*
       * If this is the first photo,
       * make it primary automatically.
       */

      const isPrimary = photos.length === 0;

      /*
       * Insert database record
       */

      const { data: photo, error: databaseError } = await supabase
        .from("photos")
        .insert({
          shop_id: shopId,
          image_url: imageUrl,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (databaseError) {
        /*
         * If DB insert fails, remove
         * the uploaded file as cleanup.
         */

        await supabase.storage.from("shop-photos").remove([filePath]);

        throw new Error(databaseError.message);
      }

      setPhotos((current) => [photo, ...current]);

      setMessage("Photo uploaded successfully.");

      event.target.value = "";
    } catch (error) {
      console.error("PHOTO UPLOAD ERROR:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to upload photo.",
      );
    } finally {
      setUploading(false);
    }
  };

  /*
   * Set primary photo
   */

  const handleSetPrimary = async (photoId: string) => {
    setMessage("");

    try {
      const supabase = createClient();

      /*
       * Remove primary from all photos
       */

      const { error: resetError } = await supabase
        .from("photos")
        .update({
          is_primary: false,
        })
        .eq("shop_id", shopId);

      if (resetError) {
        throw new Error(resetError.message);
      }

      /*
       * Set selected photo as primary
       */

      const { error: primaryError } = await supabase
        .from("photos")
        .update({
          is_primary: true,
        })
        .eq("id", photoId);

      if (primaryError) {
        throw new Error(primaryError.message);
      }

      setPhotos((current) =>
        current.map((photo) => ({
          ...photo,
          is_primary: photo.id === photoId,
        })),
      );

      setMessage("Primary photo updated.");
    } catch (error) {
      console.error("SET PRIMARY ERROR:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to set primary photo.",
      );
    }
  };

  /*
   * Delete photo
   */

  const handleDelete = async (photo: Photo) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const supabase = createClient();

      /*
       * Extract storage path from URL
       */

      const marker = "/shop-photos/";

      const markerIndex = photo.image_url.indexOf(marker);

      const filePath =
        markerIndex >= 0
          ? photo.image_url.substring(markerIndex + marker.length)
          : null;

      /*
       * Delete database record
       */

      const { error: databaseError } = await supabase
        .from("photos")
        .delete()
        .eq("id", photo.id);

      if (databaseError) {
        throw new Error(databaseError.message);
      }

      /*
       * Delete storage file
       */

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("shop-photos")
          .remove([filePath]);

        if (storageError) {
          console.error("STORAGE DELETE ERROR:", storageError);
        }
      }

      setPhotos((current) => current.filter((item) => item.id !== photo.id));

      setMessage("Photo deleted.");
    } catch (error) {
      console.error("DELETE PHOTO ERROR:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to delete photo.",
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-bold">Upload photo</h2>

        <p className="mt-1 text-sm text-stone-500">
          JPG, PNG or other image formats. Maximum 5MB.
        </p>

        <label className="mt-5 inline-flex cursor-pointer rounded-xl bg-orange-600 px-5 py-3 font-medium text-white hover:bg-orange-700">
          {uploading ? "Uploading..." : "Choose image"}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-xl border bg-white p-4 text-sm">{message}</div>
      )}

      {/* Photos */}
      <div>
        <h2 className="text-lg font-bold">Photos</h2>

        {photos.length === 0 ? (
          <div className="mt-4 rounded-2xl border bg-white p-8 text-center">
            <p className="text-stone-500">No photos yet.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl border bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={photo.image_url}
                    alt={photo.caption ?? "Shop photo"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  {photo.is_primary && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Primary photo
                    </span>
                  )}

                  <div className="mt-4 flex gap-2">
                    {!photo.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(photo.id)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-stone-100"
                      >
                        Set primary
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(photo)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
