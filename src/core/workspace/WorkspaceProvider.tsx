"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/core/providers/AuthProvider";

import { workspaceService } from "./workspace.service";
import type { Workspace } from "./workspace.types";

interface WorkspaceContextValue {
  workspace: Workspace | null;

  loading: boolean;

  refresh: () => Promise<void>;

  hasModule: (moduleId: string) => boolean;
}

const WorkspaceContext =
  createContext<WorkspaceContextValue>({
    workspace: null,
    loading: true,
    refresh: async () => {},
    hasModule: () => false,
  });

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadWorkspace = async () => {
    if (!user) {
      setWorkspace(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data =
        await workspaceService.load(user.uid);

      setWorkspace(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    loadWorkspace();
  }, [user, authLoading]);

  const hasModule = (moduleId: string) => {
    if (!workspace) return false;

    return workspace.modules.some(
      (module) => module.moduleId === moduleId
    );
  };

  const value = useMemo(
    () => ({
      workspace,
      loading,
      refresh: loadWorkspace,
      hasModule,
    }),
    [workspace, loading]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}