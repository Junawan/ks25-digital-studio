"use client";

import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export default function UpgradeBanner() {

  const router = useRouter();

  const { workspace } =
    useWorkspace();

  if (!workspace) {
    return null;
  }

  if (
    workspace.company.plan !==
    "starter"
  ) {
    return null;
  }

  return (

    <div
      className="
      overflow-hidden
      rounded-3xl
      border
      bg-gradient-to-r
      from-amber-400
      via-yellow-400
      to-orange-400
      p-8
      "
    >

      <div
        className="
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-center
        lg:justify-between
        "
      >

        <div>

          <div className="flex items-center gap-2">

            <Crown className="h-6 w-6"/>

            <h2 className="text-2xl font-bold">

              Upgrade ke KS25 PRO

            </h2>

          </div>

          <p className="mt-3 max-w-2xl">

            Nikmati seluruh fitur premium,
            AI tanpa batas,
            backup cloud,
            prioritas support,
            dan akses modul terbaru.

          </p>

        </div>

        <Button
          size="lg"
          className="bg-black hover:bg-zinc-800"
          onClick={() =>
            router.push(
              "/dashboard/subscription"
            )
          }
        >

          Upgrade Sekarang

        </Button>

      </div>

    </div>

  );

}