export interface CartItem {
  productId: string;

  variantId: string;

  productName: string;

  hsCode?: string;

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

  customerPhone?: string;

  paymentMethod: PaymentMethod;

  paymentPlan?: "full" | "dp" | "kasbon";

  subtotal: number;

  discount: number;

  dp: number;

  keterangan: string;

  total: number;

  paidAmount: number;

  remainingAmount: number;

  changeAmount: number;

  paymentHistory?: TransactionPayment[];

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

  hsCode?: string;

  variantName: string;

  barcode: string;

  price: number;

  qty: number;

  subtotal: number;
}

export interface TransactionPayment {
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt: Date;
}

export interface TransactionSummary {
  subtotal: number;

  discount: number;

  total: number;
}

export type PaymentMethod =
  | "cash"
  | "qris_static"
  | "qris_dynamic"
  | "kasbon";
