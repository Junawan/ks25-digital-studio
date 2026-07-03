"use client";

import { Crown } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export default function CurrentPlanCard() {
  const { workspace } = useWorkspace();

  const company = workspace?.company;

  const plan = company?.plan ?? "starter";

  const expired =
  company?.planExpiresAt
    ? new Date(
        company.planExpiresAt
      ).toLocaleDateString("id-ID")
    : "Tidak ada";

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
    ? "Tidak terbatas"
    : expired}
</p>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}