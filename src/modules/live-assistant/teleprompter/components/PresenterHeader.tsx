"use client";

import {
  Search,
  X,
  Maximize,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  current: number;
  total: number;

  image?: string;
  title?: string;

  onBack: () => void;
  onSearch: () => void;
  onFullscreen: () => void;
}

export default function PresenterHeader({
  current,
  total,
  onBack,
  onSearch,
  onFullscreen,
  image,
  title,
}: Props) {

  return (

<div
  className="
  fixed
  top-0
  left-0
  right-0
  z-40
  px-4
  pt-4
  pointer-events-none
  "
>

  <div className="relative flex items-center">

    {/* LEFT */}

    <div className="pointer-events-auto">

      <Button
        size="icon"
        variant="secondary"
        className="rounded-full"
        onClick={onBack}
      >
        <X className="h-5 w-5"/>
      </Button>

    </div>

    {/* CENTER */}

    <div
      className="
      absolute
      left-1/2
      -translate-x-1/2

      pointer-events-auto

      flex
      items-center
      gap-3

      rounded-full
      bg-black/70
      backdrop-blur

      px-3
      py-2
      "
    >

      <img
        src={image}
        alt={title}
        className="
        h-10
        w-10
        rounded-full
        object-cover
        "
      />

      <span
        className="
        font-semibold
        text-white
        "
      >
        {current} / {total}
      </span>

    </div>

    {/* RIGHT */}

    <div
      className="
      ml-auto
      flex
      gap-2
      pointer-events-auto
      "
    >

      <Button
        size="icon"
        variant="secondary"
        className="rounded-full"
        onClick={onSearch}
      >

        <Search className="h-5 w-5"/>

      </Button>

      <Button
        size="icon"
        variant="secondary"
        className="rounded-full"
        onClick={onFullscreen}
      >

        <Maximize className="h-5 w-5"/>

      </Button>

    </div>

  </div>

</div>

  );

}