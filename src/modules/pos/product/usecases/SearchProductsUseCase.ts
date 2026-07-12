import { ProductRepository } from "../repository/ProductRepository";
import { Product } from "../types/product";

export class SearchProductsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    companyId: string,
    keyword: string
  ): Promise<Product[]> {
    return this.repository.search(
      companyId,
      keyword
    );
  }
}