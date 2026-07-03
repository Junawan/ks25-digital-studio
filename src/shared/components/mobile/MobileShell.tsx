"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import MobileHeader from "./MobileHeader";

import RootBottomNavigation
from "@/shared/navigation/RootBottomNavigation";

import LiveAssistantBottomNavigation
from "@/modules/live-assistant/components/LiveAssistantBottomNavigation";

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

  return "KS25 Digital Studio";
}