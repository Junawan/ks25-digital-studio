import { CashierRepository } from "../repositories/CashierRepository";

export class GetCashiersUseCase {
  constructor(
    private readonly repository:
        CashierRepository
) {}

  async execute(
    companyId: string
  ) {
    return this.repository.getAll(
      companyId
    );
  }
}