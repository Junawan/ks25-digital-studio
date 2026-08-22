import {
  Debt,
  DebtStatus,
} from "../types/debt";

import { DebtRepository } from "../repositories/DebtRepository";

export class GetDebtsUseCase {
  constructor(
    private readonly repository: DebtRepository
  ) {}

  async execute(
    companyId: string,
    status: DebtStatus | "all" = "unpaid"
  ): Promise<Debt[]> {
    return this.repository.getByStatus(
      companyId,
      status
    );
  }
}