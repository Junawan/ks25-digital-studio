import { ProductRepository } from "../repository/ProductRepository";

export class DeleteProductUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(productId: string): Promise<void> {
    await this.repository.delete(productId);
  }
}