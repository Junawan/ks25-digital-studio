import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  AppOpenAdPluginEvents,
} from "@capacitor-community/admob";
import { getAdUnitId } from "@/shared/ads/inline-native-ad-bridge";

let consentRequest: Promise<boolean> | undefined;

export function requestAdMobConsent(): Promise<boolean> {
  if (Capacitor.getPlatform() !== "android") return Promise.resolve(false);
  if (consentRequest) return consentRequest;

  consentRequest = (async () => {
    await AdMob.initialize();
    let info = await AdMob.requestConsentInfo();

    if (
      info.isConsentFormAvailable &&
      info.status === AdmobConsentStatus.REQUIRED
    ) {
      info = await AdMob.showConsentForm();
    }

    return info.canRequestAds;
  })().catch((error) => {
    console.error("AdMob consent could not be completed:", error);
    consentRequest = undefined;
    return false;
  });

  return consentRequest;
}

let appOpenReady = false;
let appOpenLoading: Promise<void> | undefined;
let appOpenShowing = false;

export async function prepareAppOpenAd(): Promise<void> {
  if (Capacitor.getPlatform() !== "android" || appOpenReady) return;
  if (appOpenLoading) return appOpenLoading;

  appOpenLoading = (async () => {
    if (!(await requestAdMobConsent())) return;
    const adId = await getAdUnitId("app-open");
    if (!adId) {
      console.warn("Configure NEXT_PUBLIC_ADMOB_APP_OPEN_AD_UNIT_ID to enable production App Open ads.");
      return;
    }
    try {
      await AdMob.loadAppOpen({ adId });
      appOpenReady = true;
    } catch (error) {
      console.warn("AdMob App Open ad was not loaded:", error);
    }
  })().finally(() => {
    appOpenLoading = undefined;
  });

  return appOpenLoading;
}

export async function showAppOpenAd(): Promise<void> {
  if (Capacitor.getPlatform() !== "android" || !appOpenReady || appOpenShowing) return;
  const adId = await getAdUnitId("app-open");
  if (!adId) return;

  try {
    const loaded = await AdMob.isAppOpenLoaded({ adId });
    if (!loaded.value) {
      appOpenReady = false;
      return;
    }
  } catch (error) {
    appOpenReady = false;
    console.warn("AdMob App Open ad is no longer available:", error);
    void prepareAppOpenAd();
    return;
  }

  appOpenShowing = true;
  appOpenReady = false;
  let finish: () => void = () => undefined;
  const closed = new Promise<void>((resolve) => (finish = resolve));
  let closedHandle: Awaited<ReturnType<typeof AdMob.addListener>> | undefined;
  let failedHandle: Awaited<ReturnType<typeof AdMob.addListener>> | undefined;

  try {
    closedHandle = await AdMob.addListener(AppOpenAdPluginEvents.Closed, finish);
    failedHandle = await AdMob.addListener(AppOpenAdPluginEvents.FailedToShow, finish);
    await AdMob.hideBanner().catch(() => undefined);
    window.dispatchEvent(new Event("ks25:app-open-ad-start"));
    await AdMob.showAppOpen({ adId });
    await Promise.race([closed, new Promise<void>((resolve) => window.setTimeout(resolve, 60_000))]);
  } catch (error) {
    console.warn("AdMob App Open ad could not be shown:", error);
  } finally {
    appOpenShowing = false;
    window.dispatchEvent(new Event("ks25:app-open-ad-end"));
    await Promise.all([closedHandle?.remove(), failedHandle?.remove()]);
    void prepareAppOpenAd();
  }
}
