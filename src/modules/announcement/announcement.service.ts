import { announcementRepository } from "./announcement.repository";

import { CreateAnnouncementUseCase } from "./usecases/CreateAnnouncementUseCase";
import { UpdateAnnouncementUseCase } from "./usecases/UpdateAnnouncementUseCase";
import { DeleteAnnouncementUseCase } from "./usecases/DeleteAnnouncementUseCase";

export class AnnouncementService {

  async getAll() {

    return announcementRepository.getAll();

  }

}

export const announcementService =
  new AnnouncementService();

  export const createAnnouncementUseCase =
  new CreateAnnouncementUseCase(
    announcementRepository
  );

export const updateAnnouncementUseCase =
  new UpdateAnnouncementUseCase(
    announcementRepository
  );

export const deleteAnnouncementUseCase =
  new DeleteAnnouncementUseCase(
    announcementRepository
  );