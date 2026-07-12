import { ProductAlreadyExistsError } from "../errors/ProductAlreadyExistsError";
import { InvalidProductNameError } from "../errors/InvalidProductNameError";

import { ProductRepository } from "../repository/ProductRepository";

import { UpdateProductInput } from "../types/product";

import { ProductNormalizer } from "../utils/ProductNormalizer";

export class UpdateProductUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    companyId: string,
    productId: string,
    input: UpdateProductInput
  ) {
    if (input.name !== undefined) {
      const productName =
        ProductNormalizer.displayName(
          input.name
        );

      if (!productName) {
        throw new InvalidProductNameError();
      }

      const existing =
        await this.repository.findByName(
          companyId,
          productName
        );

        console.log({
  productId,
  existingProductId: existing?.productId,
  inputName: productName,
});

      if (
        existing &&
        existing.productId !== productId
      ) {
        throw new ProductAlreadyExistsError(
          productName
        );
      }

      input.name = productName;
    }

    return this.repository.update(
      productId,
      input
    );
  }
}