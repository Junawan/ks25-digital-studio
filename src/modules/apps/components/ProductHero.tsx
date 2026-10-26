"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Play,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useModules } from "@/modules/module/use-modules";

import {
  DashboardProduct,
} from "@/modules/dashboard/dashboard.data";

interface Props {

  product: DashboardProduct;

}

export default function ProductHero({

  product,

}: Props) {

  const router =
    useRouter();
  const { hasModule } = useWorkspace();
  const { install } = useModules();
  const installed = hasModule(product.moduleId);

  return (

<section
className="
relative
overflow-hidden
rounded-3xl
border
bg-gradient-to-br
from-violet-700
via-violet-600
to-fuchsia-600
text-white
"
>

<div
className="
absolute
-right-32
-top-32
h-96
w-96
rounded-full
bg-white/10
blur-3xl
"
/>

<div
className="
relative

grid

gap-10

p-6

lg:grid-cols-2

lg:items-center

lg:p-10
"
>

{/* LEFT */}

<div>

<Button

size="icon"

variant="secondary"

className="rounded-full"

onClick={()=>
router.back()
}

>

<ArrowLeft className="h-5 w-5"/>

</Button>

<div
className="
mt-8

flex

items-center

gap-5
"
>

<Image

src={product.logo}

alt={product.name}

width={90}

height={90}

className="
rounded-3xl
shadow-2xl
"

/>

<div>

<Badge
className="
bg-white/20
text-white
"
>

v{product.version}

</Badge>

<h1
className="
mt-3

text-3xl

font-bold

lg:text-5xl
"
>

{product.name}

</h1>

</div>

</div>

<p
className="
mt-6

max-w-xl

text-lg

leading-8

text-white/90
"
>

{product.longDescription}

</p>

<div
className="
mt-6

flex

flex-wrap

items-center

gap-3
"
>

{installed && <Badge
className="
bg-emerald-600
text-white
"
>

<CheckCircle2
className="
mr-2
h-4
w-4
"
/>

Terinstal

</Badge>
}

</div>

<Button

size="lg"

className="
mt-8

h-12

rounded-xl

bg-white

px-8

text-violet-700

hover:bg-white/90
"

onClick={() => installed ? router.push(product.route) : void install(product.moduleId)}

>

{installed ? <Play className="mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}

{installed ? "Buka Aplikasi" : "Install Modul"}

</Button>

<Link href={`/aplikasi/${product.moduleId}`} className="mt-4 inline-flex text-sm font-semibold text-white underline underline-offset-4">
  Baca informasi lengkap {product.name}
</Link>

</div>

{/* RIGHT */}

<div
className="
flex

justify-center
"
>

<Image

src={product.heroImage}

alt={product.name}

width={650}

height={900}

priority

className="
w-full

max-w-md

rounded-3xl

shadow-2xl
"

/>

</div>

</div>

</section>

  );

}
