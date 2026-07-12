import { ProductRepository } from "../repository/ProductRepository";

import { CreateProductInput } from "../types/product";
import { ProductImportRow } from "../types/ProductImport";

export class ImportProductsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
  companyId: string,
  rows: ProductImportRow[],
  onProgress?: (
    current: number,
    total: number,
    productName: string
  ) => void
) {
    const grouped = new Map<
      string,
      CreateProductInput
    >();

    const total = grouped.size;

let current = 0;

    for (const row of rows) {
      const key = row.productName.trim();

      if (!grouped.has(key)) {
        grouped.set(key, {
          companyId,
          name: key,
          active: row.active,
          variants: [],
        });
      }

      grouped.get(key)!.variants.push({
        variantId: crypto.randomUUID(),
        name: row.variantName,
        barcode: row.barcode,
        price: row.price,
        stock: row.stock,
        active: row.active,
      });
    }

    let success = 0;

    let skipped = 0;

    const errors: string[] = [];

    for (const product of grouped.values()) {

        current++;

onProgress?.(
  current,
  total,
  product.name
);
      try {
        const existing =
          await this.repository.findByName(
            companyId,
            product.name
          );

        if (existing) {
          skipped++;
          continue;
        }

        await this.repository.create(product);

        success++;
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error.message
            : "Unknown Error"
        );
      }
    }

    return {
      total: grouped.size,
      success,
      skipped,
      failed: errors.length,
      errors,
    };
  }
}