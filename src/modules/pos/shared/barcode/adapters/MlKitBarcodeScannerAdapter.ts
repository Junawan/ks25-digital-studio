import { BarcodeScanner, GoogleBarcodeScannerModuleInstallState } from "@capacitor-mlkit/barcode-scanning";
import { Capacitor } from "@capacitor/core";

import {
  BarcodeScanOptions,
  BarcodeScanResult,
} from "../types/barcode";

import { BarcodeScannerAdapter } from "../types/BarcodeScannerAdapter";

export class MlKitBarcodeScannerAdapter
  implements BarcodeScannerAdapter
{
  async scan(
    options?: BarcodeScanOptions
  ): Promise<BarcodeScanResult | null> {
    const supported =
      await BarcodeScanner.isSupported();

    if (!supported.supported) {
      throw new Error(
        "Barcode Scanner tidak didukung pada perangkat ini."
      );
    }

    if (Capacitor.getPlatform() === "android") {
      const module = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!module.available) {
        const installed = new Promise<void>((resolve, reject) => {
          let timeout: ReturnType<typeof setTimeout> | undefined;
          const listenerPromise = BarcodeScanner.addListener("googleBarcodeScannerModuleInstallProgress", (event) => {
            if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("packflow:scanner-install-progress", { detail: event }));
            if (event.state === GoogleBarcodeScannerModuleInstallState.COMPLETED) {
              clearTimeout(timeout);
              void listenerPromise.then((listener) => listener.remove());
              resolve();
            } else if (event.state === GoogleBarcodeScannerModuleInstallState.FAILED || event.state === GoogleBarcodeScannerModuleInstallState.CANCELED) {
              clearTimeout(timeout);
              void listenerPromise.then((listener) => listener.remove());
              reject(new Error("Modul pemindai Google gagal dipasang. Periksa koneksi internet dan Google Play Services, lalu coba lagi."));
            }
          });
          timeout = setTimeout(() => {
            void listenerPromise.then((listener) => listener.remove());
            reject(new Error("Pemasangan pemindai masih berlangsung. Tunggu sebentar, lalu buka pemindai lagi."));
          }, 120_000);
          void listenerPromise.then(() => BarcodeScanner.installGoogleBarcodeScannerModule()).catch((error: unknown) => {
            clearTimeout(timeout);
            reject(error instanceof Error ? error : new Error("Google Play Services tidak dapat memasang modul pemindai."));
          });
        });
        await installed;
      }
    }

    const permissions =
      await BarcodeScanner.requestPermissions();

    if (permissions.camera !== "granted") {
      throw new Error(
        "Izin kamera ditolak."
      );
    }

    const result =
      await BarcodeScanner.scan();

    const barcode =
      result.barcodes.at(0);

    if (!barcode) {
      return null;
    }

    const text =
      barcode.rawValue ??
      barcode.displayValue;

    if (!text) {
      return null;
    }

    if (
      options?.vibrate &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate(80);
    }

    return {
      text,
      format: String(barcode.format),
      timestamp: Date.now(),
    };
  }

  async stop(): Promise<void> {
    // scan() adalah one-shot.
    // Tidak ada stream yang perlu dihentikan.
  }
}
