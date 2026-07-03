"use client";

import {
  Sparkles,
  Wrench,
  Package,
  Megaphone,
  Tag,
  Lightbulb,
} from "lucide-react";

import type {
  Announcement,
} from "../announcement.types";

interface Props {

  announcement: Announcement;

}

export default function AnnouncementCard({

  announcement,

}: Props) {

  const icon = getIcon(
    announcement.category
  );

  return (

    <div
      className="
      rounded-2xl
      border
      bg-background
      p-5
      shadow-sm
      "
    >

      <div className="flex gap-4">

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-violet-100
          text-violet-600
          dark:bg-violet-900/30
          "
        >

          {icon}

        </div>

        <div className="flex-1">

          <h3
            className="
            text-lg
            font-semibold
            "
          >

            {announcement.title}

          </h3>

          {announcement.version && (

            <div
              className="
              mt-1
              text-sm
              text-violet-600
              "
            >

              v{announcement.version}

            </div>

          )}

          <p
            className="
            mt-3
            whitespace-pre-line
            text-sm
            text-muted-foreground
            "
          >

            {announcement.content}

          </p>

          <div
            className="
            mt-4
            text-xs
            text-muted-foreground
            "
          >

            {announcement.publishedAt.toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}

          </div>

        </div>

      </div>

    </div>

  );

}

function getIcon(
  category: Announcement["category"]
) {

  switch (category) {

    case "feature":
      return <Sparkles className="h-6 w-6" />;

    case "bugfix":
      return <Wrench className="h-6 w-6" />;

    case "module":
      return <Package className="h-6 w-6" />;

    case "maintenance":
      return <Megaphone className="h-6 w-6" />;

    case "promo":
      return <Tag className="h-6 w-6" />;

    case "tips":
      return <Lightbulb className="h-6 w-6" />;

    default:
      return <Sparkles className="h-6 w-6" />;

  }

}