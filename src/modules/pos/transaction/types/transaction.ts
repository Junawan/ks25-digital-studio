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

export interface Transaction {
  transactionId: string;

  companyId: string;

  invoiceNumber: string;

  cashierId: string;

  cashierName: string;

  customerName: string;

  paymentMethod: PaymentMethod;

  subtotal: number;

  discount: number;

  dp: number;

  keterangan: string;

  total: number;

  paidAmount: number;

  remainingAmount: number;

  changeAmount: number;

  status:
   | "unpaid"
  | "paid"
  | "cancelled";

  items: TransactionItem[];

  createdAt: Date;

  updatedAt: Date;
}

export interface TransactionItem {
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

export type PaymentMethod =
  | "cash"
  | "qris_static"
  | "qris_dynamic";