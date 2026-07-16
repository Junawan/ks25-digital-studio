"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import MobileHeader from "./MobileHeader";

import RootBottomNavigation
from "@/shared/navigation/RootBottomNavigation";

import LiveAssistantBottomNavigation
from "@/modules/live-assistant/components/LiveAssistantBottomNavigation";
import PosBottomNavigation from "@/modules/pos/shared/components/PosBottomNavigation";

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
    "/dashboard/pos"
  );

  return (

<div
className="
min-h-screen
bg-black/70
text-black
"
>

{!isPresenter && (

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

{!isPresenter && (

  isLiveAssistant ? (

    <LiveAssistantBottomNavigation />

  ) : isPos ? (

    <PosBottomNavigation />

  ) : (

    <RootBottomNavigation />

  )

)}

</div>

);
}

function getTitle(pathname: string) {
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
    "/dashboard/pos/products"
  )
) {
  return "Produk";
}

if (
  pathname.includes(
    "/dashboard/pos/transactions"
  )
) {
  return "Transaksi";
}

if (
  pathname.includes(
    "/dashboard/pos/history"
  )
) {
  return "Riwayat";
}

if (
  pathname.includes(
    "/dashboard/pos/income"
  )
) {
  return "Pemasukan";
}

if (
  pathname.includes(
    "/dashboard/pos/expenses"
  )
) {
  return "Pengeluaran";
}

if (
  pathname.includes(
    "/dashboard/pos/settings"
  )
) {
  return "POS Settings";
}

  return "KS25 Digital Studio";
}