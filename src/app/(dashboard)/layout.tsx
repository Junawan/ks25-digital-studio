"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/core/auth/AuthGuard";

import DashboardSidebar from "@/shared/layouts/DashboardSidebar";
import DashboardHeader from "@/shared/layouts/DashboardHeader";

import MobileShell from "@/shared/components/mobile/MobileShell";
import DeepLinkProvider from "@/shared/components/native/DeepLinkProvider";
import { EmployeeIdentityProvider } from "@/modules/employee-profile/EmployeeIdentityProvider";
import PlayStoreUpdatePrompt from "@/shared/components/native/PlayStoreUpdatePrompt";
import PushNotificationRegistration from "@/modules/notification/PushNotificationRegistration";
import DashboardBannerAd from "@/shared/ads/DashboardBannerAd";
import AdMobStartup from "@/shared/ads/AdMobStartup";
import AndroidUpgradePrompt from "@/shared/components/subscription/AndroidUpgradePrompt";
import WebFreePlanGate from "@/shared/components/subscription/WebFreePlanGate";

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
      <WebFreePlanGate>

      <EmployeeIdentityProvider>
      <DeepLinkProvider>

      <AndroidUpgradePrompt />
      <PlayStoreUpdatePrompt />
      <PushNotificationRegistration />
      <AdMobStartup />

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
