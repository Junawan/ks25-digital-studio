import {
  PaymentMethod,
  Transaction,
} from "../types/transaction";

import {
  TransactionRepository,
} from "../repositories/TransactionRepository";

interface SettleTransactionInput {
  transactionId: string;
  paymentMethod: PaymentMethod;
  paidAmount: number;
}

export class SettleTransactionUseCase {

  constructor(
    private readonly transactionRepository:
      TransactionRepository
  ) {}

  async execute(
    input: SettleTransactionInput
  ): Promise<Transaction> {

    /*
     * Ambil transaksi lama
     */
    const transaction =
      await this.transactionRepository.getById(
        input.transactionId
      );

    if (!transaction) {
      throw new Error(
        "Transaksi tidak ditemukan."
      );
    }

    /*
     * Transaksi dibatalkan
     */
    if (
      transaction.status ===
      "cancelled"
    ) {
      throw new Error(
        "Transaksi sudah dibatalkan."
      );
    }

    /*
     * Transaksi sudah lunas
     */
    if (
      transaction.status ===
      "paid"
    ) {
      throw new Error(
        "Transaksi sudah lunas."
      );
    }

    /*
     * Pastikan memang masih ada
     * pembayaran yang harus diselesaikan
     */
    const remainingAmount =
      Math.max(
        0,
        transaction.remainingAmount
      );

    if (remainingAmount <= 0) {
      throw new Error(
        "Transaksi tidak memiliki sisa pembayaran."
      );
    }

    /*
     * Nominal yang dimasukkan kasir
     *
     * Ini adalah NOMINAL PELUNASAN,
     * bukan total transaksi.
     *
     * Contoh:
     * Total 500.000
     * DP 100.000
     * Sisa 400.000
     *
     * Kasir cukup memasukkan:
     * 400.000
     */
    const paymentAmount =
      Math.max(
        0,
        input.paidAmount
      );

    if (paymentAmount <= 0) {
      throw new Error("Nominal pembayaran harus lebih dari 0.");
    }

    /*
     * Total pembayaran pelanggan
     *
     * Contoh:
     *
     * DP              100.000
     * Pelunasan       400.000
     * ------------------------
     * Total dibayar   500.000
     */
    const appliedAmount = Math.min(paymentAmount, remainingAmount);
    const totalPaid =
      transaction.paidAmount +
      appliedAmount;
    const nextRemaining = Math.max(0, remainingAmount - appliedAmount);

    /*
     * Kembalian hanya untuk Cash
     */
    const changeAmount =
      input.paymentMethod === "cash"
        ? Math.max(
            0,
              paymentAmount -
              remainingAmount
          )
        : 0;

    /*
     * Update transaksi yang sama
     */
    const updatedTransaction:
      Transaction = {

      ...transaction,

      paymentMethod:
        input.paymentMethod,

      paidAmount:
        totalPaid,

      remainingAmount: nextRemaining,

      changeAmount,

      status: nextRemaining === 0 ? "paid" : "unpaid",

      updatedAt:
        new Date(),
    };

    /*
     * Simpan kembali menggunakan
     * transactionId yang sama.
     */
    return this.transactionRepository.update(
      updatedTransaction
    );
  }
}
