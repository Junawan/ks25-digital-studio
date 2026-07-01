"use client";

import { useCallback, useEffect, useState } from "react";

import { moduleService } from "./module.service";
import { companyModuleService } from "./company-module.service";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import type { Module } from "./module.types";

export function useModules() {
  const { workspace, refresh } = useWorkspace();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await moduleService.getAll();
      setModules(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function install(moduleId: string) {
    if (!workspace) return;

    await companyModuleService.install(
      workspace.company.id,
      moduleId
    );

    // Refresh Workspace supaya Sidebar,
    // Marketplace dan My Apps ikut berubah.
    await refresh();
  }

  return {
    modules,
    loading,
    install,
  };
}