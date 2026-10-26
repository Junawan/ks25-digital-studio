import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

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

function getProduct(moduleId: string) {
  return dashboardProducts.find((item) => item.moduleId === moduleId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  const product = getProduct(moduleId);
  if (!product) return { title: "Aplikasi Tidak Ditemukan", robots: { index: false, follow: false } };

  return {
    title: `${product.name} | Fitur dan Cara Menggunakan`,
    description: product.longDescription,
    alternates: { canonical: `/aplikasi/${moduleId}` },
    robots: { index: false, follow: true },
  };
}

export default async function AppDetailPage({

  params,

}: Props) {

  const {

    moduleId,

  } = await params;

  const product = getProduct(moduleId);

  if(!product){

    notFound();

  }

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

<AndroidBackHandler />

<ProductHero
product={product}
/>

<p className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
  Halaman informasi publik: <Link className="font-medium text-violet-700 underline" href={`/aplikasi/${product.moduleId}`}>lihat detail {product.name} untuk pengunjung</Link>.
</p>

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
