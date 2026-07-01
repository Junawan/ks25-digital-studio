import type { Company } from "@/modules/company/company.types";
import type { User } from "@/modules/user/user.types";
import type { Subscription } from "@/modules/subscription/subscription.types";
import type { CompanyModule } from "@/modules/module/module.types";

export interface Workspace {
  company: Company;
  user: User;
  subscription: Subscription | null;
  modules: CompanyModule[];
}