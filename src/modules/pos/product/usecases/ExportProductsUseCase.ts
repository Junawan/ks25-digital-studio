import { ProductRepository } from "../repository/ProductRepository";

import { ProductExcelExporter } from "../utils/ProductExcelExporter";

export class ExportProductsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(companyId: string) {
    const products =
      await this.repository.findAll(
        companyId
      );

    ProductExcelExporter.download(
      products
    );

    return products.length;
  }
}