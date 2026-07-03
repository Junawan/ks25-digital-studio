"use client";

import Image from "next/image";
import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  Download,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useModules } from "@/modules/module/use-modules";

import {
  DashboardProduct,
} from "../dashboard.data";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

interface Props {

  product: DashboardProduct;

}

export default function ProductModuleCard({

  product,

}: Props) {

    const { hasModule } =
  useWorkspace();

  const installed =
  hasModule(
    product.moduleId
  );

const available =
  product.ready &&
  !installed;

const comingSoon =
  !product.ready;

  const {
  install,
} = useModules();

const categoryLabel = {

    sales: "🚀 Sales",

    business: "💼 Business",

    fulfillment: "📦 Fulfillment",

    creative: "🎉 Creative",

};

  return (

    <div
      className="
group
overflow-hidden
rounded-3xl
border
bg-background
transition-all
duration-300
hover:-translate-y-2
hover:border-violet-500
hover:shadow-2xl
"
    >

      {/* Cover */}

      <div
  className={`
    relative
    h-52
    overflow-hidden
    bg-gradient-to-br
    ${product.color}
  `}
>

  <Image
  src={product.image}
  alt={product.name}
  fill
  priority={product.moduleId === "live-assistant"}
  className="object-cover"
/>

</div>

      {/* Content */}

      <div className="space-y-4 p-5">

        <div className="flex items-start justify-between">

          <div>

            <h3 className="font-semibold text-lg">

              {product.name}

            </h3>

            <p
              className="
              mt-1
              text-sm
              text-muted-foreground
              "
            >

              {product.description}

            </p>

          </div>

        </div>

        <Badge
  variant="secondary"
>

  {categoryLabel[product.category]}

</Badge>

        {installed && (

          <Button
  asChild
  className="
  w-full
  bg-emerald-600
  hover:bg-emerald-700
  "
>

  <Link
    href={product.route}
  >

    <CheckCircle2
      className="mr-2 h-4 w-4"
    />

    Buka Aplikasi

  </Link>

</Button>

        )}

        {available && (

          <Button
  className="w-full"
  onClick={() =>
    install(product.moduleId)
  }
>

  <Download className="mr-2 h-4 w-4"/>

  Install

</Button>

        )}

        {comingSoon && (

  <>

    <Button
      disabled
      variant="secondary"
      className="w-full"
    >

      <Clock3 className="mr-2 h-4 w-4" />

      Segera Hadir

    </Button>

    <p
      className="
      text-center
      text-xs
      text-muted-foreground
      "
    >
      Aplikasi sedang dipersiapkan. Nantikan segera.
    </p>

  </>

)}

      </div>

    </div>

  );

}