"use client";

import { Crown } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import {
  isProPlanActive,
  toSubscriptionDate,
} from "@/modules/subscription/subscription-policy";

export default function CurrentPlanCard() {
  const { workspace } = useWorkspace();

  const company = workspace?.company;

  const proActive = isProPlanActive(company);
  const plan = proActive ? "pro" : "starter";

  const planExpiresAt = toSubscriptionDate(company?.planExpiresAt);
  const expired = planExpiresAt
    ? planExpiresAt.toLocaleDateString("id-ID")
    : "Tidak aktif";

  return (
    <Card>

      <CardContent className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Paket Saat Ini
            </p>

            <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold">

              <Crown className="h-6 w-6 text-yellow-500" />

              {plan === "pro"
                ? "Pro"
                : "Starter"}

            </h2>

          </div>

          <Badge
            variant={
              plan === "pro"
                ? "default"
                : "secondary"
            }
          >
            {plan.toUpperCase()}
          </Badge>

        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <div>

            <p className="text-xs text-muted-foreground">
              Perusahaan
            </p>

            <p className="font-medium">
              {company?.name ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-xs text-muted-foreground">
              Berlaku Sampai
            </p>

            <p className="font-medium">
  {plan === "starter"
    ? "Android tanpa batas waktu · Web 1 bulan"
    : expired}
</p>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}
