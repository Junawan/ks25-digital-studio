"use client";

import { useState } from "react";

import { authService } from "@/core/auth";

import { Button } from "@/components/ui/button";

import NotificationBell from "@/modules/notification/components/NotificationBell";
import NotificationDrawer from "@/modules/notification/components/NotificationDrawer";
import { UserCircle2 } from "lucide-react";


import AccountMenu from "@/modules/account/components/AccountMenu";

export default function DashboardHeader() {

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
  accountOpen,
  setAccountOpen,
] = useState(false);

  return (
    <>

      <header className="flex min-h-16 items-center justify-between gap-4 border-b bg-background px-6 py-2">

        <div className="min-w-0">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Untuk penggunaan di PC/Laptop, buka{" "}
            <a className="font-medium underline underline-offset-2" href="https://www.ks25studio.web.id" target="_blank" rel="noreferrer">www.ks25studio.web.id</a>
          </p>
        </div>

        <div className="flex items-center gap-3">

          <NotificationBell
            onClick={() =>
              setNotificationOpen(true)
            }
          />

          <Button
  size="icon"
  variant="ghost"
  onClick={() =>
    setAccountOpen(true)
  }
>

  <UserCircle2
    className="h-7 w-7 text-foreground"
  />

</Button>

          <Button
            variant="outline"
            onClick={async () => {
              await authService.logout();
            }}
          >
            Logout
          </Button>

        </div>

      </header>

      <NotificationDrawer
        open={notificationOpen}
        onClose={() =>
          setNotificationOpen(false)
        }
      />

      <AccountMenu
  open={accountOpen}
  onClose={() =>
    setAccountOpen(false)
  }
/>

    </>
  );

}
