"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function Opening({
  invitation,
}: {
  invitation: any;
}) {

  const theme = useTheme();

  const heading =
    invitation?.openingHeading ||
    theme.opening.heading;

  const content =
    invitation?.openingContent ||
    theme.opening.content;

  return (

    <section
      className="
      relative
      py-10
      "
    >

      <div
        className="
        max-w-3xl
        mx-auto
        px-6
        text-center
        "
      >

        <img
          src={theme.opening.ornament}
          alt=""
          className="
          w-56
          mx-auto
          mb-2
          "
        />

        <p
          className={`
          text-lg
          ${theme.text.primary}
          `}
        >
          {heading}
        </p>

        <img
          src={theme.opening.ornament}
          alt=""
          className="
          w-56
          mx-auto
          my-2
          "
        />

        <p
          className={`
          mt-6
          text-[22px]
          leading-loose
          whitespace-pre-line
          ${theme.text.body}
          ${theme.font.script}
          `}
        >
          {content}
        </p>

        <img
          src={theme.opening.ornament}
          alt=""
          className="
          w-56
          mx-auto
          mt-6
          "
        />

      </div>

    </section>

  );

}