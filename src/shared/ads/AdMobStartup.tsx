"use client";

import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { useEffect } from "react";
import { prepareAppOpenAd, requestAdMobConsent, showAppOpenAd } from "@/shared/ads/admob-consent";

export default function AdMobStartup() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;

    const launchCountKey = "ks25-admob-app-open-count";
    const previousLaunchCount = Number(localStorage.getItem(launchCountKey) || 0);
    const launchCount = Number.isFinite(previousLaunchCount)
      ? previousLaunchCount + 1
      : 1;
    localStorage.setItem(launchCountKey, String(launchCount));
    let active = true;
    let wasBackgrounded = false;

    const prepare = async () => {
      if (!(await requestAdMobConsent()) || !active) return;
      await prepareAppOpenAd();
      // Avoid showing an ad on a brand-new install; show from the second launch.
      if (active && launchCount > 1) await showAppOpenAd();
    };

    void prepare();
    const listener = App.addListener("appStateChange", ({ isActive }) => {
      if (!isActive) {
        wasBackgrounded = true;
        return;
      }
      if (!wasBackgrounded) return;
      wasBackgrounded = false;
      void showAppOpenAd();
    });

    return () => {
      active = false;
      void listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
