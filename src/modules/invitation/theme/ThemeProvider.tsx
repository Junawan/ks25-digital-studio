"use client";

import {
  createContext,
  useContext,
} from "react";

import { themes } from "./themeConfig";

type ThemeName = keyof typeof themes;

const ThemeContext = createContext(
  themes["luxury-black"]
);

export function ThemeProvider({
  theme,
  children,
}:{
  theme:string;
  children:React.ReactNode;
}){

  console.log("THEME PROP:", theme);

  const currentTheme =
    themes[
      theme as ThemeName
    ] ??
    themes["luxury-black"];

  return (

<ThemeContext.Provider
value={currentTheme}
>

{children}

</ThemeContext.Provider>

  );

}

export function useTheme(){

  return useContext(
    ThemeContext
  );

}