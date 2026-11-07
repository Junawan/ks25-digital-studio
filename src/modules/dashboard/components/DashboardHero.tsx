"use client";

import { Sparkles } from "lucide-react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useActiveEmployee } from "@/modules/employee-profile/EmployeeIdentityProvider";


export default function DashboardHero() {

  const { workspace } =
    useWorkspace();

  const { employee } = useActiveEmployee();

  if (!workspace) {
    return null;
  }


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

          <p className="mt-3 text-sm text-white/90">
            Untuk penggunaan di PC/Laptop, buka{" "}
            <a className="font-semibold underline underline-offset-2" href="https://www.ks25studio.web.id" target="_blank" rel="noreferrer">
              www.ks25studio.web.id
            </a>
          </p>

          <p className="mt-3 text-sm font-semibold text-white">
            Web gratis selama 14 hari. Aplikasi Android gratis tanpa batas waktu.
          </p>

        </div>

    </div>

    </div>

  );

}
