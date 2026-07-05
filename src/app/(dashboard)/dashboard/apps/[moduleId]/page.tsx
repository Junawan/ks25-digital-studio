"use client";

import { notFound, } from "next/navigation";

import ProductHero from "@/modules/apps/components/ProductHero";

import {
  dashboardProducts,
} from "@/modules/dashboard/dashboard.data";

import ProductFeatures
from "@/modules/apps/components/ProductFeatures";

import ProductScreenshots
from "@/modules/apps/components/ProductScreenshots";

import ProductWorkflow
from "@/modules/apps/components/ProductWorkflow";
import AndroidBackHandler from "@/shared/components/native/AndroidBackHandler";

interface Props {

  params: Promise<{

    moduleId: string;

  }>;

}

export default async function AppDetailPage({

  params,

}: Props) {

  const {

    moduleId,

  } = await params;

  const product =
    dashboardProducts.find(

      (item)=>

        item.moduleId ===
        moduleId

    );

  if(!product){

    notFound();

  }

  <AndroidBackHandler />

  return(

<div
className="
mx-auto

max-w-7xl

space-y-10

p-4

md:p-6

lg:p-8
"
>

<ProductHero
product={product}
/>

<ProductFeatures
  product={product}
/>

<ProductScreenshots
  product={product}
/>

<ProductWorkflow
  product={product}
/>

</div>

  );

}