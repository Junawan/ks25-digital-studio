"use client";

import { useRouter } from "next/navigation";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import CurrentPlanCard from "@/modules/subscription/components/CurrentPlanCard";
import PlanCard from "@/modules/subscription/components/PlanCard";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

export default function SubscriptionPage() {
  const router = useRouter();
  const { workspace } = useWorkspace();
  const proActive = isProPlanActive(workspace?.company);

  useAndroidBack(() => {
    router.back();
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paket Langganan</h1>
        <p className="mt-2 text-muted-foreground">
          Aplikasi Android tetap gratis tanpa batas. PRO bersifat opsional untuk menghilangkan iklan banner dan membuka akses web setelah masa gratis.
        </p>
      </div>

      <CurrentPlanCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlanCard
          plan="starter"
          title="Starter"
          price="Gratis"
          description="Gunakan seluruh fitur Android gratis tanpa batas dengan iklan banner."
          features={[
            "Semua fitur dan modul aplikasi",
            "Gratis tanpa batas waktu di Android",
            "Iklan hanya berupa banner di halaman utama",
            "Gratis 14 hari melalui web",
          ]}
          current={!proActive}
        />
        <PlanCard
          plan="pro"
          title="Pro"
          price="Rp20.000 / bulan"
          description="Langganan opsional untuk menggunakan aplikasi tanpa iklan dan melanjutkan akses web."
          features={[
            "Semua fitur dan modul",
            "Tanpa iklan di aplikasi Android",
            "Akses web setelah masa gratis berakhir",
            "Generate AI tanpa batas",
            "Backup Cloud dan prioritas support",
          ]}
          current={proActive}
        />
      </div>
    </div>
  );
}
