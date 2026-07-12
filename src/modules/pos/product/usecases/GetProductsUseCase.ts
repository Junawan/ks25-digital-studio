import { ProductRepository } from "../repository/ProductRepository";
import { Product } from "../types/product";

export class GetProductsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<Product[]> {
    return this.repository.findAll(companyId);
  }
}