import type { Company } from "@/modules/company/company.types";
import type { User } from "@/modules/user/user.types";
import type { CompanyModule } from "@/modules/module/module.types";

export interface Workspace {

  company: Company;

  user: User;

  modules: CompanyModule[];

}