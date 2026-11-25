"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  LayoutDashboard,
  ReceiptText,
  ChartColumn,
  ShoppingCart,
  CircleAlert,
} from "lucide-react";

interface MenuItem {
  title: string;

  href: string;

  icon: React.ElementType;
}

const menus: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/pos",
    icon: LayoutDashboard,
  },
  {
    title: "Transaksi",
    href: "/pos/transactions",
    icon: ShoppingCart,
  },
  {
    title: "Riwayat",
    href: "/pos/history",
    icon: ReceiptText,
  },
  {
    title: "Belum Lunas",
    href: "/pos/unpaid",
    icon: CircleAlert,
  },
  {
    title: "Pemasukan",
    href: "/pos/income",
    icon: ArrowDownCircle,
  },
  {
    title: "Pengeluaran",
    href: "/pos/expenses",
    icon: ArrowUpCircle,
  },
  {
    title: "Laporan",
    href: "/pos/reports",
    icon: ChartColumn,
  },
];

export default function PosBottomNavigation() {
  const pathname = usePathname();

  if (!pathname.startsWith("/pos")) {
    return null;
  }

  return (
    <nav
      className="
      fixed
      bottom-0
      left-0
      right-0
      z-50
      border-t
      bg-background/95
      backdrop-blur
      supports-[backdrop-filter]:bg-background/80
      pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
        mx-auto
        grid
        max-w-screen-lg
        grid-cols-7
        "
      >
        {menus.map((menu) => {
          const active =
            pathname === menu.href ||
            pathname.startsWith(
              `${menu.href}/`
            );

          const Icon = menu.icon;

          return (
            <Link
  key={menu.href}
  href={menu.href}
  className="
  flex
  flex-col
  items-center
  justify-center
  py-2
  "
>
  <div
    className={`
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    transition-all

    ${
      active
        ? menu.href === "/pos/unpaid" ? "bg-amber-500 text-white shadow" : "bg-primary text-primary-foreground shadow"
        : menu.href === "/pos/unpaid" ? "text-amber-600" : "text-muted-foreground"
    }
    `}
  >
    <Icon className="h-5 w-5" />
  </div>

  <span
    className={`
    mt-1
    text-[11px]

    ${
      active
        ? menu.href === "/pos/unpaid" ? "font-semibold text-amber-700" : "font-semibold text-primary"
        : menu.href === "/pos/unpaid" ? "font-medium text-amber-700" : "text-muted-foreground"
    }
    `}
  >
    {menu.title}
  </span>
</Link>
          );
        })}
      </div>
    </nav>
  );
}
