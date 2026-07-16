import { Transaction } from "../types/transaction";

export interface TransactionRepository {
  create(
    transaction: Transaction
  ): Promise<Transaction>;

  getAll(
    companyId: string
  ): Promise<Transaction[]>;

  getById(
    transactionId: string
  ): Promise<Transaction | null>;

  delete(
    transactionId: string
  ): Promise<void>;
}