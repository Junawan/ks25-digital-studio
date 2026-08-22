import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "../types/expense";

export interface ExpenseRepository {
  create(
    input: CreateExpenseInput
  ): Promise<Expense>;

  getByMonth(
    companyId: string,
    year: number,
    month: number
  ): Promise<Expense[]>;

  update(
    expenseId: string,
    input: UpdateExpenseInput
  ): Promise<void>;

  delete(
    expenseId: string
  ): Promise<void>;
}