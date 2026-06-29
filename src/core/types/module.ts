export type ModuleCategory =
  | "business"
  | "marketing"
  | "finance"
  | "productivity"
  | "ai"
  | "utility";

export type ModuleStatus =
  | "active"
  | "inactive";

export interface Module {
  id: string;

  code: string;

  name: string;

  description: string;

  icon: string;

  category: ModuleCategory;

  version: string;

  status: ModuleStatus;

  createdAt: Date;

  updatedAt: Date;
}

export interface CompanyModule {
  id: string;

  companyId: string;

  moduleId: string;

  enabled: boolean;

  installedAt: Date;

  expiresAt: Date | null;
}