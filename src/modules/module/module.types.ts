export type ModuleCategory =
  | "business"
  | "marketing"
  | "finance"
  | "ai";

export interface Module {
  moduleId: string;

  code: string;

  name: string;

  description: string;

  icon: string;

  category: ModuleCategory;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CompanyModule {
  id: string;

  companyId: string;

  moduleId: string;

  enabled: boolean;

  installedAt: Date;
}

export interface InstalledModule extends Module {
  enabled: boolean;

  installedAt: Date;
}