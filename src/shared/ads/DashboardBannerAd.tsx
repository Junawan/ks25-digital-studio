"use client";

import { AdMob, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { requestAdMobConsent } from "@/shared/ads/admob-consent";
import { getAdUnitId } from "@/shared/ads/inline-native-ad-bridge";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

function isMainModulePage(pathname: string) {
  return ["/dashboard", "/pos", "/packflow", "/attendance", "/marketplace", "/live-assistant", "/my-apps", "/invitation"].includes(pathname);
}

export default function DashboardBannerAd() {
  const pathname = usePathname();
  const { workspace, loading } = useWorkspace();
  const [scannerMode, setScannerMode] = useState(false);

  useEffect(() => {
    const onScannerMode = (event: Event) => setScannerMode((event as CustomEvent<{ active: boolean }>).detail.active);
    window.addEventListener("ks25:scanner-mode", onScannerMode);
    return () => window.removeEventListener("ks25:scanner-mode", onScannerMode);
  }, []);

  useEffect(() => {
    if (
      Capacitor.getPlatform() !== "android" ||
      loading ||
      !workspace ||
      isProPlanActive(workspace.company) ||
      scannerMode ||
      pathname.startsWith("/scanner") ||
      !isMainModulePage(pathname)
    ) {
      void AdMob.hideBanner().catch(() => undefined);
      return;
    }

    let active = true;
    void (async () => {
      if (!(await requestAdMobConsent()) || !active) return;
      try {
        await AdMob.showBanner({
          adId: await getAdUnitId(),
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          // Keep the banner above the app's bottom navigation controls.
          margin: 64,
        });
      } catch (error) {
        console.warn("AdMob dashboard banner was not shown:", error);
      }
    })();

    return () => {
      active = false;
      void AdMob.hideBanner().catch(() => undefined);
    };
  }, [pathname, loading, workspace, scannerMode]);

  return null;
}
