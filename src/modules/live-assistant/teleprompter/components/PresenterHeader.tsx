"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface Props {
  current: number;
  total: number;
  onBack: () => void;
  onSearch: () => void;
}

export default function PresenterHeader({
  current,
  total,
  onBack,
  onSearch,
}: Props) {

  return (

<div
className="
fixed
top-0
left-0
right-0
z-40
pointer-events-none
"
>

<div
className="
flex
items-center
justify-between
p-4
"
>

<Button
size="icon"
variant="secondary"
className="pointer-events-auto rounded-full"
onClick={onBack}
>

<X className="h-5 w-5"/>

</Button>

<div
className="
pointer-events-auto

rounded-full

bg-black/60

px-4

py-2

text-sm

font-semibold

text-white

backdrop-blur
"
>

{current} / {total}

</div>

<Button
size="icon"
variant="secondary"
className="pointer-events-auto rounded-full"
onClick={onSearch}
>

<Search className="h-5 w-5"/>

</Button>

</div>

</div>

  );

}