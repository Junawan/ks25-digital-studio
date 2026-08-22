import { DebtRepository } from "../repositories/DebtRepository";

export class DeleteDebtUseCase {
  constructor(
    private readonly repository: DebtRepository
  ) {}

  async execute(
    debtId: string
  ): Promise<void> {
    await this.repository.delete(
      debtId
    );
  }
}