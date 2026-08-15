import { OtherIncomeRepository } from "../repositories/OtherIncomeRepository";

export class GetOtherIncomesUseCase {
  constructor(
    private readonly repository: OtherIncomeRepository
  ) {}

  async execute(
    companyId: string
  ) {
    return this.repository.getAll(
      companyId
    );
  }
}