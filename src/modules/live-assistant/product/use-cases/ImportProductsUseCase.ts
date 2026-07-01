import { ImportProduct } from "../import.product";
import { ProductRepository } from "../product.repository";
import { Product } from "../product.types";

export class ImportProductsUseCase {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async execute(
  companyId: string,
  rows: ImportProduct[],
  onProgress?: (
    current: number,
    total: number
  ) => void
) {
  const now = new Date();

  const products: Product[] =
    rows.map((row) => ({
      productId:
        crypto.randomUUID(),

      companyId,

      title: row.title,

      image: row.image,

      productInfo:
        row.productInfo,

      teleprompterText: "",

      notes: "",

      faq: [],

      active: true,

      createdAt: now,

      updatedAt: now,
    }));

  await this.repository.createBatch(
    products,
    onProgress
  );
}
}