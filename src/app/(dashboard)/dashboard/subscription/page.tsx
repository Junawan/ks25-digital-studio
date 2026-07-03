"use client";

import CurrentPlanCard from "@/modules/subscription/components/CurrentPlanCard";
import PlanCard from "@/modules/subscription/components/PlanCard";

export default function SubscriptionPage() {
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
          description="Cocok untuk mencoba semua aplikasi."
          features={[
            "Semua fitur dasar",
            "1 Perusahaan",
            "1 Host",
            "Dengan iklan",
          ]}
          current
        />

        <PlanCard
          plan="pro"
          title="Pro"
          price="Rp20.000 / bulan"
          description="Tanpa iklan dan seluruh fitur premium."
          features={[
            "Tanpa iklan",
            "Generate AI tanpa batas",
            "Backup Cloud",
            "Prioritas Support",
          ]}
        />

      </div>

    </div>
  );
}