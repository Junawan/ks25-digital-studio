export type CompanyPlan = "trial" | "pro" | "business";

export type CompanyStatus =
  | "active"
  | "inactive"
  | "suspended";

export interface Company {
  id: string;

  ownerId: string;

  name: string;

  slug: string;

  email: string;

  phone: string | null;

  logo: string | null;

  address: string | null;

  plan: CompanyPlan;

  status: CompanyStatus;

  trialEndsAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}