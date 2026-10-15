import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  InterstitialAdPluginEvents,
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

const LAST_TRANSITION_AD_KEY = "ks25-admob-last-module-transition";
const MIN_TRANSITION_INTERVAL_MS = 5 * 60 * 1000;
let interstitialReady = false;
let interstitialLoading: Promise<void> | undefined;
let transitionShowing = false;

export async function prepareModuleTransitionInterstitial(): Promise<void> {
  if (interstitialReady) return;
  if (interstitialLoading) return interstitialLoading;

  interstitialLoading = (async () => {
    if (!(await requestAdMobConsent())) return;
    try {
      await AdMob.prepareInterstitial({ adId: await getAdUnitId("interstitial") });
      interstitialReady = true;
    } catch (error) {
      console.warn("AdMob transition interstitial was not loaded:", error);
    }
  })().finally(() => {
    interstitialLoading = undefined;
  });

  return interstitialLoading;
}

export async function showModuleTransitionInterstitial(): Promise<void> {
  if (
    Capacitor.getPlatform() !== "android" ||
    !interstitialReady ||
    transitionShowing
  ) return;

  const lastShown = Number(localStorage.getItem(LAST_TRANSITION_AD_KEY) || 0);
  if (Date.now() - lastShown < MIN_TRANSITION_INTERVAL_MS) return;

  transitionShowing = true;
  let resolveClosed: () => void = () => undefined;
  const closed = new Promise<void>((resolve) => (resolveClosed = resolve));
  let dismissedHandle: Awaited<ReturnType<typeof AdMob.addListener>> | undefined;
  let failedHandle: Awaited<ReturnType<typeof AdMob.addListener>> | undefined;
  let showedHandle: Awaited<ReturnType<typeof AdMob.addListener>> | undefined;

  try {
    dismissedHandle = await AdMob.addListener(
      InterstitialAdPluginEvents.Dismissed,
      () => resolveClosed(),
    );
    failedHandle = await AdMob.addListener(
      InterstitialAdPluginEvents.FailedToShow,
      () => resolveClosed(),
    );
    showedHandle = await AdMob.addListener(
      InterstitialAdPluginEvents.Showed,
      () => localStorage.setItem(LAST_TRANSITION_AD_KEY, String(Date.now())),
    );
    await AdMob.showInterstitial({ adId: await getAdUnitId("interstitial") });
    interstitialReady = false;
    await Promise.race([
      closed,
      new Promise<void>((resolve) => window.setTimeout(resolve, 90_000)),
    ]);
  } catch (error) {
    console.warn("AdMob transition interstitial could not be shown:", error);
  } finally {
    interstitialReady = false;
    transitionShowing = false;
    await Promise.all([
      dismissedHandle?.remove(),
      failedHandle?.remove(),
      showedHandle?.remove(),
    ]);
    void prepareModuleTransitionInterstitial();
  }
}
