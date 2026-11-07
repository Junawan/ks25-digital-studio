import {
  LayoutDashboard,
  Package,
  Newspaper,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react";

export interface NavigationItem {

  label: string;

  icon: typeof LayoutDashboard;

  href?: string;

  external?: string;

  adminOnly?: boolean;

}

export const rootNavigation: NavigationItem[] = [

  {

    label: "Dashboard",

    href: "/dashboard",

    icon: LayoutDashboard,

  },

  {

    label: "My Apps",

    href: "/my-apps",

    icon: Package,

  },

  {

    label: "Info",

    href: "/dashboard/updates",

    icon: Newspaper,

  },

  {

    label: "Bantuan",

    icon: LifeBuoy,

    external:
      "https://wa.me/6285710255464?text=Halo%20KS25%20Digital%20Studio,%20saya%20membutuhkan%20bantuan.",

  },

  { label: "Admin", href: "/dashboard/subscription", icon: ShieldCheck, adminOnly: true },

];
