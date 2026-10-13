"use client";

import Image from "next/image";
import { useState } from "react";

import PhotoLightbox from "./PhotoLightbox";

type GalleryPhoto = {
  id: string;
  image_url: string;
};

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  shopName: string;
};

export default function PhotoGallery({
  photos,
  shopName,
}: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${shopName} photo ${index + 1}`}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-white dark:bg-stone-900"
          >
            <Image
              src={photo.image_url}
              alt={`${shopName} photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={activeIndex}
          shopName={shopName}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}