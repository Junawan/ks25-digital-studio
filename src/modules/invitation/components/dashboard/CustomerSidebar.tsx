"use client";

import Link from "next/link";
import { House } from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
];

export default function CustomerSidebar() {

  return (

    <aside
      className="
      w-72
      min-h-screen
      bg-white
      border-r
      "
    >

      <div className="p-8">

        <Link href="/">
        <h2
          className="
          text-3xl
          font-serif
          "
        >
          KS25 Studio
        </h2>

        <p className="text-zinc-500 mt-2">
          Home
        </p>
        </Link>

      </div>

      <nav className="px-4">

        {menus.map(menu => (

          <Link
            key={menu.href}
            href={menu.href}
            className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            hover:bg-stone-100
            mb-2
            "
          >

            <menu.icon size={22} />

            {menu.title}

          </Link>

        ))}

      </nav>

    </aside>

  );

}
