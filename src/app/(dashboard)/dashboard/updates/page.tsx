"use client";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import AnnouncementDialog from "@/modules/announcement/components/AnnouncementDialog";
import AnnouncementList from "@/modules/announcement/components/AnnouncementList";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function UpdatesPage() {
  const router = useRouter();
  const { workspace } = useWorkspace();

const canManageAnnouncement =
  workspace?.user.userId ===
  process.env.NEXT_PUBLIC_OWNER_UID;

  const [openDialog, setOpenDialog] =
  useState(false);

const [refreshKey, setRefreshKey] =
  useState(0);

  useAndroidBack(() => {
          router.back();
          return true;
        });

  return (

    <div
      className="
      mx-auto
      max-w-4xl
      space-y-8
      "
    >

      <div>

        <h1
          className="
          text-3xl
          font-bold
          "
        >

          Info & Update

        </h1>

        <p
          className="
          mt-2
          text-muted-foreground
          "
        >

          Informasi terbaru mengenai
          fitur, modul, perbaikan,
          maintenance,
          dan pengumuman KS25 Digital Studio.

        </p>

      </div>

      <AnnouncementList
    refreshKey={refreshKey}
/>

      <AnnouncementDialog
  open={openDialog}
  onOpenChange={setOpenDialog}
  publishedBy={
    workspace?.user.userId ?? ""
  }
  onSuccess={() => {

    setRefreshKey(
      (v) => v + 1
    );

  }}
/>

      {canManageAnnouncement && (

<Button
  size="icon"
  className="
fixed
bottom-[96px]
right-5
z-50
h-14
w-14
rounded-full
shadow-xl
"
  onClick={() =>
    setOpenDialog(true)
  }
>

+

</Button>

)}

    </div>

  );

}