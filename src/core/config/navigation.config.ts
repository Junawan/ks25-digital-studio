import {
  Home,
  Grid2x2,
  LayoutDashboard,
  CreditCard,
  User,
  Settings,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: typeof Home;
}

export const navigationItems: NavigationItem[] = [
  {
    id: "home",
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "my-apps",
    title: "My Apps",
    href: "/dashboard/apps",
    icon: LayoutDashboard,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Grid2x2,
  },
  {
    id: "subscription",
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  {
    id: "profile",
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    id: "settings",
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];