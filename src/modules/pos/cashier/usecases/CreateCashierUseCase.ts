import { CashierRepository } from "../repositories/CashierRepository";

export class CreateCashierUseCase {
  constructor(
    private readonly repository: CashierRepository
  ) {}

  async execute(input: {
    companyId: string;
    name: string;
  }) {
    const name = input.name.trim();

    if (!name) {
      throw new Error(
        "Nama kasir wajib diisi."
      );
    }

    const nameLower =
      name.toLowerCase();

    const exists =
      await this.repository.findByName(
        input.companyId,
        nameLower
      );

    if (exists) {
      throw new Error(
        "Nama kasir sudah digunakan."
      );
    }

    const cashier = {
      cashierId:
        crypto.randomUUID(),

      companyId:
        input.companyId,

      name,

      nameLower,

      active: true,

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    };

    await this.repository.create(
      cashier
    );

    return cashier;
  }
}