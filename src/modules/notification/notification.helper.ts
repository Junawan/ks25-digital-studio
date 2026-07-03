import type { Notification } from "./notification.types";

export function getNotificationIcon(
  notification: Notification
) {

  switch (notification.type) {

    case "payment":
      return "💳";

    case "subscription":
      return "👑";

    case "playlist":
      return "🎬";

    case "ai":
      return "🤖";

    case "import":
      return "📦";

    case "welcome":
      return "🎉";

    case "update":
      return "🚀";

    default:
      return "🔔";

  }

}

export function getNotificationColor(
  notification: Notification
) {

  switch (notification.priority) {

    case "urgent":
      return "text-red-500";

    case "high":
      return "text-yellow-500";

    case "normal":
      return "text-violet-500";

    default:
      return "text-zinc-500";

  }

}