import { moduleRepository } from "./module.repository";

export class ModuleService {
  async getAll() {
    return moduleRepository.getAll();
  }
}

export const moduleService =
  new ModuleService();