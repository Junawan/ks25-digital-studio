import { announcementRepository } from "./announcement.repository";

export class AnnouncementService {

  async getAll() {

    return announcementRepository.getAll();

  }

}

export const announcementService =
  new AnnouncementService();