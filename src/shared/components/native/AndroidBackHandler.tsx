"use client";

import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { useAndroidBack } from "@/hooks/useAndroidBack";

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
      router.push(href);
      return true;
    }

    // Default kembali
    router.back();

    return true;
  });

  return null;
}