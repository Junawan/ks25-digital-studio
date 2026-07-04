"use client";

import Image from "next/image";

import {
  MonitorSmartphone,
} from "lucide-react";

import {
  DashboardProduct,
} from "@/modules/dashboard/dashboard.data";

interface Props {

  product: DashboardProduct;

}

export default function ProductScreenshots({

  product,

}: Props) {

  if (
    product.screenshots.length === 0
  ) {

    return null;

  }

  return (

<section className="space-y-6">

<div className="flex items-center gap-3">

<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-violet-100
text-violet-600
dark:bg-violet-900/30
"
>

<MonitorSmartphone className="h-6 w-6"/>

</div>

<div>

<h2
className="
text-2xl
font-bold
"
>

Preview Aplikasi

</h2>

<p
className="
text-muted-foreground
"
>

Lihat tampilan aplikasi sebelum digunakan.

</p>

</div>

</div>

<div
className="
flex
gap-5
overflow-x-auto
pb-2
snap-x
snap-mandatory
scroll-smooth
"
>

{product.screenshots.map(

(image,index)=>(

<div

key={index}

className="
min-w-[260px]
max-w-[260px]
snap-center
overflow-hidden
rounded-3xl
border
bg-background
shadow-lg
"

>

<Image

src={image}

alt={`${product.name}-${index+1}`}

width={300}

height={650}

className="
h-auto
w-full
object-cover
"

/>

</div>

)

)}

</div>

</section>

  );

}