export interface ProductImportRow {
  productName: string;

  hsCode?: string;

  variantName: string;

  barcode: string;

  price: number;

  stock: number;

  active: boolean;
}

export interface ProductImportResult {
  rows: ProductImportRow[];

  errors: string[];
}
