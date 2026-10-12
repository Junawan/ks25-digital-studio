export type NotificationAudience =
  | "system-admin"
  | "user"
  | "company";
  
export type NotificationModule =
  | "subscription"
  | "live-assistant"
  | "packflow"
  | "system";

export type NotificationType =
  | "payment"
  | "subscription"
  | "playlist"
  | "ai"
  | "import"
  | "welcome"
  | "supply-request"
  | "update";

export type NotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface Notification {

  notificationId: string;

  companyId: string;

  // null = broadcast sesuai audience
  receiverId: string | null;

  receiverType: NotificationAudience;

  module: NotificationModule;

  type: NotificationType;

  priority: NotificationPriority;

  title: string;

  message: string;

  actionUrl: string;

  sourceId: string | null;

  isRead: boolean;

  createdAt: Date;

}
