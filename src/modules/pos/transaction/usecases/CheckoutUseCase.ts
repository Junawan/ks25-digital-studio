import {
  CartItem,
  PaymentMethod,
  Transaction,
  TransactionItem,
} from "../types/transaction";

import { v4 as uuid } from "uuid";

import { TransactionRepository } from "../repositories/TransactionRepository";

import { generateInvoiceNumber } from "../utils/generateInvoiceNumber";
import { CashierRepository } from "../../cashier/repositories/CashierRepository";

interface CheckoutInput {
  companyId: string;

  cashierId: string;

  customerName: string;

  paymentMethod: PaymentMethod;

  discount: number;

  dp: number;

  keterangan: string;

  paidAmount: number;

  cart: CartItem[];
}

export class CheckoutUseCase {
  constructor(
    private readonly transactionRepository:
        TransactionRepository,

    private readonly cashierRepository:
        CashierRepository,
) {}

  async execute(
    input: CheckoutInput
  ): Promise<Transaction> {
    if (input.cart.length === 0) {
      throw new Error(
        "Keranjang masih kosong."
      );
    }

    const subtotal =
      input.cart.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

    const total = Math.max(
  0,
  subtotal - input.discount
);

const dp = Math.max(
  0,
  input.dp || 0
);

if (dp > total) {
  throw new Error(
    "DP tidak boleh lebih besar dari total transaksi."
  );
}

const paymentTarget =
  dp > 0
    ? dp
    : total;

if (
  input.paidAmount < paymentTarget
) {
  throw new Error(
    dp > 0
      ? "Pembayaran DP masih kurang."
      : "Uang diterima kurang."
  );
}

const paymentAmount =
  input.paymentMethod === "cash"
    ? input.paidAmount
    : paymentTarget;

const remainingAmount =
  Math.max(
    0,
    total - paymentAmount
  );

    const cashier =
    await this.cashierRepository
        .findById(
            input.cashierId
        );

if (!cashier) {
    throw new Error(
        "Kasir tidak ditemukan."
    );
}

    const items: TransactionItem[] =
      input.cart.map((item) => ({
        productId:
          item.productId,

        variantId:
          item.variantId,

        productName:
          item.productName,

        variantName:
          item.variantName,

        barcode:
          item.barcode,

        price:
          item.price,

        qty:
          item.qty,

        subtotal:
          item.subtotal,
      }));

      const id = uuid();

    const transaction: Transaction =
      {
        transactionId: id,

        companyId:
          input.companyId,

        invoiceNumber:
          generateInvoiceNumber(),

        cashierId:
          input.cashierId,

          cashierName:
    cashier.name,

        customerName:
          input.customerName,

        paymentMethod:
          input.paymentMethod,

        subtotal,

        discount:
          input.discount,

          dp,

keterangan:
  input.keterangan || "",

        total,

        paidAmount:
  paymentAmount,

remainingAmount,

changeAmount:
  input.paymentMethod === "cash"
    ? Math.max(
        0,
        input.paidAmount -
          paymentTarget
      )
    : 0,

status:
  remainingAmount > 0
    ? "unpaid"
    : "paid",

        items,

        createdAt:
          new Date(),

        updatedAt:
          new Date(),
      };

    return this.transactionRepository.create(
      transaction
    );
  }
}