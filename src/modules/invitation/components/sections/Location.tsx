"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function LuxuryBlackLocation({
  mapsUrl,
  akadPlace,
  resepsiPlace,
}: {
  mapsUrl: string;
  akadPlace?: string;
  resepsiPlace?: string;
}) {

  const theme = useTheme();
  return (
    <section id="location" className="relative py-10 overflow-hidden">

      <div className="max-w-4xl mx-auto px-6 text-center">

        <div className="relative w-40 h-40 mx-auto mb-6">

          <img
            src={theme.location.frame}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span
  className={`
  text-4xl
  ${theme.location.iconColor}
  `}
>
  {theme.location.icon}
</span>
          </div>

        </div>

        <h2
className={`
text-4xl
${theme.font.title}
${theme.text.primary}
`}
>
  {theme.location.title}
</h2>

        <img
          src={theme.location.divider}
          alt=""
          className="w-56 mx-auto my-6"
        />

        <div
          className={theme.location.card}
        >

          {resepsiPlace && (
            <p className={`
text-2xl
md:text-2xl
${theme.font.script}
${theme.location.place}
`}>
              {resepsiPlace}
            </p>
          )}

        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={theme.location.button}
        >
          Buka Google Maps
        </a>

        <img
          src={theme.location.divider}
          alt=""
          className="w-56 mx-auto mt-10"
        />

      </div>

    </section>
  );
}