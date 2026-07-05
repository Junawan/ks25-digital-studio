import { AnnouncementRepository } from "../announcement.repository";

export class DeleteAnnouncementUseCase {
  constructor(
    private readonly repository: AnnouncementRepository
  ) {}

  async execute(
    announcementId: string
  ): Promise<void> {
    await this.repository.delete(
      announcementId
    );
  }
}