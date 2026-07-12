import { ProductAlreadyExistsError } from "../errors/ProductAlreadyExistsError";
import { ProductRepository } from "../repository/ProductRepository";
import { InvalidProductNameError } from "../errors/InvalidProductNameError";
import { InvalidVariantError } from "../errors/InvalidVariantError";

import { ProductNormalizer } from "../utils/ProductNormalizer";

import {
  CreateProductInput,
  Product,
} from "../types/product";

export class CreateProductUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    input: CreateProductInput
  ): Promise<Product> {
    const name = input.name.trim();

    if (!name) {
      throw new Error("Nama produk wajib diisi.");
    }

    if (input.variants.length === 0) {
      throw new Error(
        "Minimal harus memiliki satu varian."
      );
    }

    const productName = ProductNormalizer.displayName(
    input.name
);

if (!productName) {
    throw new InvalidProductNameError();
}

const existing = await this.repository.findByName(
    input.companyId,
    productName
);

if (existing) {
    throw new ProductAlreadyExistsError(productName);
}

const variants = input.variants.map((variant) => {

    const variantName =
        variant.name.trim() || "Default";

    if (variant.price < 0) {
        throw new InvalidVariantError(
            "Harga jual tidak boleh kurang dari 0."
        );
    }

    if ((variant.stock ?? 0) < 0) {
        throw new InvalidVariantError(
            "Stok tidak boleh kurang dari 0."
        );
    }

    return {
        ...variant,
        name: variantName,
    };
});

return this.repository.create({
    ...input,
    name: productName,
    variants,
});
  }
}