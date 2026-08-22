import { Expense }
from "../types/expense";

import { ExpenseRepository }
from "../repositories/ExpenseRepository";

export class GetExpensesUseCase {

  constructor(
    private readonly repository:
      ExpenseRepository
  ) {}

  async execute(
    companyId: string,
    year: number,
    month: number
  ): Promise<Expense[]> {

    return this.repository.getByMonth(
      companyId,
      year,
      month
    );
  }
}