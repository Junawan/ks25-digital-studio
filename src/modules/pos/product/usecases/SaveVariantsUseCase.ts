import { InvalidVariantError } from "../errors/InvalidVariantError";

import { ProductRepository } from "../repository/ProductRepository";

import { ProductVariant } from "../types/product";

export class SaveVariantsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
    productId: string,
    variants: ProductVariant[]
  ): Promise<void> {
    if (!variants.length) {
      throw new InvalidVariantError(
        "Produk minimal memiliki satu varian."
      );
    }

    const normalized = variants.map(
      (variant) => ({
        ...variant,

        name:
          variant.name.trim() || "Default",

        barcode:
          variant.barcode?.trim() || null,
      })
    );
  }
}