"use client";

import {
  useTheme,
}
from "@/modules/invitation/theme/ThemeProvider";

export default function ThemeCorner(){

const theme =
useTheme();

return(

<div
className="
fixed
inset-0
z-[1]
pointer-events-none
overflow-hidden
"
>

<img
src={theme.backgroundCorner.topLeft}
className="
absolute
top-0
left-0
w-24
md:w-36
opacity-60
"
/>

<img
src={theme.backgroundCorner.topRight}
className="
absolute
top-0
right-0
w-24
md:w-36
opacity-60
"
/>

<img
src={theme.backgroundCorner.bottomLeft}
className="
absolute
bottom-0
left-0
w-24
md:w-36
opacity-60
"
/>

<img
src={theme.backgroundCorner.bottomRight}
className="
absolute
bottom-0
right-0
w-24
md:w-36
opacity-60
"
/>

</div>

);

}