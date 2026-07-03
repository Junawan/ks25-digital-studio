export type SubscriptionPlan =
  | "starter"
  | "pro"
  | "business";

export type SubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled";

export interface Subscription {
  subscriptionId: string;

  companyId: string;

  plan: SubscriptionPlan;

  status: SubscriptionStatus;

  amount: number;

  startedAt: Date;

  expiredAt: Date;

  createdAt: Date;
}