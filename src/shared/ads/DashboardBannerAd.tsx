"use client";

import { AdMob, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { requestAdMobConsent } from "@/shared/ads/admob-consent";
import { getAdUnitId } from "@/shared/ads/inline-native-ad-bridge";

function isDashboardOrModulePath(pathname: string) {
  if (pathname === "/dashboard") return true;

  return [
    "/dashboard/apps",
    "/pos",
    "/packflow",
    "/attendance",
    "/scanner",
    "/marketplace",
    "/live-assistant",
    "/my-apps",
    "/digital-invitation",
    "/online-store",
  ].some((basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`));
}

export default function DashboardBannerAd() {
  const pathname = usePathname();
  const [appOpenAdShowing, setAppOpenAdShowing] = useState(false);

  useEffect(() => {
    const onOpenAdStart = () => setAppOpenAdShowing(true);
    const onOpenAdEnd = () => setAppOpenAdShowing(false);
    window.addEventListener("ks25:app-open-ad-start", onOpenAdStart);
    window.addEventListener("ks25:app-open-ad-end", onOpenAdEnd);
    return () => {
      window.removeEventListener("ks25:app-open-ad-start", onOpenAdStart);
      window.removeEventListener("ks25:app-open-ad-end", onOpenAdEnd);
    };
  }, []);

  useEffect(() => {
    if (
      Capacitor.getPlatform() !== "android" ||
      appOpenAdShowing ||
      !isDashboardOrModulePath(pathname)
    ) {
      void AdMob.hideBanner().catch(() => undefined);
      return;
    }

    let active = true;
    void (async () => {
      if (!(await requestAdMobConsent()) || !active) return;
      try {
        await AdMob.showBanner({
          adId: await getAdUnitId("banner"),
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
  }, [appOpenAdShowing, pathname]);

  return null;
}
