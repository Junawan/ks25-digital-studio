"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

import { prepareModuleTransitionInterstitial } from "@/shared/ads/admob-consent";

export default function AdMobStartup() {
  useEffect(() => {
    if (Capacitor.getPlatform() === "android") {
      void prepareModuleTransitionInterstitial();
    }
  }, []);

  return null;
}
