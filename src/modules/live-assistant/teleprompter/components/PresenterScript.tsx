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
h-full
overflow-y-auto

px-8

pt-24

pb-40

leading-[2.2]

whitespace-pre-wrap

text-white

font-medium

"
style={{
fontSize,
}}

>

{text ||

"Produk ini belum memiliki script AI."}

</div>

</div>

  );

}