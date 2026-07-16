import { CashierRepository } from "../repositories/CashierRepository";

import { Cashier } from "../types/cashier";

export class UpdateCashierUseCase {
  constructor(
    private readonly repository: CashierRepository
  ) {}

  async execute(
    cashier: Cashier
  ) {
    await this.repository.update({
      ...cashier,

      name: cashier.name.trim(),

  nameLower:
    cashier.name
      .trim()
      .toLowerCase(),

      updatedAt:
        new Date(),
    });
  }
}