"use client";

import { RefObject } from "react";

interface Props {
  text: string;

  fontSize: number;

  contentRef: RefObject<HTMLDivElement | null>;
}

export default function PresenterScript({
  text,
  fontSize,
  contentRef,
}: Props) {

  return (

<div
className="
absolute
inset-0
overflow-hidden
bg-black
"
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