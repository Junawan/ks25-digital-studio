"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { rootNavigation } from "./root-navigation";

export default function RootBottomNavigation() {

  const pathname = usePathname();

  const menus = rootNavigation;

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
      bg-zinc-950
      md:hidden
      "
    >

      <div className="grid grid-cols-5">

        {menus.map((item) => {

          const active =
  item.href
    ? pathname === item.href
    : false;

          const Icon =
            item.icon;

          return (

            <Link
  key={item.label}
  href={item.href ?? item.external ?? "/dashboard"}
  target={item.external ? "_blank" : undefined}
  rel={item.external ? "noreferrer" : undefined}

  className="
  flex
  flex-col
  items-center
  gap-1
  py-2.5
  transition
  "

>

              <Icon
                className={
                  active
                    ? "h-5 w-5 text-violet-500"
                    : "h-5 w-5 text-zinc-500"
                }
              />

              <span
                className={
                  active
                    ? "text-violet-500 text-xs"
                    : "text-zinc-500 text-xs"
                }
              >

                {item.label}

              </span>

            </Link>

          );

        })}

      </div>

    </nav>

  );

}
