"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/core/auth/AuthGuard";

import DashboardSidebar from "@/shared/layouts/DashboardSidebar";
import DashboardHeader from "@/shared/layouts/DashboardHeader";

import MobileShell from "@/shared/components/mobile/MobileShell";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {

  const [mobile, setMobile] =
    useState(false);

  useEffect(() => {

    function update() {
      setMobile(
        window.innerWidth < 768
      );
    }

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () =>
      window.removeEventListener(
        "resize",
        update);

  }, []);

  return (

    <AuthGuard>

      {mobile ? (

        <MobileShell>

          {children}

        </MobileShell>

      ) : (

        <div className="flex min-h-screen bg-muted/30">

          <DashboardSidebar />

          <div className="flex flex-1 flex-col">

            <DashboardHeader />

            <main className="flex-1 p-6">

              {children}

            </main>

          </div>

        </div>

      )}

    </AuthGuard>

  );

}