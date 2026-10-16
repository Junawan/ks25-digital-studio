"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

import {
  prepareModuleTransitionInterstitial,
  showModuleTransitionInterstitial,
} from "@/shared/ads/admob-consent";

export default function AdMobStartup() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const { workspace, loading } = useWorkspace();

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android" || loading) return;
    if (isProPlanActive(workspace?.company)) return;

    void prepareModuleTransitionInterstitial();

    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const isDashboardOrModule =
      pathname === "/dashboard" ||
      [
        "/dashboard/apps",
        "/pos",
        "/packflow",
        "/attendance",
        "/scanner",
        "/marketplace",
        "/live-assistant",
        "/my-apps",
      ].some((basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`));

    if (isDashboardOrModule && !isProPlanActive(workspace?.company)) {
      void prepareModuleTransitionInterstitial().then(
        showModuleTransitionInterstitial,
      );
    }
  }, [loading, pathname, workspace?.company]);

  return null;
}
