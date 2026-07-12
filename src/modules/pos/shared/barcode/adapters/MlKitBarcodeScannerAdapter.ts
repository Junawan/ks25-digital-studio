import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

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