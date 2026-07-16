import { CashierRepository } from "../repositories/CashierRepository";

export class DeleteCashierUseCase {
  constructor(
    private readonly repository: CashierRepository
  ) {}

  async execute(
    cashierId: string
  ) {
    return this.repository.delete(
      cashierId
    );
  }
}