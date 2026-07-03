import { announcementService } from "../announcement.service";

export class GetAnnouncementsUseCase {

  async execute() {

    return announcementService.getAll();

  }

}

export const getAnnouncementsUseCase =
  new GetAnnouncementsUseCase();