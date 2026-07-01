import { companyRepository } from "./company.repository";

import type { Company } from "@/modules/company/company.types";

export class CompanyService {
  async create(company: Company) {
    return companyRepository.create(company);
  }

  async getById(companyId: string) {
  return companyRepository.getById(companyId);
}
}

export const companyService = new CompanyService();