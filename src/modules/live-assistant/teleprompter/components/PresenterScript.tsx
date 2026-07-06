"use client";

import {
  RefObject,
  useRef,
} from "react";

interface Props {

  text: string;

  fontSize: number;

  contentRef: RefObject<HTMLDivElement | null>;

  onPlayPause: () => void;

}

export default function PresenterScript({

  text,

  fontSize,

  contentRef,

  onPlayPause,

}: Props) {
  const moved =
  useRef(false);

  return (

<div
  className="
  absolute
  inset-0
  overflow-hidden
  bg-black
  "

  onPointerDown={() => {
    moved.current = false;
  }}

  onPointerMove={() => {
    moved.current = true;
  }}

  onPointerUp={(e) => {

    if (moved.current) {
      return;
    }

    const target =
      e.target as HTMLElement;

    if (
      target.closest("button") ||
      target.closest("[data-control]")
    ) {
      return;
    }

    onPlayPause();

  }}

>

<div
  ref={contentRef}
  className="
  mx-auto

  h-full
  w-full
  max-w-[760px]

  overflow-y-auto
  overflow-x-hidden

  px-5
  sm:px-8
  md:px-10

  pt-24
  pb-40

  whitespace-pre-wrap

  break-words

  text-white
  font-medium

  select-none
  "
  style={{
    fontSize,

    textAlign: "justify",

    lineHeight: 2.1,

    wordBreak: "break-word",

    overflowWrap: "anywhere",

    WebkitHyphens: "auto",

    hyphens: "auto",
  }}
>

{text ||

"Produk ini belum memiliki script AI."}

</div>

</div>

  );

}