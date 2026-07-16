import { FirestoreCashierRepository } from "../../cashier/repositories/FirestoreCashierRepository";
import { FirestoreTransactionRepository } from "../repositories/FirestoreTransactionRepository";

import { CheckoutUseCase } from "../usecases/CheckoutUseCase";

const transactionRepository =
    new FirestoreTransactionRepository();

const cashierRepository =
    new FirestoreCashierRepository();

export const transactionDI = {
    checkoutUseCase:
        new CheckoutUseCase(
            transactionRepository,
            cashierRepository,
        ),
};