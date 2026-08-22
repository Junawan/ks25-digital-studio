import {
  Debt,
  DebtType,
} from "../types/debt";

import { DebtRepository } from "../repositories/DebtRepository";

interface CreateDebtInput {
  companyId: string;

  name: string;

  amount: number;

  type: DebtType;

  note?: string | null;

  date: Date;
}

export class CreateDebtUseCase {
  constructor(
    private readonly repository: DebtRepository
  ) {}

  async execute(
    input: CreateDebtInput
  ): Promise<Debt> {
    const now = new Date();

    const debt: Debt = {
      debtId:
  `debt_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`,

      companyId: input.companyId,

      name: input.name,

      type: input.type,

      amount: input.amount,

      totalPaid: 0,

      remainingAmount: input.amount,

      status: "unpaid",

      note: input.note ?? null,

      date: input.date,

      payments: [],

      createdAt: now,

      updatedAt: now,
    };

    return this.repository.create(
      debt
    );
  }
}