import { TransactionRepository } from "../repositories/TransactionRepository";

export class DeleteTransactionUseCase {
  constructor(
    private readonly repository: TransactionRepository
  ) {}

  async execute(
    transactionId: string
  ): Promise<void> {
    await this.repository.delete(
      transactionId
    );
  }
}