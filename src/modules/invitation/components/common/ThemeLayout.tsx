"use client";

import ThemeCorner
from "./ThemeCorner";

import { useTheme }
from "@/modules/invitation/theme/ThemeProvider";

export default function ThemeLayout({
  children,
}:{
  children:React.ReactNode;
}){

  const theme =
    useTheme();

  return (

<div
className={`
relative
min-h-screen
overflow-hidden
${theme.background}
`}
>

<ThemeCorner/>

<div
className="
relative
z-10
"
>

{children}

</div>

</div>

  );

}