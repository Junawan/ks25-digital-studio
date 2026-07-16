import { Transaction } from "../types/transaction";

export interface TransactionRepository {
  create(
    transaction: Transaction
  ): Promise<Transaction>;
}