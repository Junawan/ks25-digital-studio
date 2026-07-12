import {
  BarcodeScanOptions,
  BarcodeScanResult,
} from "./barcode";

export interface BarcodeScannerAdapter {
  scan(
    options?: BarcodeScanOptions
  ): Promise<BarcodeScanResult | null>;

  stop(): Promise<void>;

  startCamera?(
    video: HTMLVideoElement,
    options: BarcodeScanOptions,
    onDetected: (
      result: BarcodeScanResult
    ) => void
  ): Promise<void>;
}