import { randomUUID } from "crypto";
import { Announcement, AnnouncementCategory } from "../announcement.types";
import { AnnouncementRepository } from "../announcement.repository";


interface Input {
  title: string;

  content: string;

  category: AnnouncementCategory;

  isPopup: boolean;

  publishedBy: string;
}

export class CreateAnnouncementUseCase {
  constructor(
    private readonly repository: AnnouncementRepository
  ) {}

  async execute(
    input: Input
  ): Promise<void> {
    const announcement: Announcement = {
      announcementId: randomUUID(),

      title: input.title.trim(),

      content: input.content.trim(),

      category: input.category,

      active: true,

      isPopup: input.isPopup,

      publishedAt: new Date(),

      publishedBy: input.publishedBy,
    };

    await this.repository.create(
      announcement
    );
  }
}