"use client";

import {
  Sparkles,
} from "lucide-react";

import {
  DashboardProduct,
} from "@/modules/dashboard/dashboard.data";

interface Props {

  product: DashboardProduct;

}

export default function ProductFeatures({

  product,

}: Props) {

  if (
    product.features.length === 0
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

<Sparkles className="h-6 w-6"/>

</div>

<div>

<h2
className="
text-2xl
font-bold
"
>

Fitur Unggulan

</h2>

<p
className="
text-muted-foreground
"
>

Semua fitur utama yang tersedia
pada aplikasi ini.

</p>

</div>

</div>

<div
className="
grid
gap-5
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
"
>

{product.features.map(

(feature)=>(

<div

key={feature.title}

className="
group

rounded-3xl

border

bg-background

p-6

transition-all

duration-300

hover:-translate-y-1

hover:border-violet-500

hover:shadow-xl
"

>

<div
className="
mb-5

flex

h-16

w-16

items-center

justify-center

rounded-2xl

bg-violet-100

text-3xl

dark:bg-violet-900/30
"
>

{feature.icon}

</div>

<h3
className="
text-lg
font-semibold
"
>

{feature.title}

</h3>

<p
className="
mt-3

leading-7

text-muted-foreground
"
>

{feature.description}

</p>

</div>

)

)}

</div>

</section>

  );

}