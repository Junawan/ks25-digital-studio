"use client";

import Link from "next/link";
import { useAuth } from "@/core/providers/AuthProvider";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();

  if (!user) {
    return <section className="mx-auto max-w-xl rounded-2xl border bg-background p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">?</div>
      <h1 className="text-2xl font-bold">Profil Anda</h1>
      <p className="mt-2 text-muted-foreground">Masuk atau buat akun gratis untuk melihat dan mengelola profil Anda.</p>
      <div className="mt-6 flex justify-center gap-3"><Link className="rounded-lg border px-5 py-2.5 font-medium" href={`/login?next=${encodeURIComponent("/dashboard/profile")}`}>Masuk</Link><Link className="rounded-lg bg-violet-700 px-5 py-2.5 font-semibold text-white" href={`/register?next=${encodeURIComponent("/dashboard/profile")}`}>Daftar gratis</Link></div>
    </section>;
  }

  return <section className="mx-auto max-w-xl rounded-2xl border bg-background p-6 shadow-sm sm:p-10">
    <h1 className="text-2xl font-bold">Profil</h1>
    <p className="mt-4 text-sm text-muted-foreground">Akun</p><p className="font-medium">{workspace?.user.fullName || user.displayName || "Pengguna KS25"}</p>
    <p className="mt-3 text-sm text-muted-foreground">Email</p><p className="font-medium">{user.email || "—"}</p>
    {workspace && <><p className="mt-3 text-sm text-muted-foreground">Perusahaan</p><p className="font-medium">{workspace.company.name}</p></>}
  </section>;
}
