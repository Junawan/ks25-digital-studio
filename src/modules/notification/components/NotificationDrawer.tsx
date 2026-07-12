"use client";

import { useRouter } from "next/navigation";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useNotifications } from "../hooks/useNotifications";

import { notificationService } from "../notification.service";

import {
  getNotificationIcon,
} from "../notification.helper";

interface Props {

  open: boolean;

  onClose: () => void;

}

export default function NotificationDrawer({

  open,

  onClose,

}: Props) {

  const router = useRouter();

  const {

  notifications,

  loading,

} = useNotifications();

  if (!open) {

    return null;

  }

  return (

    <>

      <div

        className="
        fixed
        inset-0
        z-[80]
        bg-black/60
        "

        onClick={onClose}

      />

      <div

        className="
        fixed
        bottom-0
        left-0
        right-0
        z-[81]
        h-[70vh]
        rounded-t-3xl
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

          <h2

            className="
            text-lg
            font-semibold
            text-white
            "

          >

            Notifikasi

          </h2>

          <Button

            size="icon"

            variant="ghost"

            onClick={onClose}

          >

            <X className="h-5 w-5"/>

          </Button>

        </div>

        {loading ? (

          <div

            className="
            flex
            h-40
            items-center
            justify-center
            "

          >

            Memuat...

          </div>

        ) : notifications.length === 0 ? (

          <div

            className="
            flex
            h-40
            items-center
            justify-center
            text-red
            "

          >

            Belum ada notifikasi

          </div>

        ) : (

          <div

            className="
            h-[calc(70vh-70px)]
            overflow-y-auto
            "

          >

            {notifications.map(

              (notification) => (

                <button

                  key={
                    notification.notificationId
                  }

                  className="
                  flex
                  w-full
                  gap-4
                  border-b
                  border-zinc-800
                  p-4
                  text-left
                  text-white
                  transition
                  hover:bg-zinc-900
                  "

                  onClick={async () => {

  if (!notification.isRead) {

    await notificationService.markAsRead(

      notification.notificationId

    );


  }

  onClose();

  router.push(

    notification.actionUrl

  );

}}

                >

                  <div className="text-3xl">

                    {

                      getNotificationIcon(

                        notification

                      )

                    }

                  </div>

                  <div className="flex flex-1 gap-3">

  {!notification.isRead && (

    <div

      className="
      mt-2
      h-2.5
      w-2.5
      rounded-full
      bg-sky-500
      "

    />

  )}

  <div className="flex-1 text-yellow">

                      {notification.title}

                    </div>

                    <div

                      className="
                      mt-1
                      text-sm
                      text-yellow
                      "

                    >

                      {notification.message}

                    </div>
                    <div className="mt-2 text-xs text-white">

  {notification.createdAt instanceof Date

    ? notification.createdAt.toLocaleString("id-ID")

    : ""}

</div>

                  </div>

                </button>

              )

            )}

          </div>

        )}

      </div>

    </>

  );

}