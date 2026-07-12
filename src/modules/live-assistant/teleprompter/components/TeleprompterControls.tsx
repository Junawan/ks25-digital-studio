"use client";

import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  playing: boolean;

  onPlayPause: () => void;

  onPrev: () => void;

  onNext: () => void;

  onFontDown: () => void;

  onFontUp: () => void;

  speed: number;

  onSpeedDown: () => void;

  onSpeedUp: () => void;
}

export default function TeleprompterControls({
  playing,
  onPlayPause,
  onPrev,
  onNext,
  onFontDown,
  onFontUp,
  speed,
}: Props) {

  return (

<div
className="
fixed
bottom-1
left-3
right-3
rounded-3xl
z-50

border-t

bg-zinc-950/95

backdrop-blur-xl

pb-safe

px-3

pt-3

pb-4
"
>

<div
className="
mx-auto
grid
max-w-xl
grid-cols-[1fr_1fr_84px_1fr_1fr]
items-center
gap-3
"
>

<Button
  variant="secondary"
  className="
    h-14
    w-full
    flex
    flex-col
    items-center
    justify-center
    gap-0
  "
  onClick={onFontDown}
>

  <span className="text-base font-semibold">
    A
  </span>

  <Minus className="h-3.5 w-3.5" />

</Button>

<Button
  variant="secondary"
  className="
    h-14
    w-full
    flex
    flex-col
    items-center
    justify-center
    gap-0
  "
  onClick={onFontUp}
>

  <span className="text-xl font-semibold">
    A
  </span>

  <Plus className="h-3.5 w-3.5" />

</Button>

<Button

className="
mx-auto

h-20
w-20

rounded-full

bg-violet-600

shadow-xl

shadow-violet-700/50

hover:scale-105
"

onClick={onPlayPause}

>

{playing

? <Pause className="h-8 w-8"/>

: <Play className="ml-1 h-8 w-8"/>}

</Button>

<Button
className="
h-16
w-full
rounded-2xl
"
variant="secondary"
onClick={onPrev}
>

<ChevronLeft/>

</Button>

<Button
className="
h-16
w-full
rounded-2xl
"
variant="secondary"
onClick={onNext}
>

<ChevronRight/>

</Button>

</div>

</div>

  );

}