export interface PrintableTransactionItem {
  productName: string;

  variantName: string;

  qty: number;

  price: number;

  subtotal: number;
}

export interface PrintableTransaction {
  invoiceNumber: string;

  createdAt: Date | string;

  cashierName: string;

  customerName: string;

  paymentMethod: string;

  subtotal: number;

  discount: number;

  total: number;

  paidAmount: number;

  changeAmount: number;

  items: PrintableTransactionItem[];
}

export interface PrintableStore {
  name: string;

  address?: string;

  phone?: string;

  footerText?: string;

  logoUrl?: string;
}

export interface ReceiptPrintSettings {
  paperSize: "58mm" | "80mm";

  autoPrint: boolean;
}

export interface ReceiptPrintOptions {
  settings: ReceiptPrintSettings;

  store: PrintableStore;

  transaction: PrintableTransaction;
}