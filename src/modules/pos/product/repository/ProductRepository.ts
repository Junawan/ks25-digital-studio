import {
  CreateProductInput,
  Product,
  ProductVariant,
  UpdateProductInput,
} from "../types/product";

export interface ProductRepository {
  create(input: CreateProductInput): Promise<Product>;

  update(
    productId: string,
    input: UpdateProductInput
  ): Promise<Product>;

  delete(productId: string): Promise<void>;

  findById(productId: string): Promise<Product | null>;

  findByName(
    companyId: string,
    name: string
  ): Promise<Product | null>;

  findAll(companyId: string): Promise<Product[]>;

  search(
    companyId: string,
    keyword: string
  ): Promise<Product[]>;

  findByBarcode(
  companyId: string,
  barcode: string
): Promise<{
  product: Product;
  variant: ProductVariant;
} | null>;
}