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

  const screenshotLabels: Record<string, string[]> = {
    pos: ["Ringkasan KS25 POS", "Transaksi kasir", "Pemesanan melalui QR", "Laporan penjualan bulanan"],
    attendance: ["Ringkasan KS25 Absensi", "Absensi selfie karyawan", "Pengajuan cuti karyawan"],
    packflow: ["Ringkasan KS25 PackFlow", "Daftar paket aktif dan proses packing"],
    "live-assistant": ["Sampul Live Assistant", "Playlist live", "Katalog produk live", "Teleprompter host", "Generator skrip AI", "Riwayat sesi live"],
  };

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

{product.screenshots.map((image, index) => (
<figure key={image} className="flex min-w-[280px] max-w-[280px] snap-center flex-col overflow-hidden rounded-3xl border bg-background shadow-lg sm:min-w-[340px] sm:max-w-[340px]">

<Image

src={image}

alt={`${product.name}: ${screenshotLabels[product.moduleId]?.[index] ?? `tampilan ${index + 1}`}`}

width={900}

height={650}

className="mx-auto h-[320px] w-full object-contain p-2 sm:h-[380px]"

/>

</figure>

))}

</div>

</section>

  );

}
