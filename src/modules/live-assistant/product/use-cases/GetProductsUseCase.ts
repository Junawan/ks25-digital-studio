import { ProductRepository } from "../product.repository";
import { Product } from "../product.types";


export class GetProductsUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<Product[]> {
    return this.productRepository.findByCompanyId(
      companyId
    );
  }
}