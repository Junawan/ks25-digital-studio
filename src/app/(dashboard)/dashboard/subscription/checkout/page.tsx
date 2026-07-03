"use client";

import { useSearchParams } from "next/navigation";

import CheckoutCard from "@/modules/subscription/components/CheckoutCard";

export default function SubscriptionCheckoutPage() {

  const params =
    useSearchParams();

  const plan =
    params.get("plan") ?? "pro";

  return (

    <div className="mx-auto max-w-3xl">

      <CheckoutCard
        plan={plan}
      />

    </div>

  );

}