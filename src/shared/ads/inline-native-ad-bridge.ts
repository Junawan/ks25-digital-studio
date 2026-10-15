import { registerPlugin } from "@capacitor/core";

export interface AdMobBuildInfoPlugin {
  isDebugBuild(): Promise<{ debug: boolean }>;
}

export const AdMobBuildInfo = registerPlugin<AdMobBuildInfoPlugin>("AdMobBuildInfo");

const BANNER_AD_UNITS = {
  production: "ca-app-pub-7628385043445495/2667756780",
  test: "ca-app-pub-3940256099942544/6300978111",
};

const INTERSTITIAL_AD_UNITS = {
  production: "ca-app-pub-7628385043445495/6578992340",
  test: "ca-app-pub-3940256099942544/1033173712",
};

export async function getAdUnitId(format: "banner" | "interstitial") {
  let isDebug = true;
  try {
    isDebug = (await AdMobBuildInfo.isDebugBuild()).debug;
  } catch {
    // Fail safe to Google's test inventory if the native build can't be identified.
  }

  const units = format === "banner" ? BANNER_AD_UNITS : INTERSTITIAL_AD_UNITS;
  return isDebug ? units.test : units.production;
}
