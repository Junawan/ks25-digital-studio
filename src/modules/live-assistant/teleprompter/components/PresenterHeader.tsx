"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface Props {
  current: number;
  total: number;

  image?: string;
  title?: string;

  onBack: () => void;
  onSearch: () => void;
}

export default function PresenterHeader({
  current,
  total,
  onBack,
  onSearch,
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
absolute
left-1/2
-top-translate-x-1/2

flex
items-center
gap-2

rounded-full
bg-zinc-900/90

px-3
py-2
"
>

<img
src={image}
alt={title}
className="
h-9
w-9
rounded-full
border
border-zinc-700
object-cover
"
/>

<div
className="
text-sm
font-semibold
text-white
"
>

{current} / {total}

</div>

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