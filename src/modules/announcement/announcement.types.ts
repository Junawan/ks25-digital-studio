export type AnnouncementCategory =
  | "feature"
  | "bugfix"
  | "module"
  | "maintenance"
  | "promo"
  | "tips";

export interface Announcement {

  announcementId: string;

  title: string;

  content: string;

  category: AnnouncementCategory;

  image?: string | null;

  version?: string | null;

  active: boolean;

  publishedAt: Date;

  publishedBy: string;

}