import { Transaction } from "@/modules/pos/transaction/types/transaction";

export type PrintPaper =
  | "thermal58"
  | "thermal80"
  | "a4";

export interface PrintData {
  companyName: string;

  address?: string;

  phone?: string;

  website?: string;

  logo?: string;

  footer?: string;

  transaction: Transaction;
}