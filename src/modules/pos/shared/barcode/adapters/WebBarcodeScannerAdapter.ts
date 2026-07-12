import {
  BrowserMultiFormatReader,
  IScannerControls,
} from "@zxing/browser";

import {
  BarcodeScanOptions,
  BarcodeScanResult,
} from "../types/barcode";

import { BarcodeScannerAdapter } from "../types/BarcodeScannerAdapter";

export class WebBarcodeScannerAdapter
  implements BarcodeScannerAdapter
{
  private readonly reader =
    new BrowserMultiFormatReader();

  private controls?: IScannerControls;

  async scan(
    _options?: BarcodeScanOptions
  ): Promise<BarcodeScanResult | null> {
    throw new Error(
      "Gunakan startCamera() untuk scanner webcam."
    );
  }

  async startCamera(
    video: HTMLVideoElement,
    options: BarcodeScanOptions,
    onDetected: (
      result: BarcodeScanResult
    ) => void
  ) {
    await this.stop();

    this.controls =
      await this.reader.decodeFromVideoDevice(
        undefined,
        video,
        (result) => {
          if (!result) {
            return;
          }

          onDetected({
            text: result.getText(),
            format: result
              .getBarcodeFormat()
              .toString(),
            timestamp: Date.now(),
          });

          if (
            options.mode !==
            "continuous"
          ) {
            this.stop();
          }
        }
      );
  }

  async stop() {
    this.controls?.stop();
    this.controls = undefined;
  }
}