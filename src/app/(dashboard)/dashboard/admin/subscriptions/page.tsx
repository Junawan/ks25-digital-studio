"use client";

import PaymentGrid from "@/modules/subscription/components/PaymentGrid";

export default function AdminSubscriptionsPage() {

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