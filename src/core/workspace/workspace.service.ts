import { companyService } from "@/modules/company/company.service";
import { userService } from "@/modules/user/user.service";
import { companyModuleService } from "@/modules/module/company-module.service";

import type { Workspace } from "./workspace.types";

export class WorkspaceService {
  async load(userId: string): Promise<Workspace | null> {
    const user = await userService.getById(userId);

    if (!user) {
      return null;
    }

    const company = await companyService.getById(
      user.companyId
    );

    if (!company) {
      return null;
    }

    const modules =
      await companyModuleService.getInstalled(
        user.companyId
      );

    return {
      user,
      company,
      modules,
    };
  }
}

export const workspaceService =
  new WorkspaceService();