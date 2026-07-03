"use client";

import { useRouter } from "next/navigation";

import {
  Check,
  Crown,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

interface PlanCardProps {
  plan: "starter" | "pro";

  title: string;

  price: string;

  description: string;

  features: string[];

  current?: boolean;
}

export default function PlanCard({
  plan,
  title,
  price,
  description,
  features,
  current = false,
}: PlanCardProps) {

  const router = useRouter();

  const {
  status,
} = useSubscriptionStatus();

  return (

    <Card
      className={
        plan === "pro"
          ? "border-violet-500 shadow-lg"
          : ""
      }
    >

      <CardContent className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Crown
                className={
                  plan === "pro"
                    ? "h-5 w-5 text-yellow-500"
                    : "h-5 w-5 text-zinc-400"
                }
              />

              <h2 className="text-2xl font-bold">

                {title}

              </h2>

            </div>

            <p className="mt-2 text-muted-foreground">

              {description}

            </p>

          </div>

          {plan === "pro" && (

            <Badge>

              PROMO

            </Badge>

          )}

        </div>

        <div className="mt-6">

          <div className="text-4xl font-black">

            {price}

          </div>

        </div>

        <div className="mt-8 space-y-3">

          {features.map((feature) => (

            <div
              key={feature}
              className="flex items-center gap-3"
            >

              <Check
                className="
                h-5
                w-5
                text-green-600
                "
              />

              <span>

                {feature}

              </span>

            </div>

          ))}

        </div>

        <div className="mt-8">

  {current ? (

    <Button
      className="w-full"
      disabled
    >
      Paket Saat Ini
    </Button>

  ) : status === "pending" ? (

    <Button
      className="w-full"
      disabled
    >
      ⏳ Menunggu Verifikasi
    </Button>

  ) : status === "approved" ? (

    <Button
      className="w-full"
      disabled
    >
      ✔ Paket Aktif
    </Button>

  ) : (

    <Button
      className="w-full"
      onClick={() =>
        router.push(
          `/dashboard/subscription/checkout?plan=${plan}`
        )
      }
    >
      Upgrade Sekarang
    </Button>

  )}

</div>

      </CardContent>

    </Card>

  );

}