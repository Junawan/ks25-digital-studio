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

  private stream?: MediaStream;

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

  this.stream =
    await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: "environment",
        },

        width: {
          ideal: 1920,
        },

        height: {
          ideal: 1080,
        },
      },
    });

  video.srcObject = this.stream;

  video.setAttribute(
    "playsinline",
    "true"
  );

  video.muted = true;

  await video.play();

  const track =
  this.stream
    .getVideoTracks()[0];

const capabilities =
  track.getCapabilities?.();

if (
  capabilities &&
  "focusMode" in capabilities
) {
  try {
    await track.applyConstraints({
      advanced: [
        {
          focusMode:
            "continuous",
        } as MediaTrackConstraintSet,
      ],
    });
  } catch {
    // Browser tidak mendukung.
  }
}

  this.controls =
    await this.reader.decodeFromVideoElement(
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

  if (this.stream) {
    this.stream
      .getTracks()
      .forEach((track) =>
        track.stop()
      );

    this.stream = undefined;
  }
}
}