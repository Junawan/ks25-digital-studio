import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
} from "@capacitor-community/admob";

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

