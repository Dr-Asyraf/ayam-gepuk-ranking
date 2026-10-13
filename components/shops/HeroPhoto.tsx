"use client";

import Image from "next/image";
import { useState } from "react";

import PhotoLightbox from "./PhotoLightbox";

type HeroPhotoProps = {
  photos: { id: string; image_url: string }[];
  shopName: string;
};

export default function HeroPhoto({ photos, shopName }: HeroPhotoProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${shopName} photo fullscreen`}
        className="group relative block h-full w-full"
      >
        <Image
          src={photos[0].image_url}
          alt={shopName}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Zoom hint */}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
      </button>

      {open && (
        <PhotoLightbox
          photos={photos}
          initialIndex={0}
          shopName={shopName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}