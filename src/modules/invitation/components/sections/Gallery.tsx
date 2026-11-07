"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

interface GalleryProps {
  gallery: string[];
}

export default function Gallery({
  gallery,
}: GalleryProps) {

const theme = useTheme();

  const {
    gallery: galleryTheme,
    font,
    text,
  } = theme;

  if (!gallery?.length) return null;

  return (

    <section
    id="gallery"
      className="
      py-4
      px-5
      relative
      overflow-hidden
      "
    >

      {/* Divider Atas */}
      <img
        src={galleryTheme.divider}
        alt=""
        className="
        w-56
        mx-auto
        opacity-90
        mb-6
        "
      />

      <h2
        className={`
        text-4xl
        md:text-5xl
        text-center
        mb-16
        ${font.title}
        ${text.primary}
        `}
      >
        {galleryTheme.title}
      </h2>

      <div
        className="
        max-w-6xl
        mx-auto
        grid
        md:grid-cols-3
        gap-6
        "
      >

        {gallery.map((image) => (

          <div
            key={image}
            className={`
            overflow-hidden
            rounded-3xl
            ${galleryTheme.card}
            `}
          >

            <img
              src={image}
              alt=""
              className="
              w-full
              h-full
              object-cover
              transition
              duration-700
              hover:scale-110
              "
            />

          </div>

        ))}

      </div>

      {/* Divider Bawah */}
      <img
        src={galleryTheme.divider}
        alt=""
        className="
        w-56
        mx-auto
        opacity-90
        mt-16
        "
      />

    </section>

  );
}