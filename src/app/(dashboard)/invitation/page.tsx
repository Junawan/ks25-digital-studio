"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { invitationThemes } from "@/modules/invitation/data/invitationThemes";
import DashboardInvitations from "@/modules/invitation/components/dashboard/DashboardInvitations";

export default function InvitationsPage() {
  const { workspace } = useWorkspace();
  return <div className="mx-auto max-w-6xl space-y-8">
    <header><p className="text-sm font-medium text-primary">KS25 Digital Studio</p><h1 className="mt-1 text-3xl font-bold">Undangan Digital</h1><p className="mt-2 text-muted-foreground">Kelola undangan pernikahan untuk {workspace?.company.name || "workspace Anda"}.</p></header>
    <section className="space-y-4">
      <div><h2 className="text-xl font-semibold">Pilih tema undangan</h2><p className="text-sm text-muted-foreground">Lihat demo yang disiapkan admin atau mulai buat undangan dengan tema pilihan Anda.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {invitationThemes.filter((theme) => theme.status === "active").map((theme) => <article key={theme.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="relative aspect-[4/5] bg-muted"><Image src={theme.image} alt={`Preview tema ${theme.name}`} fill sizes="(max-width: 640px) 50vw, 320px" className="object-contain" /></div>
          <div className="space-y-2 p-3 sm:p-4"><h3 className="font-semibold leading-tight">{theme.name}</h3><p className="hidden text-xs text-muted-foreground sm:block">{theme.description}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button asChild size="sm" variant="outline" className="w-full px-2"><Link href={theme.demo}><Eye className="mr-1 h-3.5 w-3.5"/>Lihat demo</Link></Button>
              <Button asChild size="sm" className="w-full px-2"><Link href={`/invitation/create?theme=${theme.slug}`}><Plus className="mr-1 h-3.5 w-3.5"/>Buat undangan</Link></Button>
            </div>
          </div>
        </article>)}
      </div>
    </section>
    <DashboardInvitations />
  </div>;
}
