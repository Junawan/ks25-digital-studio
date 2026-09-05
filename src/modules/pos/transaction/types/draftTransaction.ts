import type {
  CartItem,
  PaymentMethod,
} from "./transaction";

export interface DraftTransaction {
  draftId: string;

  companyId: string;

  cashierId: string;

  customer: string;

  paymentMethod: PaymentMethod;

  paidAmount: number;

  discount: number;

  cart: CartItem[];

  createdAt: Date;

  updatedAt: Date;
}