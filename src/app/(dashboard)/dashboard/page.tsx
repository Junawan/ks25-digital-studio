"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import ProductModuleGrid
from "@/modules/dashboard/components/ProductModuleGrid";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import Link from "next/link";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";
import { useAuth } from "@/core/providers/AuthProvider";

export default function DashboardPage() {
  const { workspace } = useWorkspace();
  const { user } = useAuth();

  useAndroidBack(() => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  App.exitApp();

  return true;
});

  return (

    <div className="space-y-10">

      {!user && <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><h1 className="text-xl font-bold sm:text-2xl">Kenali modul KS25 Digital Studio</h1><p className="mt-1 text-sm text-white/90">Lihat fitur setiap modul, lalu buat akun gratis untuk mulai menggunakannya.</p></div>
        <Link className="shrink-0 rounded-xl bg-white px-5 py-3 text-center font-bold text-violet-700 hover:bg-violet-50" href={`/register?next=${encodeURIComponent("/dashboard")}`}>Ayo Mulai</Link>
      </section>}

      {workspace && !isProPlanActive(workspace.company) && (
        <div className="flex flex-col gap-2 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>Aplikasi tetap gratis dan menampilkan iklan banner. Untuk menggunakan aplikasi tanpa iklan, silakan berlangganan PRO (opsional).</p>
          <Link className="shrink-0 font-semibold text-violet-700 underline underline-offset-2" href="/dashboard/subscription">Lihat langganan PRO</Link>
        </div>
      )}

      <ProductModuleGrid />

    </div>

  );

}
