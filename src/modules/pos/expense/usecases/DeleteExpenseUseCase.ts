import { ExpenseRepository }
from "../repositories/ExpenseRepository";

export class DeleteExpenseUseCase {

  constructor(
    private readonly repository:
      ExpenseRepository
  ) {}

  async execute(
    expenseId: string
  ): Promise<void> {

    await this.repository.delete(
      expenseId
    );
  }
}