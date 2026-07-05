"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import PaymentGrid from "@/modules/subscription/components/PaymentGrid";
import { useRouter } from "next/navigation";

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  useAndroidBack(() => {
  router.back();
  return true;
});

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Subscription Payments

        </h1>

        <p className="text-muted-foreground">

          Verifikasi pembayaran paket pelanggan.

        </p>

      </div>

      <PaymentGrid />

    </div>

  );

}