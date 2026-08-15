import { OtherIncomeRepository } from "../repositories/OtherIncomeRepository";

export class DeleteOtherIncomeUseCase {
  constructor(
    private readonly repository: OtherIncomeRepository
  ) {}

  async execute(
    incomeId: string
  ): Promise<void> {
    await this.repository.delete(
      incomeId
    );
  }
}