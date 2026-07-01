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
    title: "Marketplace",
    href: "/marketplace",
  },
  {
    title: "My Apps",
    href: "/my-apps",
  },
  {
    title: "Settings",
    href: "/settings",
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