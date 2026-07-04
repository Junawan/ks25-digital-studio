"use client";

import {
  ArrowDown,
  Workflow,
} from "lucide-react";

import {
  DashboardProduct,
} from "@/modules/dashboard/dashboard.data";

interface Props {

  product: DashboardProduct;

}

export default function ProductWorkflow({

  product,

}: Props) {

  if (
    product.workflows.length === 0
  ) {

    return null;

  }

  return (

<section className="space-y-8">

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

<Workflow className="h-6 w-6"/>

</div>

<div>

<h2
className="
text-2xl
font-bold
"
>

Alur Penggunaan

</h2>

<p
className="
text-muted-foreground
"
>

Ikuti langkah berikut agar
Live Assistant siap digunakan.

</p>

</div>

</div>

<div
className="
mx-auto
max-w-3xl
"
>

{product.workflows.map(

(step,index)=>(

<div
key={step.title}
className="flex"
>

<div
className="
mr-5
flex
flex-col
items-center
"
>

<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-violet-600
font-bold
text-white
"
>

{index+1}

</div>

{index !==
product.workflows.length-1 && (

<ArrowDown
className="
my-3
h-8
text-violet-400
"
/>

)}

</div>

<div
className="
mb-8
flex-1
rounded-3xl
border
bg-background
p-6
shadow-sm
"
>

<h3
className="
text-lg
font-semibold
"
>

{step.title}

</h3>

<p
className="
mt-3
leading-7
text-muted-foreground
"
>

{step.description}

</p>

</div>

</div>

)

)}

</div>

</section>

  );

}