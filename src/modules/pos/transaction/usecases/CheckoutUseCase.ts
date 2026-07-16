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

    if (
      input.paymentMethod === "cash" &&
      input.paidAmount < total
    ) {
      throw new Error(
        "Uang diterima kurang."
      );
    }

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

        total,

        paidAmount:
          input.paymentMethod ===
          "cash"
            ? input.paidAmount
            : total,

        changeAmount:
          input.paymentMethod ===
          "cash"
            ? input.paidAmount -
              total
            : 0,

        status: "paid",

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