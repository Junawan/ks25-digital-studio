"use client";

import { Menu, Bell, UserCircle2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface Props {
  title: string;
}

export default function MobileHeader({
  title,
}: Props) {
  return (
    <header
      className="
      sticky
      top-0
      z-50
      h-16
      border-b
      border-zinc-800
      bg-zinc-950/90
      backdrop-blur-xl
      "
    >
      <div
        className="
        mx-auto
        flex
        h-full
        items-center
        justify-between
        px-4
        "
      >
        {/* kiri */}

        <Button
          size="icon"
          variant="ghost"
          className="text-white"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* tengah */}

        <div
          className="
          flex-1
          text-center
          "
        >
          <h1
            className="
            text-lg
            font-semibold
            tracking-wide
            "
          >
            {title}
          </h1>
        </div>

        {/* kanan */}

        <div className="flex items-center gap-2">

          <Button
            size="icon"
            variant="ghost"
            className="text-white"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
          >
            <UserCircle2
              className="
              h-8
              w-8
              text-violet-400
              "
            />
          </Button>

        </div>

      </div>
    </header>
  );
}