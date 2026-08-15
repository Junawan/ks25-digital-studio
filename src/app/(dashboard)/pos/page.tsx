"use client";

import Link from "next/link";

import {
  Boxes,
  Users,
  Truck,
  ShoppingCart,
  ChartColumn,
  Settings,
  ChevronRight,
  Wrench,
  History,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Badge } from "@/shared/components/ui/badge";

interface Menu {
  title: string;

  description: string;

  href: string;

  icon: React.ElementType;

  enabled: boolean;
}

const menus: Menu[] = [
  {
    title: "Produk",
    description:
      "Kelola produk, varian dan stok.",
    href: "/pos/products",
    icon: Boxes,
    enabled: true,
  },
  {
    title: "Transaksi",
    description:
      "Kasir dan penjualan.",
    href: "/pos/transactions",
    icon: ShoppingCart,
    enabled: true,
  },
  {
    title: "Riwayat",
    description:
      "Kelola data transaksi.",
    href: "/pos/history",
    icon: History,
    enabled: true,
  },
  {
    title: "Pemasukan lain",
    description:
      "Input data pemasukan lain.",
    href: "#",
    icon: ChartColumn,
    enabled: false,
  },
  {
    title: "Pengeluaran",
    description:
      "Input data pengeluaran.",
    href: "#",
    icon: ChartColumn,
    enabled: false,
  },
  {
    title: "Kasbon",
    description:
      "Kelola hutang piutang.",
    href: "/pos/debt",
    icon: Users,
    enabled: true,
  },
  {
    title: "Laporan",
    description:
      "Analisis penjualan.",
    href: "#",
    icon: ChartColumn,
    enabled: false,
  },
  {
    title: "Pengaturan",
    description:
      "Konfigurasi POS.",
    href: "/pos/settings",
    icon: Settings,
    enabled: true,
  },
];

export default function PosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="space-y-3">

        <Badge
          className="
            bg-amber-100
            text-amber-700
            hover:bg-amber-100
          "
        >
          🧪 Beta
        </Badge>

        <h1 className="text-3xl font-bold">
          Point of Sale
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Sistem kasir modern untuk
          mengelola produk, transaksi,
          customer, supplier dan laporan
          penjualan.
        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const content = (
            <Card
              className={`
                h-full
                transition-all
                ${
                  menu.enabled
                    ? "cursor-pointer hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                    : "opacity-70"
                }
              `}
            >
              <CardHeader>

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                    "
                  >
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  {menu.enabled ? (
                    <Badge>
                      Siap
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                    >
                      Dalam Pengembangan
                    </Badge>
                  )}

                </div>

                <CardTitle>
                  {menu.title}
                </CardTitle>

                <CardDescription>
                  {menu.description}
                </CardDescription>

              </CardHeader>

              <CardContent>

                {menu.enabled ? (
                  <div
                    className="
                      flex
                      items-center
                      text-sm
                      font-medium
                      text-primary
                    "
                  >
                    Buka Modul

                    <ChevronRight className="ml-2 h-4 w-4" />
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    <Wrench className="mr-2 h-4 w-4" />

                    Segera Hadir
                  </div>
                )}

              </CardContent>

            </Card>
          );

          if (!menu.enabled) {
            return (
              <div
                key={menu.title}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={menu.title}
              href={menu.href}
            >
              {content}
            </Link>
          );
        })}

      </div>

    </div>
  );
}