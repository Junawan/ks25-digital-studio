"use client";

import { useState } from "react";

import { authService } from "@/core/auth";

import { Button } from "@/components/ui/button";

import NotificationBell from "@/modules/notification/components/NotificationBell";
import NotificationDrawer from "@/modules/notification/components/NotificationDrawer";
import { UserCircle2 } from "lucide-react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useRouter } from "next/navigation";

import AccountMenu from "@/modules/account/components/AccountMenu";

export default function DashboardHeader() {

  const { workspace } = useWorkspace();

const company = workspace?.company;
const user = workspace?.user;

const router = useRouter();

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

      <header className="flex h-16 items-center justify-between border-b bg-background px-6">

        <h1 className="text-lg font-semibold">
          Dashboard
        </h1>

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