import {

  Home,

  Package,

  Radio,

  ListMusic,

  History,

} from "lucide-react";

import type {

  NavigationItem,

} from "./root-navigation";

export const

liveAssistantNavigation:

NavigationItem[] = [

  {

    label: "Home",

    href: "/live-assistant",

    icon: Home,

  },

  {

    label: "Produk",

    href: "/live-assistant/products",

    icon: Package,

  },

  {

    label: "Live",

    href: "/live-assistant/live",

    icon: Radio,

  },

  {

    label: "Playlist",

    href: "/live-assistant/playlists",

    icon: ListMusic,

  },

  {

    label: "Riwayat",

    href: "/live-assistant/history",

    icon: History,

  },

];