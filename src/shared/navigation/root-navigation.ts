import {
  LayoutDashboard,
  Package,
  CreditCard,
  Newspaper,
} from "lucide-react";

export interface NavigationItem {

  label: string;

  icon: typeof LayoutDashboard;

  href?: string;

  external?: string;

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

    label: "Langganan",

    href: "/dashboard/subscription",

    icon: CreditCard,

  },

  {

    label: "Info",

    href: "/dashboard/updates",

    icon: Newspaper,

  },

];
