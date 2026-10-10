export interface ProductVariant {
  variantId: string;

  name: string;

  barcode: string;

  price: number;

  stock: number;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface Product {
  productId: string;
  companyId: string;

  /**
   * Contoh:
   * Brownies
   * Aqua
   * Pie Susu
   */
  name: string;

  hsCode?: string;

  imageUrl?: string;
  imagePath?: string;

  variants: ProductVariant[];

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  companyId: string;

  name: string;

  hsCode?: string;

  imageUrl?: string;
  imagePath?: string;

  active: boolean;

  variants: ProductVariantForm[];
}

export interface UpdateProductInput {
  name: string;

  hsCode?: string;

  imageUrl?: string;
  imagePath?: string;

  active: boolean;

  variants: ProductVariantForm[];
}

export interface ProductVariantForm {
  variantId: string;

  name: string;

  barcode: string;

  price: number;

  stock: number;

  active: boolean;
}
