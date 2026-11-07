"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

type HeroProps = {
  groom: string;
  bride: string;
  coverImage: string;
};

export default function Hero({
  groom,
  bride,
  coverImage,
}: HeroProps) {

  const theme = useTheme();

  return (

<section
id="hero"
className="
relative
min-h-screen
px-6
"
>

<div
className="
relative
w-full
flex
justify-center
"
>

<div
className="
relative
z-10
max-w-xl
mx-auto
text-center
"
>

<img
src={theme.hero.topOrnament}
alt=""
className="w-40 mx-auto mb-6"
/>

<p
className={`
uppercase
tracking-[8px]
text-xs
md:text-sm
mb-8
${theme.text.accent}
${theme.font.heading}
`}
>
The Wedding Of
</p>

<div
className="
relative
w-[320px]
h-[320px]
md:w-[420px]
md:h-[420px]
mx-auto
"
>

<img
src={coverImage}
alt=""
className="
w-full
rounded-[32px]
shadow-2xl
border
border-[#D4AF37]/20
"
/>

</div>

<img
src={theme.hero.divider}
alt=""
className="
w-72
md:w-96
mx-auto
mt-36
"
/>

<h1
className={`
text-4xl
md:text-7xl
leading-tight
${theme.font.title}
${theme.text.primary}
`}
>

<p
className={`
uppercase
tracking-[5px]
text-xs
mb-6
${theme.text.secondary}
${theme.font.heading}
`}
>
Undangan Pernikahan
</p>

{groom}

<br/>

<span className={theme.text.accent}>
&
</span>

<br/>

{bride}

</h1>

<img
src={theme.hero.dividerBottom}
alt=""
className="
w-72
md:w-96
mx-auto
mt-4
"
/>

</div>

</div>

</section>

  );
}