"use client";

import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Maximize,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface Props {
  playing: boolean;

  onPlayPause: () => void;

  onPrev: () => void;

  onNext: () => void;

  onFontDown: () => void;

  onFontUp: () => void;

  onFullscreen: () => void;

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
  onFullscreen,
  speed,
  onSpeedDown,
  onSpeedUp,
}: Props) {

  return (

<div
className="
fixed
bottom-0
left-0
right-0
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

grid-cols-7

gap-2
"
>

<Button
size="icon"
className="h-14 w-full"
variant="secondary"
onClick={onPrev}
>

<ChevronLeft/>

</Button>

<Button
size="icon"
className="h-14 w-full"
onClick={onPlayPause}
>

{playing
? <Pause/>
: <Play/>}

</Button>

<Button
size="icon"
className="h-14 w-full"
variant="secondary"
onClick={onNext}
>

<ChevronRight/>

</Button>

<Button
size="icon"
className="h-14 w-full"
variant="secondary"
onClick={onFontDown}
>

<Minus/>

</Button>

<Button
variant="secondary"
className="h-14"

onClick={onSpeedDown}
>

{speed.toFixed(1)}×

</Button>

<Button
size="icon"
className="h-14 w-full"
variant="secondary"
onClick={onFontUp}
>

<Plus/>

</Button>

<Button
size="icon"
className="h-14 w-full"
variant="secondary"
onClick={onFullscreen}
>

<Maximize/>

</Button>

</div>

</div>

  );

}