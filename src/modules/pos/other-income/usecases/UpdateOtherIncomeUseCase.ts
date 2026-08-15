import { OtherIncomeRepository } from "../repositories/OtherIncomeRepository";
import { OtherIncome } from "../types/otherIncome";

export class UpdateOtherIncomeUseCase {
  constructor(
    private readonly repository: OtherIncomeRepository
  ) {}

  async execute(
    income: OtherIncome
  ): Promise<OtherIncome> {
    return this.repository.update({
      ...income,
      updatedAt:
        new Date(),
    });
  }
}