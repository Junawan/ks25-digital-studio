import { AnnouncementRepository } from "../announcement.repository";
import {
  AnnouncementCategory,
} from "../announcement.types";

interface Input {
  title: string;

  content: string;

  category: AnnouncementCategory;

  isPopup: boolean;

  active: boolean;
}

export class UpdateAnnouncementUseCase {
  constructor(
    private readonly repository: AnnouncementRepository
  ) {}

  async execute(
    announcementId: string,
    input: Input
  ): Promise<void> {
    await this.repository.update(
      announcementId,
      {
        title: input.title.trim(),

        content: input.content.trim(),

        category: input.category,

        isPopup: input.isPopup,

        active: input.active,
      }
    );
  }
}