import { OtherIncomeRepository } from "../repositories/OtherIncomeRepository";
import { OtherIncome } from "../types/otherIncome";

export interface CreateOtherIncomeInput {
  companyId: string;

  source: string;

  amount: number;

  description?: string;

  date: Date;
}

export class CreateOtherIncomeUseCase {
  constructor(
    private readonly repository: OtherIncomeRepository
  ) {}

  async execute(
    input: CreateOtherIncomeInput
  ): Promise<OtherIncome> {
    const now = new Date();

    const income: OtherIncome = {
      incomeId: crypto.randomUUID(),

      companyId:
        input.companyId,

      source:
        input.source.trim(),

      amount:
        input.amount,

      description:
        input.description?.trim() ?? "",

      date:
        input.date,

      createdAt:
        now,

      updatedAt:
        now,
    };

    return this.repository.create(
      income
    );
  }
}