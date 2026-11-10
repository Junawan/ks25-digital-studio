"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/core/providers/AuthProvider";

import AuthGuard from "@/core/auth/AuthGuard";

import DashboardSidebar from "@/shared/layouts/DashboardSidebar";
import DashboardHeader from "@/shared/layouts/DashboardHeader";

import MobileShell from "@/shared/components/mobile/MobileShell";
import DeepLinkProvider from "@/shared/components/native/DeepLinkProvider";
import { EmployeeIdentityProvider } from "@/modules/employee-profile/EmployeeIdentityProvider";
import PlayStoreUpdatePrompt from "@/shared/components/native/PlayStoreUpdatePrompt";
import PushNotificationRegistration from "@/modules/notification/PushNotificationRegistration";
import DashboardBannerAd from "@/shared/ads/DashboardBannerAd";
import WebFreePlanGate from "@/shared/components/subscription/WebFreePlanGate";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {

  const [mobile, setMobile] =
    useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const guestRoute = pathname === "/dashboard" || pathname === "/dashboard/profile" || /^\/dashboard\/apps\/[^/]+$/.test(pathname || "");

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

  if (guestRoute && !user) {
    return (
      <div className="min-h-screen bg-muted/20">
        <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Link href="/dashboard" className="font-bold text-violet-700">KS25 Digital Studio</Link>
          <div className="flex items-center gap-2">
            <Link className="rounded-lg px-3 py-2 text-sm font-medium" href={`/login?next=${encodeURIComponent(pathname || "/dashboard")}`}>Masuk</Link>
            <Link className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800" href={`/register?next=${encodeURIComponent(pathname || "/dashboard")}`}>Ayo Mulai</Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 pb-24 md:p-6">{children}<DashboardBannerAd /></main>
        {mobile && <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t bg-background md:hidden"><Link href="/dashboard" className="py-3 text-center text-sm font-medium">Dashboard</Link><Link href="/dashboard/profile" className="py-3 text-center text-sm font-medium">Profil</Link></nav>}
      </div>
    );
  }

  return (

    <AuthGuard>
      <WebFreePlanGate>

      <EmployeeIdentityProvider>
      <DeepLinkProvider>

      <PlayStoreUpdatePrompt />
      <PushNotificationRegistration />
      {mobile ? (

        <MobileShell>

{children}
          <DashboardBannerAd />

        </MobileShell>

      ) : (

        <div className="flex min-h-screen bg-muted/30">

          <DashboardSidebar />

          <div className="flex flex-1 flex-col">

            <DashboardHeader />

            <main className="flex-1 p-6">

              {children}
              <DashboardBannerAd />

            </main>

          </div>

        </div>

      )}

      </DeepLinkProvider>
      </EmployeeIdentityProvider>
      </WebFreePlanGate>

    </AuthGuard>

  );

}
