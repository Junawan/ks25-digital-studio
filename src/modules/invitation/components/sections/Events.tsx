"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

type EventsProps = {
  data: any;
};

export default function Events({
  data,
}: EventsProps) {

  const theme = useTheme();
  return (
    <section
    id="events"
className="
relative
py-10
px-5
overflow-hidden
"
>

      {/* Judul */}
      <div className="text-center mb-10">

        <img
  src={theme.events.titleDivider}
  alt=""
  className="
  w-72
  mx-auto
  mb-4
  opacity-90
  "
/>

        <h2
          className={`
text-4xl
md:text-5xl
${theme.font.title}
${theme.text.primary}
`}
        >
          Detail Acara
        </h2>

      </div>

      <div
        className="
        max-w-6xl
        mx-auto
        grid
        md:grid-cols-2
        gap-12
        mt-4
        "
      >

        {/* AKAD */}
        <div className="relative">

          <img
            src={theme.events.frame}
            alt=""
            className="
            w-full
            h-full
            object-contain
            "
          />

          <div
            className="
            absolute
            inset-0
            flex
            flex-col
            justify-center
            items-center
            text-center
            px-10
            -mt-6
            "
          >

            <h3
              className={`
tracking-[3px]
text-[22px]
${theme.font.title}
${theme.text.primary}
`}
            >
              Akad Nikah
            </h3>

            <div className={`
-mt-1
leading-tight
text-xl
${theme.font.script}
${theme.text.accent}
`}>

              <p>{data.akadDate}</p>

              <p>{data.akadTime}</p>

              <p>{data.akadPlace}</p>

            </div>

          </div>

        </div>

        {/* RESEPSI */}
        <div className="relative">

          <img
            src={theme.events.frame}
            alt=""
            className="
            w-full
            h-full
            object-contain
            "
          />

          <div
            className="
            absolute
            inset-0
            flex
            flex-col
            justify-center
            items-center
            text-center
            px-10
            -mt-6
            "
          >

            <h3
              className={`
tracking-[3px]
text-[22px]
${theme.font.title}
${theme.text.primary}
`}
            >
              Resepsi
            </h3>

            <div className={`
-mt-1
leading-tight
text-xl
${theme.font.script}
${theme.text.accent}
`}>

              <p>{data.resepsiDate}</p>

              <p>{data.resepsiTime}</p>

              <p>{data.resepsiPlace}</p>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-10 text-center">
  <img
    src={theme.events.bottomDivider}
    alt=""
    className="
    w-72
    mx-auto
    opacity-80
    "
  />
</div>

    </section>
  );
}