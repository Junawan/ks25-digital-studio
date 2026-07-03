import {
  LayoutDashboard,
  Package,
  CreditCard,
  Newspaper,
  LifeBuoy,
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

  {

    label: "Bantuan",

    icon: LifeBuoy,

    external:
      "https://wa.me/6285710255464?text=Halo%20KS25%20Digital%20Studio,%20saya%20membutuhkan%20bantuan.",

  },

];