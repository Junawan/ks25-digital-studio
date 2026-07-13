import { Capacitor } from "@capacitor/core";

import { BarcodeScannerAdapter } from "../types/BarcodeScannerAdapter";
import { MlKitBarcodeScannerAdapter } from "../adapters/MlKitBarcodeScannerAdapter";
import { BarcodeScanOptions, BarcodeScanResult } from "../types/barcode";

export class BarcodeService {
  private readonly adapter: BarcodeScannerAdapter;

  constructor() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error(
      "Scanner barcode hanya didukung pada Android."
    );
  }

  this.adapter =
    new MlKitBarcodeScannerAdapter();
}

  scan(options?: BarcodeScanOptions) {
    return this.adapter.scan(options);
  }

  stop() {
    return this.adapter.stop();
  }
}