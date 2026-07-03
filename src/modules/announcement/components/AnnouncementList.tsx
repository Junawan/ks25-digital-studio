"use client";

import AnnouncementCard from "./AnnouncementCard";

import { useAnnouncements } from "../hooks/useAnnouncements";

export default function AnnouncementList() {

  const {

    announcements,

    loading,

  } = useAnnouncements();

  if (loading) {

    return (

      <div
        className="
        flex
        items-center
        justify-center
        py-16
        text-muted-foreground
        "
      >

        Memuat informasi...

      </div>

    );

  }

  if (announcements.length === 0) {

    return (

      <div
        className="
        rounded-2xl
        border
        border-dashed
        p-12
        text-center
        text-muted-foreground
        "
      >

        Belum ada informasi terbaru.

      </div>

    );

  }

  return (

    <div
      className="
      space-y-5
      "
    >

      {announcements.map(

        (announcement) => (

          <AnnouncementCard

            key={
              announcement.announcementId
            }

            announcement={
              announcement
            }

          />

        )

      )}

    </div>

  );

}