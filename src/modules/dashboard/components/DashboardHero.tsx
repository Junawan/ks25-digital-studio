"use client";

import { useRouter } from "next/navigation";

import { Sparkles, Crown } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { dashboardProducts } from "../dashboard.data";

export default function DashboardHero() {

  const router = useRouter();

  const { workspace } =
    useWorkspace();

  if (!workspace) {
    return null;
  }

  const installed =
  workspace.modules.length;

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

            {workspace.user.fullName}
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

interface HeroStatProps {

  title: string;

  value: string;

}

function HeroStat({

  title,

  value,

}: HeroStatProps) {

  return (

    <div
      className="
      rounded-2xl
      border
      border-white/20
      bg-white/10
      p-5
      backdrop-blur
      "
    >

      <div className="text-sm text-white/70">

        {title}

      </div>

      <div className="mt-2 text-2xl font-bold">

        {value}

      </div>

    </div>

  );

}