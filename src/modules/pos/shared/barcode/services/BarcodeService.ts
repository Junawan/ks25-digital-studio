import { Capacitor } from "@capacitor/core";

import { BarcodeScannerAdapter } from "../types/BarcodeScannerAdapter";
import { MlKitBarcodeScannerAdapter } from "../adapters/MlKitBarcodeScannerAdapter";
import { BarcodeScanOptions, BarcodeScanResult } from "../types/barcode";
import { WebBarcodeScannerAdapter } from "../adapters/WebBarcodeScannerAdapter";

export class BarcodeService {
  private readonly adapter: BarcodeScannerAdapter;

  constructor() {
    this.adapter = Capacitor.isNativePlatform()
      ? new MlKitBarcodeScannerAdapter()
      : new WebBarcodeScannerAdapter();
  }

  scan(options?: BarcodeScanOptions) {
    return this.adapter.scan(options);
  }

  stop() {
    return this.adapter.stop();
  }

  async startCamera(
  video: HTMLVideoElement,
  options: BarcodeScanOptions,
  onDetected: (
    result: BarcodeScanResult
  ) => void
) {
  if (
    "startCamera" in this.adapter &&
    this.adapter.startCamera
  ) {
    return this.adapter.startCamera(
      video,
      options,
      onDetected
    );
  }

  throw new Error(
    "Camera scanner tidak tersedia."
  );
}
}