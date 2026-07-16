import { TransactionRepository } from "../repositories/TransactionRepository";
import { Transaction } from "../types/transaction";

export class GetTransactionsUseCase {
  constructor(
    private readonly repository: TransactionRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<Transaction[]> {
    return this.repository.getAll(
      companyId
    );
  }
}