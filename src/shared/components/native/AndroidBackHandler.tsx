"use client";

import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import { showModuleTransitionInterstitial } from "@/shared/ads/admob-consent";

interface AndroidBackHandlerProps {
  href?: string;
  exitApp?: boolean;
  onBack?: () => boolean | void;
}

export default function AndroidBackHandler({
  href,
  exitApp = false,
  onBack,
}: AndroidBackHandlerProps) {
  const router = useRouter();

  useAndroidBack(() => {
    // Beri kesempatan halaman menangani Back sendiri
    const handled = onBack?.();

    if (handled === true) {
      return true;
    }

    // Keluar aplikasi
    if (exitApp) {
      if (Capacitor.isNativePlatform()) {
        App.exitApp();
      }

      return true;
    }

    // Push ke halaman tertentu
    if (href) {
      if (href === "/dashboard" || href === "/dashboard/") {
        void showModuleTransitionInterstitial().finally(() => router.push(href));
      } else {
        router.push(href);
      }
      return true;
    }

    // Default kembali
    router.back();

    return true;
  });

  return null;
}
