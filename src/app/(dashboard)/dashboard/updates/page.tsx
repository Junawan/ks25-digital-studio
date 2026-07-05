"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import AnnouncementList from "@/modules/announcement/components/AnnouncementList";
import { useRouter } from "next/navigation";

export default function UpdatesPage() {
  const router = useRouter();

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

      <AnnouncementList />

    </div>

  );

}