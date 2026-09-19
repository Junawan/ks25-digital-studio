import {
  CreateExpenseInput,
  Expense,
} from "../types/expense";

import { ExpenseRepository }
from "../repositories/ExpenseRepository";

export class CreateExpenseUseCase {

  constructor(
    private readonly repository:
      ExpenseRepository
  ) {}

  async execute(
    input: CreateExpenseInput
  ): Promise<Expense> {

    if (
      !input.source.trim()
    ) {
      throw new Error(
        "Sumber pengeluaran wajib diisi."
      );
    }

    if (
      input.amount <= 0
    ) {
      throw new Error(
        "Nominal pengeluaran harus lebih dari 0."
      );
    }

    if (
      !(input.date instanceof Date) ||
      Number.isNaN(
        input.date.getTime()
      )
    ) {
      throw new Error(
        "Tanggal pengeluaran wajib diisi."
      );
    }

    return this.repository.create(
      input
    );
  }
}