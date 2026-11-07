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
          Web gratis selama 14 hari. Penggunaan gratis tanpa batas tersedia di
          aplikasi Android.
        </p>
      </div>

      <CurrentPlanCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlanCard
          plan="starter"
          title="Starter"
          price="Gratis"
          description="Pilih akses gratis melalui aplikasi Android atau coba KS25 lewat web selama 14 hari."
          features={[
            "Semua fitur dan modul aplikasi",
            "Gratis tanpa batas waktu di Android",
            "Gratis 14 hari melalui web",
          ]}
          current={!proActive}
        />
        <PlanCard
          plan="pro"
          title="Pro"
          price="Rp20.000 / bulan"
          description="Akses berlangganan untuk penggunaan melalui web."
          features={[
            "Semua fitur dan modul",
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
