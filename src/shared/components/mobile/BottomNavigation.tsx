"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Package,
  Play,
  ListMusic,
  Settings,
} from "lucide-react";

const menus = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/live-assistant/products",
    icon: Package,
    label: "Produk",
  },
  {
    href: "/live-assistant",
    icon: Play,
    label: "Live",
    center: true,
  },
  {
    href: "/live-assistant/playlists",
    icon: ListMusic,
    label: "Playlist",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="
      fixed
      bottom-0
      left-0
      right-0
      z-50
      border-t
      border-zinc-800
      bg-zinc-950/95
      backdrop-blur-xl
      "
    >
      <div
        className="
        mx-auto
        flex
        h-20
        max-w-lg
        items-center
        justify-around
        px-2
        "
      >
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href ||
            pathname.startsWith(
              menu.href + "/"
            );

          if (menu.center) {
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="
                -mt-8
                flex
                flex-col
                items-center
                "
              >
                <div
                  className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-600
                  shadow-lg
                  shadow-violet-700/40
                  transition
                  hover:scale-105
                  "
                >
                  <Icon
                    className="
                    h-7
                    w-7
                    text-white
                    "
                  />
                </div>

                <span
                  className="
                  mt-1
                  text-xs
                  text-zinc-300
                  "
                >
                  Live
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="
              flex
              flex-col
              items-center
              gap-1
              "
            >
              <Icon
                className={`
                  h-6
                  w-6
                  transition
                  ${
                    active
                      ? "text-violet-500"
                      : "text-zinc-500"
                  }
                `}
              />

              <span
                className={`
                  text-xs
                  ${
                    active
                      ? "text-violet-400"
                      : "text-zinc-500"
                  }
                `}
              >
                {menu.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}