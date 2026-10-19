export type DebtType =
  | "kasbon"
  | "payment_shortage"
  | "other";

export type DebtStatus =
  | "unpaid"
  | "paid";

export type DebtorType = "employee" | "customer";

export interface DebtPayment {
  paymentId: string;

  amount: number;

  note: string | null;

  paidAt: Date;

  createdAt: Date;
}

export interface Debt {
  debtId: string;

  companyId: string;

  name: string;

  debtorType?: DebtorType;

  source?: "manual" | "transaction";
  transactionId?: string;
  invoiceNumber?: string;
  phone?: string;

  type: DebtType;

  amount: number;

  totalPaid: number;

  remainingAmount: number;

  status: DebtStatus;

  note: string | null;

  date: Date;

  payments: DebtPayment[];

  createdAt: Date;

  updatedAt: Date;
}
