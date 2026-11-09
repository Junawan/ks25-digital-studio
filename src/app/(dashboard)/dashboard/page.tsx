"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import ProductModuleGrid
from "@/modules/dashboard/components/ProductModuleGrid";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import Link from "next/link";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

export default function DashboardPage() {
  const { workspace } = useWorkspace();

  useAndroidBack(() => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  App.exitApp();

  return true;
});

  return (

    <div className="space-y-10">

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
