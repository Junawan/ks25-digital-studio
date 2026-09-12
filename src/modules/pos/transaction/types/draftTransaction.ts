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

  dp: number;

  keterangan: string;

  cart: CartItem[];

  createdAt: Date;

  updatedAt: Date;
}