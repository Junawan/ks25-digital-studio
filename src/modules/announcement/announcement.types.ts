export type AnnouncementCategory =
  | "feature"
  | "improvement"
  | "bugfix"
  | "maintenance"
  | "promotion";

export interface Announcement {
  announcementId: string;

  title: string;

  content: string;

  category: AnnouncementCategory;

  active: boolean;

  isPopup: boolean;

  publishedAt: Date;

  publishedBy: string;
}