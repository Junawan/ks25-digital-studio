import { FirestoreTransactionRepository } from "../repositories/FirestoreTransactionRepository";

import { CheckoutUseCase } from "../usecases/CheckoutUseCase";

import { FirestoreCashierRepository } from "@/modules/pos/cashier/repositories/FirestoreCashierRepository";
import { GetTransactionsUseCase } from "../usecases/GetTransactionUseCase";
import { DeleteTransactionUseCase } from "../usecases/DeleteTransactionUseCase";

const transactionRepository =
  new FirestoreTransactionRepository();

const cashierRepository =
  new FirestoreCashierRepository();

export const transactionDI = {

  repository:
    transactionRepository,

  checkoutUseCase:
    new CheckoutUseCase(

      transactionRepository,

      cashierRepository,

    ),

  getTransactionsUseCase:
    new GetTransactionsUseCase(
      transactionRepository
    ),

    deleteTransactionUseCase:
  new DeleteTransactionUseCase(
    transactionRepository
  ),

};