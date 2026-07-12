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
  private reader =
    new BrowserMultiFormatReader();

  private controls?: IScannerControls;

  async scan(): Promise<BarcodeScanResult | null> {
    throw new Error(
      "Gunakan startCamera() pada browser."
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
      await this.reader.decodeFromConstraints(
        {
          video: {
            facingMode: {
              ideal: "environment",
            },

            width: {
              ideal: 1280,
            },

            height: {
              ideal: 720,
            },
          },
        },
        video,
        (result, error, controls) => {
          if (result) {
            onDetected({
              text: result.getText(),

              format:
                result
                  .getBarcodeFormat()
                  .toString(),

              timestamp: Date.now(),
            });

            if (
              options.mode !==
              "continuous"
            ) {
              controls.stop();
            }
          }

          // Error NotFound dan FormatException
          // diabaikan karena normal saat scanning.
        }
      );
  }

  async stop() {
    this.controls?.stop();

    this.controls = undefined;

    this.reader =
      new BrowserMultiFormatReader();
  }
}