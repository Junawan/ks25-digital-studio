export interface QrOrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  barcode: string;
  price: number;
  qty: number;
  subtotal: number;
}

export interface QrOrder {
  orderId: string;
  orderNumber: string;
  companyId: string;
  customerName: string;
  phone: string;
  items: QrOrderItem[];
  total: number;
  status: "pending" | "accepted" | "cancelled";
  createdAt: Date;
}
