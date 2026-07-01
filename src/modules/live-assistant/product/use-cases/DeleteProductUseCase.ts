import { ProductRepository } from "../product.repository";


export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(productId: string): Promise<void> {
    await this.productRepository.delete(productId);
  }
}