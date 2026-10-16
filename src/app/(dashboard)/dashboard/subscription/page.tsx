"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import CurrentPlanCard from "@/modules/subscription/components/CurrentPlanCard";
import PlanCard from "@/modules/subscription/components/PlanCard";
import { useRouter } from "next/navigation";
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
        <h1 className="text-3xl font-bold">
          Paket Langganan
        </h1>

        <p className="text-muted-foreground mt-2">
          Kelola langganan untuk semua aplikasi
          KS25 Digital Studio.
        </p>
      </div>

      <CurrentPlanCard />

      <div className="grid gap-6 lg:grid-cols-2">

        <PlanCard
          plan="starter"
          title="Starter"
          price="Gratis"
          description="Semua fitur dan modul tersedia gratis. Di Android, paket Starter tidak memiliki batas waktu."
          features={[
            "Semua fitur dan modul tanpa batas penggunaan",
            "Gratis tanpa batas waktu di Android",
            "Iklan banner dan interstitial di Android",
            "Gratis 1 bulan melalui web",
          ]}
          current={!proActive}
        />

        <PlanCard
          plan="pro"
          title="Pro"
          price="Rp20.000 / bulan"
          description="Tanpa iklan dan seluruh fitur premium."
          features={[
            "Tanpa iklan",
            "Semua fitur dan modul",
            "Generate AI tanpa batas",
            "Backup Cloud dan prioritas support",
          ]}
          current={proActive}
        />

      </div>

    </div>
  );
}
