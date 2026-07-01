import { companyModuleRepository } from "./company-module.repository";

export class CompanyModuleService {
  install(companyId: string, moduleId: string) {
    return companyModuleRepository.install(
      companyId,
      moduleId
    );
  }

  getInstalled(companyId: string) {
    return companyModuleRepository.getInstalled(
      companyId
    );
  }
}

export const companyModuleService =
  new CompanyModuleService();