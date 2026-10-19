"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import MobileHeader from "./MobileHeader";

import RootBottomNavigation
from "@/shared/navigation/RootBottomNavigation";

import LiveAssistantBottomNavigation
from "@/modules/live-assistant/components/LiveAssistantBottomNavigation";
import PosBottomNavigation from "@/modules/pos/shared/components/PosBottomNavigation";
import PackflowBottomNavigation from "@/modules/packflow/components/PackflowBottomNavigation";

interface Props {
  children: ReactNode;
}

export default function MobileShell({
  children,
}: Props) {
  const pathname = usePathname();

  const title = getTitle(pathname);

const isPresenter =
  pathname.includes("/teleprompter");

  const isLiveAssistant =
  pathname.startsWith(
    "/live-assistant"
  );

  const isPos =
  pathname.startsWith(
    "/pos"
  );

  const isPackflow = pathname.startsWith("/packflow");
  const isAttendance = pathname.startsWith("/attendance");

  return (

<div
className="
min-h-screen
bg-black/70
text-black
"
>

{!isPresenter && !isAttendance && (

<MobileHeader
title={title}
/>

)}

<main
className={
isPresenter
? ""
: "px-4 pt-4 pb-24"
}
>

{children}

</main>

{!isPresenter && !isAttendance && (

  isLiveAssistant ? (

    <LiveAssistantBottomNavigation />

  ) : isPos ? (

    <PosBottomNavigation />

  ) : isPackflow ? (

    <PackflowBottomNavigation />

  ) : (

    <RootBottomNavigation />

  )

)}

</div>

);
}

function getTitle(pathname: string) {
  if (pathname.startsWith("/packflow")) return "KS25 PackFlow";
  if (pathname.startsWith("/attendance")) return "KS25 Absensi";
  if (pathname.includes("/marketplace")) {
    return "Marketplace";
  }

  if (pathname.includes("/live-assistant/products")) {
    return "Produk";
  }

  if (pathname.includes("/live-assistant/playlists")) {
    return "Playlist";
  }

  if (pathname.includes("/settings")) {
    return "Settings";
  }

  if (pathname.includes("/dashboard")) {
    return "Dashboard";
  }

  if (
  pathname.includes(
    "/pos/products"
  )
) {
  return "Produk";
}
//
if (
  pathname.includes("/pos/customers")
) {
  return "Pelanggan";
}

if (
  pathname.includes(
    "/pos/transactions"
  )
) {
  return "Transaksi";
}

if (
  pathname.includes(
    "pos/history"
  )
) {
  return "Riwayat";
}

if (
  pathname.includes(
    "/pos/income"
  )
) {
  return "Pemasukan";
}

if (
  pathname.includes(
    "/pos/expenses"
  )
) {
  return "Pengeluaran";
}

if (
  pathname.includes(
    "/pos/settings"
  )
) {
  return "POS Settings";
}

  return "KS25 Digital Studio";
}
