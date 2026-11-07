"use client";

import { useState } from "react";

import AudioPlayer from "../AudioPlayer";

import ThemeBackground from "@/modules/invitation/components/common/ThemeBackground";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";
import BottomNavigation from "../common/BottomNavigation";

export default function InvitationWrapper({
  groom,
  bride,
  guestName,
  coverImage,
  children,
  musicUrl,
}: {
  groom: string;
  bride: string;
  guestName: string;
  coverImage: string;
  children: React.ReactNode;
  musicUrl: string;
}) {

  const theme = useTheme();

  const [opened, setOpened] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);
  

  if (!opened) {

    return (

      <div
        className={`
fixed
inset-0
overflow-y-auto
px-5
pt-12
pb-10
flex
justify-center
items-start
${theme.wrapper.background}
`}
      >

        <div className="fixed inset-0 pointer-events-none z-0">

        <ThemeBackground/>
</div>

        <div
className="
relative
z-10
w-full
max-w-lg
mx-auto
pb-10
text-center
"
>

          <p
  className={`uppercase tracking-[8px] 
    font-[family-name:var(--font-cinzel-decorative)]
    text-xs 
    ${theme.wrapper.subtitle}`}
>
  The Wedding Of
</p>

          <div
className="
relative
mx-auto
mt-8
w-[260px]
h-[260px]
sm:w-[300px]
sm:h-[300px]
md:w-[340px]
md:h-[340px]
"
>

            <img
src={coverImage}
className="
absolute
sm:w-[205px]
sm:h-[205px]
md:w-[235px]
md:h-[235px]
rounded-full
object-cover
"
style={{
  top: theme.wrapper.photo.top,
  left: theme.wrapper.photo.left,
  width: theme.wrapper.photo.size,
  height: theme.wrapper.photo.size,
}}
/>

            <img
src={theme.wrapper.coverFrame}
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

          <img
  src={theme.wrapper.heroDivider}
  alt=""
  className="
w-56
sm:w-64
md:w-72
mx-auto
mt-6
"
/>

<p
className={`
uppercase
tracking-[5px]
text-xs
mb-4
${theme.font.heading}
${theme.text.secondary}
`}
>
  Undangan Pernikahan
</p>

          <h1
            className={`
            text-4xl
            md:text-6xl
           font-[family-name:var(--font-great-vibes)] font-bold
            mt-6
            ${theme.wrapper.guestTitle}
`}
          >
            {groom}
          </h1>

          <div
            className={`
            text-3xl
            font-[family-name:var(--font-great-vibes)] font-bold
            my-2
            ${theme.wrapper.guestTitle}
            `}
          >
            &
          </div>

          <h1
            className={`
            text-4xl
            md:text-6xl
            font-[family-name:var(--font-great-vibes)] font-bold
            ${theme.wrapper.guestTitle}
`}
          >
            {bride}
          </h1>

          <img
  src={theme.wrapper.bottomDivider}
  alt=""
  className="
w-72
mx-auto
mt-6
opacity-80
"
/>

          <div className="mt-2 flex justify-center">

  <div
  className="
  relative
  w-[300px]
  h-[220px]
  sm:w-[340px]
  sm:h-[250px]
  "
>

    <img
      src={theme.wrapper.guestFrame}
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

    <div
className="
absolute
left-0
right-0
top-[28%]
flex
flex-col
items-center
text-center
px-8
"
>

      <p
className={`
tracking-[1px]
text-sm
${theme.font.script}
${theme.wrapper.guestTitle}
`}
>
    Kepada Yth.
</p>

<h2
className={`
mt-2
text-2xl
font-[family-name:var(--font-great-vibes)]
${theme.wrapper.guestName}
leading-tight
`}
>
{guestName || "Tamu Undangan"}
</h2>

<p
className={`
mt-2
${theme.wrapper.guestNote}
text-[8px]
leading-4
max-w-[220px]
`}
>
Mohon maaf apabila terdapat
<br />
kesalahan penulisan nama.
</p>

    </div>

  </div>

</div>

          <button
            onClick={() => {

              setOpened(true);

              setIsPlaying(true);

            }}
            className={`
mt-6
w-full
py-4
rounded-full
text-white
font-semibold
transition
${theme.wrapper.button}
`}
          >
            Buka Undangan
          </button>

        </div>

      </div>

    );
  }

  return (
    <>
      <AudioPlayer
        isPlaying={isPlaying}
        musicUrl={musicUrl}
      />

    <BottomNavigation
  isPlaying={isPlaying}
  onToggleMusic={() =>
    setIsPlaying(!isPlaying)
  }
/>
      
        {children}
      
    </>
  );
}
