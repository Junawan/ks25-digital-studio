import { FirestoreTransactionRepository } from "../repositories/FirestoreTransactionRepository";

import { CheckoutUseCase } from "../usecases/CheckoutUseCase";

import { FirestoreCashierRepository } from "@/modules/pos/cashier/repositories/FirestoreCashierRepository";
import { GetTransactionsUseCase } from "../usecases/GetTransactionUseCase";
import { DeleteTransactionUseCase } from "../usecases/DeleteTransactionUseCase";
import { FirestoreDraftTransactionRepository } from "../repositories/FirestoreDraftTransactionRepository";
import { SettleTransactionUseCase } from "../usecases/SettleTransactionUseCase";

const transactionRepository =
  new FirestoreTransactionRepository();

const cashierRepository =
  new FirestoreCashierRepository();

export const transactionDI = {

  repository:
    transactionRepository,

    draftRepository:
  new FirestoreDraftTransactionRepository(),

  checkoutUseCase:
    new CheckoutUseCase(

      transactionRepository,

      cashierRepository,

    ),

  getTransactionsUseCase:
    new GetTransactionsUseCase(
      transactionRepository
    ),

    settleTransactionUseCase:
  new SettleTransactionUseCase(
    transactionRepository
  ),

    deleteTransactionUseCase:
  new DeleteTransactionUseCase(
    transactionRepository
  ),

};