"use client";

import { useAuth as useKsAuth } from "@/core/providers/AuthProvider";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export function useAuth() {
  const { user, loading } = useKsAuth();
  const { workspace } = useWorkspace();
  const role = workspace?.user.role;
  return {
    user,
    loading,
    profile: workspace ? {
      uid: workspace.user.userId,
      name: workspace.user.fullName,
      email: workspace.user.email,
      role: role === "owner" || role === "admin" || workspace.user.isSystemAdmin ? "admin" as const : "customer" as const,
      companyId: workspace.company.id,
    } : null,
  };
}
