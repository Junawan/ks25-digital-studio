"use client";

import { useRouter } from "next/navigation";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useActiveEmployee } from "@/modules/employee-profile/EmployeeIdentityProvider";

import { getPlanDaysRemaining, toSubscriptionDate } from "@/modules/subscription/subscription-policy";

export default function DashboardHero() {

  const router = useRouter();

  const { workspace } =
    useWorkspace();

  const { employee } = useActiveEmployee();

  if (!workspace) {
    return null;
  }

  const company = workspace.company;
  const planExpiresAt = toSubscriptionDate(company.planExpiresAt);
  const daysLeft = getPlanDaysRemaining(company);
  const isPaidPlan = company.plan === "pro" || company.plan === "business";
  const expiringSoon = company.plan === "pro" && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const formattedExpiry = planExpiresAt?.toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

  return (

    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      bg-gradient-to-r
      from-violet-700
      via-violet-600
      to-fuchsia-600
      p-8
      text-white
      "
    >

      <div
        className="
        absolute
        -right-16
        -top-16
        h-64
        w-64
        rounded-full
        bg-white/10
        blur-3xl
        "
      />

      <div
        className="
        relative
        flex
        flex-col
        gap-8
        lg:flex-row
        lg:items-center
        lg:justify-between
        "
      >

        <div className="max-w-2xl">

          <div className="flex items-center gap-2">

            <Sparkles className="h-5 w-5" />

            <span className="text-sm font-medium">

              KS25 Digital Studio

            </span>

          </div>

          <h1
            className="
            mt-4
            text-3xl
            font-bold
            lg:text-5xl
            "
          >

            Halo,

            {" "}

            {employee?.fullName || workspace.user.fullName}
            👋

          </h1>

          <p
            className="
            mt-4
            max-w-xl
            text-white/90
            "
          >

            Kelola seluruh aplikasi bisnis Anda
            dalam satu platform.

            Install, gunakan, dan tingkatkan
            produktivitas bisnis dengan ekosistem
            KS25.

          </p>

          <p className="mt-3 text-sm font-semibold text-white">
            {isPaidPlan ? daysLeft !== null && daysLeft >= 0 && formattedExpiry ? `${company.plan.toUpperCase()} aktif sampai ${formattedExpiry}` : `Paket ${company.plan.toUpperCase()} telah berakhir` : "Paket STARTER aktif"}
          </p>

          {expiringSoon && <p role="status" className="mt-3 rounded-xl border border-amber-200/40 bg-amber-950/25 px-4 py-3 text-sm font-medium text-amber-50">Paket PRO akan berakhir {daysLeft === 0 ? "hari ini" : `dalam ${daysLeft} hari`}. Perpanjang agar layanan tetap aktif.</p>}

          <div className="mt-6">

            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                router.push(
                  "/dashboard/subscription"
                )
              }
            >

              Kelola Langganan

            </Button>

          </div>

        </div>

    </div>

    </div>

  );

}
