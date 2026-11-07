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

{product.faq.length > 0 && <section className="mx-auto max-w-4xl space-y-4">
  <div><p className="text-sm font-semibold text-violet-700">Pertanyaan umum</p><h2 className="mt-1 text-2xl font-bold">Tentang {product.name}</h2></div>
  <div className="divide-y rounded-2xl border bg-background px-5">{product.faq.map((item) => <details key={item.question} className="group py-4"><summary className="cursor-pointer list-none font-semibold marker:hidden">{item.question}<span className="float-right text-violet-600 group-open:rotate-45">＋</span></summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
</section>}

<div className="text-center"><Link className="text-sm font-medium text-violet-700 underline underline-offset-4" href="/dashboard">Kembali ke semua modul</Link></div>

</div>

  );

}
