export interface Expense {
  expenseId: string;

  companyId: string;

  source: string;

  amount: number;

  description: string;

  date: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateExpenseInput {
  companyId: string;

  source: string;

  amount: number;

  description?: string;

  date: Date;
}

export interface UpdateExpenseInput {
  source: string;

  amount: number;

  description?: string;

  date: Date;
}