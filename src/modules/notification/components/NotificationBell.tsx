"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useNotifications } from "../hooks/useNotifications";

interface Props {
  onClick: () => void;
}

export default function NotificationBell({
  onClick,
}: Props) {

  const {
  notifications,
  loading,
} = useNotifications();

const unread =
  notifications.reduce(

    (total, notification) =>

      notification.isRead

        ? total

        : total + 1,

    0

  );

  return (

    <div className="relative">

      <Button
      disabled={loading}
        size="icon"
        variant="ghost"
        className="text-violet-400"
        onClick={onClick}
      >

        <Bell className="h-5 w-5" />

      </Button>

      {!loading && unread > 0 && (

        <div
          className="
          absolute
          -right-1
          -top-1
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          bg-red-600
          px-1
          text-[10px]
          font-bold
          text-foreground
          "
        >

          {unread > 99
            ? "99+"
            : unread}

        </div>

      )}

    </div>

  );

}