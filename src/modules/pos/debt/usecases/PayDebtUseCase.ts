import {
  Debt,
  DebtPayment,
} from "../types/debt";

import { DebtRepository } from "../repositories/DebtRepository";

interface PayDebtInput {
  debtId: string;

  amount: number;

  note?: string | null;

  paidAt: Date;
}

export class PayDebtUseCase {
  constructor(
    private readonly repository: DebtRepository
  ) {}

  async execute(
    input: PayDebtInput
  ): Promise<Debt> {
    const debt =
      await this.repository.getById(
        input.debtId
      );

    if (!debt) {
      throw new Error(
        "Data hutang tidak ditemukan."
      );
    }

    if (debt.status === "paid") {
      throw new Error(
        "Hutang ini sudah lunas."
      );
    }

    if (
      input.amount <= 0
    ) {
      throw new Error(
        "Jumlah pembayaran harus lebih dari 0."
      );
    }

    if (
      input.amount >
      debt.remainingAmount
    ) {
      throw new Error(
        "Jumlah pembayaran melebihi sisa hutang."
      );
    }

    const now = new Date();

    const payment: DebtPayment = {
      paymentId:
  `payment_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`,

      amount:
        input.amount,

      note:
        input.note ?? null,

      paidAt:
        input.paidAt,

      createdAt:
        now,
    };

    const totalPaid =
      debt.totalPaid +
      input.amount;

    const remainingAmount =
      Math.max(
        0,
        debt.amount -
          totalPaid
      );

    const updated: Debt = {
      ...debt,

      totalPaid,

      remainingAmount,

      status:
        remainingAmount === 0
          ? "paid"
          : "unpaid",

      payments: [
        ...debt.payments,
        payment,
      ],

      updatedAt:
        now,
    };

    await this.repository.update(
      updated
    );

    return updated;
  }
}