export type UserRole =
  | "owner"
  | "admin"
  | "staff"
  | "cashier"
  | "host";

export type UserStatus =
  | "active"
  | "inactive"
  | "blocked";

export interface User {
  userId: string;

  companyId: string;

  email: string;

  fullName: string;

  photoUrl: string | null;

  phone: string | null;

  role: UserRole;

  status: UserStatus;

  createdAt: Date;

  updatedAt: Date;

  isSystemAdmin: boolean;
}