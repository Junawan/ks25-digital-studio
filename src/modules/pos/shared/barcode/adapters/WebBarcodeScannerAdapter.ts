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
        min: 1280,
        ideal: 1920,
        max: 3840,
      },

      height: {
        min: 720,
        ideal: 1080,
        max: 2160,
      },

      frameRate: {
        ideal: 30,
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

  console.log(capabilities);

try {
  if (
    capabilities &&
    "focusMode" in capabilities
  ) {
    await track.applyConstraints({
      advanced: [
        {
          focusMode:
            "continuous",
        } as MediaTrackConstraintSet,
      ],
    });
  }
} catch (e) {
  console.log(
    "Focus tidak didukung."
  );
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