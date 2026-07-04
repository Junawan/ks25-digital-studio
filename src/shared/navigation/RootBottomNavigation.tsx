"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

import { rootNavigation } from "./root-navigation";

export default function RootBottomNavigation() {

  const pathname = usePathname();

  const router =
  useRouter();

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

      <div
        className="
        grid
        grid-cols-5
        "
      >

        {rootNavigation.map((item) => {

          const active =
  item.href
    ? pathname === item.href
    : false;

          const Icon =
            item.icon;

          return (

            <button

  key={item.label}

  onClick={() => {

    if (item.external) {

      window.open(
        item.external,
        "_blank"
      );

      return;

    }

    if (item.href) {

      router.push(
        item.href
      );

    }

  }}

  className="
  flex
  flex-col
  items-center
  gap-1
  py-3
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
                    ? "text-violet-500 text-sm"
                    : "text-zinc-500 text-sm"
                }
              >

                {item.label}

              </span>

            </button>

          );

        })}

      </div>

    </nav>

  );

}