"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Menu,
  Bell,
  UserCircle2,
  X,
  LayoutDashboard,
  Grid2x2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import NotificationBell from "@/modules/notification/components/NotificationBell";

import NotificationDrawer
from "@/modules/notification/components/NotificationDrawer";
import AccountMenu from "@/modules/account/components/AccountMenu";


interface Props {
  title: string;
}

export default function MobileHeader({
  title,
}: Props) {
  const [open, setOpen] = useState(false);
const router = useRouter();


  const [accountOpen, setAccountOpen] =
    useState(false);

    const [
  notificationOpen,
  setNotificationOpen,
] = useState(false);

  return (
    <>
      <header
        className="
        sticky
        top-0
        z-40
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
            onClick={() =>
              setOpen(true)
            }
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* tengah */}

          <h1
            className="
            flex-1
            text-center
            text-lg
            font-semibold
            text-white
            "
          >
            {title}
          </h1>

          {/* kanan */}

          <div className="flex items-center gap-2">

            <NotificationBell
  onClick={() =>
    setNotificationOpen(true)
  }
/>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() =>
                setAccountOpen(true)
              }
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

      {/* ================= DRAWER ================= */}

      {open && (
        <>
          <div
            className="
            fixed
            inset-0
            z-50
            bg-black/60
            "
            onClick={() =>
              setOpen(false)
            }
          />

          <aside
            className="
            fixed
            left-0
            top-0
            z-[60]
            flex
            h-screen
            w-72
            flex-col
            bg-zinc-950
            "
          >
            <div
              className="
              flex
              items-center
              justify-between
              border-b
              border-zinc-800
              p-5
              "
            >
              <div>

                <h2 className="font-bold text-white">

                  KS25 Digital Studio

                </h2>

                <p className="text-xs text-zinc-400">

                  Trial Plan

                </p>

              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setOpen(false)
                }
              >
                <X className="h-5 w-5" />
              </Button>

            </div>

            <nav className="flex-1 space-y-1 p-4">

              <MenuItem
                icon={
                  <LayoutDashboard className="h-5 w-5" />
                }
                title="Dashboard"
                href="/dashboard"
                onClick={() =>
                  setOpen(false)
                }
              />

              <MenuItem
                icon={
                  <Grid2x2 className="h-5 w-5" />
                }
                title="My Apps"
                href="/my-apps"
                onClick={() =>
                  setOpen(false)
                }
              />

              <Button
  variant="ghost"
  className="
    w-full
    justify-start
    rounded-xl
    px-4
    py-6
    text-zinc-300
    hover:bg-zinc-800
    hover:text-white
  "
  onClick={() => {
    setOpen(false);
    router.push("/scanner");
  }}
>
  <Sparkles className="mr-3 h-5 w-5" />

  Scanner
</Button>

            </nav>

          </aside>
        </>
      )}

      {/* ================= ACCOUNT ================= */}

      <AccountMenu
  open={accountOpen}
  onClose={() =>
    setAccountOpen(false)
  }
  mobile
/>
      <NotificationDrawer

  open={notificationOpen}

  onClose={() =>
    setNotificationOpen(false)
  }

/>
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  onClick: () => void;
}

function MenuItem({
  icon,
  title,
  href,
  onClick,
}: MenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
      flex
      items-center
      gap-3
      rounded-xl
      px-4
      py-3
      text-zinc-300
      transition
      hover:bg-zinc-800
      hover:text-white
      "
    >
      {icon}

      <span>{title}</span>
    </Link>
  );
}