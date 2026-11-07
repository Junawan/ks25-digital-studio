"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardInvitations from "@/modules/invitation/components/dashboard/DashboardInvitations";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export default function InvitationsPage() {
  const { workspace } = useWorkspace();
  return <div className="mx-auto max-w-6xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">KS25 Digital Studio</p><h1 className="mt-1 text-3xl font-bold">Undangan Digital</h1><p className="mt-2 text-muted-foreground">Kelola undangan pernikahan untuk {workspace?.company.name || "workspace Anda"}.</p></div><Button asChild><Link href="/invitation/create"><Plus className="mr-2 h-4 w-4"/>Buat undangan</Link></Button></header>
    <DashboardInvitations />
  </div>;
}
