"use client";

import { useRouter, useSearchParams } from "next/navigation";

import CheckoutCard from "@/modules/subscription/components/CheckoutCard";
import { useAndroidBack } from "@/hooks/useAndroidBack";

export default function SubscriptionCheckoutPage() {

  const router = useRouter();

  const params =
    useSearchParams();

  const plan =
    params.get("plan") ?? "pro";

    useAndroidBack(() => {
        router.back();
        return true;
      });

  return (

    <div className="mx-auto max-w-3xl">

      <CheckoutCard
        plan={plan}
      />

    </div>

  );

}