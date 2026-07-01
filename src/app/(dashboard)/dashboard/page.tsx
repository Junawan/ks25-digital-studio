"use client";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function DashboardPage() {
  const { workspace, loading } = useWorkspace();

  if (loading) {
    return (
      <div className="p-6">
        Loading workspace...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-6">
        Workspace tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Halo, {workspace.user.fullName}
        </h1>

        <p className="text-muted-foreground">
          Selamat datang kembali.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Perusahaan</CardTitle>
          </CardHeader>

          <CardContent>
            {workspace.company.name}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paket</CardTitle>
          </CardHeader>

          <CardContent className="capitalize">
            {workspace.subscription?.plan ?? "-"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module</CardTitle>
          </CardHeader>

          <CardContent>
            {workspace.modules.length} Terpasang
          </CardContent>
        </Card>
      </div>
    </div>
  );
}