import type { ComponentType } from "react";

export interface SidebarItem {
  title: string;
  href: string;
  moduleId?: string;
  icon?: ComponentType;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "My Apps",
    href: "/my-apps",
  },
  // Installed Modules

  {
    title: "Live Assistant",
    href: "/live-assistant",
    moduleId: "live-assistant",
  },

  {
    title: "POS",
    href: "/pos",
    moduleId: "pos",
  },

  {
    title: "PackFlow",
    href: "/packflow",
    moduleId: "packflow",
  },

  {
    title: "KS25 Absensi",
    href: "/attendance",
    moduleId: "attendance",
  },

  {
    title: "Digital Invitation",
    href: "/digital-invitation",
    moduleId: "digital-invitation",
  },

  {
    title: "Online Store",
    href: "/online-store",
    moduleId: "online-store",
  },
];
