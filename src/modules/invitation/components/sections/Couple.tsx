"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

type CoupleProps = {
  data: any;
};

export default function Couple({
  data,
}: CoupleProps) {

  const theme = useTheme(); {
  return (
    <section
    id="couple"
className="
relative
py-8
px-5
overflow-hidden
"
>

  <img
  src={theme.couple.leftOrnament}
  alt=""
  className="
  absolute
  left-0
  top-32
  w-20
  md:w-28
  opacity-30
  pointer-events-none
  "
/>

<img
  src={theme.couple.rightOrnament}
  alt=""
  className="
  absolute
  right-0
  top-32
  w-20
  md:w-28
  opacity-30
  pointer-events-none
  "
/>

      <div className="text-center mb-20">

  <img
    src={theme.couple.titleOrnament}
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
${theme.font.title}
${theme.text.primary}
`}
  >
    Mempelai
  </h2>

</div>

      <div
        className="
        max-w-6xl
        mx-auto
        grid
        md:grid-cols-3
        gap-12
        items-center
        "
      >

        {/* GROOM */}
        <div className="text-center">

          <div
  className="
  relative
  w-72
  h-72
  mx-auto
  "
>
  <img
  src={data.groomImage}
  className="absolute rounded-full object-cover"
  style={{
  top: theme.couple.photo.top,
  left: theme.couple.photo.left,
  width: theme.couple.photo.size,
  height: theme.couple.photo.size,
  
}}
/>

  <img
    src={theme.couple.photoFrame}
    alt=""
    className="
    absolute
    inset-0
    w-full
    h-full
    object-contain
    pointer-events-none
    "
  />
</div>

          <h3
            className={`
            text-4xl
            ${theme.font.title}
  ${theme.text.primary}
            mt-8
            `}
          >
            {data.groom}
          </h3>

          <p
            className={`
            ${theme.text.accent}
            font-[family-name:var(--font-body)]
            uppercase
            tracking-widest
            text-sm
            mt-6
            `}
          >
            {data.groomTitle}
          </p>

          <p className={`${theme.text.body} mt-4
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            Bapak {data.groomFather}
          </p>

          <p className={`${theme.text.accent} my-2
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            &
          </p>

          <p className={`${theme.text.body}
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            Ibu {data.groomMother}
          </p>

          <div className="mt-10 text-center">
  <img
    src={theme.couple.titleOrnament}
    alt=""
    className="
    w-72
    mx-auto
    opacity-80
    "
  />
</div>

        </div>

        {/* HEART */}
        <div
  className="
  hidden md:flex
  items-center
  justify-center
  "
>
  <img
    src={theme.couple.centerImage}
    alt=""
    className="
w-72
opacity-80
"
  />
</div>

        {/* BRIDE */}
        <div className="text-center">

          <div
  className="
  relative
  w-72
  h-72
  mx-auto
  "
>
  <img
    src={data.brideImage}
    className="absolute rounded-full object-cover"
  style={{
  top: theme.couple.photo.top,
  left: theme.couple.photo.left,
  width: theme.couple.photo.size,
  height: theme.couple.photo.size,
  
}}
  />

  <img
    src={theme.couple.photoFrame}
    alt=""
    className="
    absolute
    inset-0
    w-full
    h-full
    object-contain
    pointer-events-none
    "
  />
</div>

          <h3
            className={`
            text-4xl
            ${theme.font.title}
  ${theme.text.primary}
            mt-8
            `}
          >
            {data.bride}
          </h3>

          <p
            className={`
            ${theme.text.accent}
            font-[family-name:var(--font-body)]
            uppercase
            tracking-widest
            text-sm
            mt-6
            `}
          >
            {data.brideTitle}
          </p>

          <p className={`${theme.text.body} mt-4
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            Bapak {data.brideFather}
          </p>

          <p className={`${theme.text.accent} my-2
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            &
          </p>

          <p className={`${theme.text.body}
          text-2xl
md:text-2xl
          font-[family-name:var(--font-pinyon-script)]`}>
            Ibu {data.brideMother}
          </p>

          <div className="mt-10 text-center">
  <img
    src={theme.couple.divider}
    alt=""
    className="
    w-72
    mx-auto
    opacity-80
    "
  />
</div>

        </div>

      </div>

    </section>
  );
}
}