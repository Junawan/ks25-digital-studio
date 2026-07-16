"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
} from "lucide-react";

interface MenuItem {
  title: string;

  href: string;

  icon: React.ElementType;
}

const menus: MenuItem[] = [
  {
    title: "Produk",
    href: "/dashboard/pos/products",
    icon: Package,
  },
  {
    title: "Transaksi",
    href: "/dashboard/pos/transactions",
    icon: ShoppingCart,
  },
  {
    title: "Riwayat",
    href: "/dashboard/pos/history",
    icon: ReceiptText,
  },
  {
    title: "Pemasukan",
    href: "/dashboard/pos/income",
    icon: ArrowDownCircle,
  },
  {
    title: "Pengeluaran",
    href: "/dashboard/pos/expenses",
    icon: ArrowUpCircle,
  },
  {
    title: "Setting",
    href: "/dashboard/pos/settings",
    icon: Settings,
  },
];

export default function PosBottomNavigation() {
  const pathname = usePathname();

  if (!pathname.startsWith("/dashboard/pos")) {
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
        grid-cols-6
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
        ? "bg-primary text-primary-foreground shadow"
        : "text-muted-foreground"
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
        ? "font-semibold text-primary"
        : "text-muted-foreground"
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