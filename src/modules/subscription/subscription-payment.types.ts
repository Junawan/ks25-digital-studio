import type { CompanyPlan } from "@/modules/company/company.types";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface SubscriptionPayment {
  paymentId: string;

  companyId: string;

  companyName: string;

  ownerId: string;

  ownerName: string;

  ownerEmail: string;

  previousPlan: CompanyPlan;

nextPlan: CompanyPlan;

  amount: number;

  paymentMethod: "qris";

  proofImage: string;

  status: PaymentStatus;

  createdAt: Date;

  approvedAt: Date | null;

  approvedBy: string | null;
}