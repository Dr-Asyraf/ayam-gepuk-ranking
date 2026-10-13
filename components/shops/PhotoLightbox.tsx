"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type LightboxPhoto = {
  id: string;
  image_url: string;
};

type PhotoLightboxProps = {
  photos: LightboxPhoto[];
  initialIndex: number;
  shopName: string;
  onClose: () => void;
};

export default function PhotoLightbox({
  photos,
  initialIndex,
  shopName,
  onClose,
}: PhotoLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const step = useCallback(
    (delta: number) => {
      setActiveIndex(
        (current) => (current + delta + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "ArrowRight") {
        step(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${shopName} photo ${activeIndex + 1} of ${photos.length}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-10"
    >
      {/* Image */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative h-full w-full max-w-5xl"
      >
        <Image
          src={activePhoto.image_url}
          alt={`${shopName} photo ${activeIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
      >
        ✕
      </button>

      {/* Navigation */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20 sm:left-4"
          >
            ←
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20 sm:right-4"
          >
            →
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            {activeIndex + 1} / {photos.length}
          </p>
        </>
      )}
    </div>
  );
}