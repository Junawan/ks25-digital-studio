import { notFound, useRouter } from "next/navigation";

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
import { useAndroidBack } from "@/hooks/useAndroidBack";

interface Props {

  params: Promise<{

    moduleId: string;

  }>;

}

export default async function AppDetailPage({

  params,

}: Props) {

  const router = useRouter();

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

  useAndroidBack(() => {
    router.back();
    return true;
  });

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