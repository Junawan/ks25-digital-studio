export interface CartItem {
  productId: string;

  variantId: string;

  productName: string;

  variantName: string;

  barcode: string;

  price: number;

  qty: number;

  subtotal: number;
}

export interface TransactionSummary {
  subtotal: number;

  discount: number;

  total: number;
}