import { ProductRepository } from "../product.repository";
import { Product } from "../product.types";

export class GetProductsByIdsUseCase {

  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    productIds: string[]
  ): Promise<Product[]> {

    return this.repository.findByIds(
      productIds
    );

  }

}