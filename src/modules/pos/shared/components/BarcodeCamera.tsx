"use client";

import {
  useEffect,
  useRef,
} from "react";

import { Capacitor } from "@capacitor/core";
import { BarcodeScanOptions, BarcodeScanResult } from "../barcode/types/barcode";
import { BarcodeService } from "../barcode/services/BarcodeService";


interface Props {
  active: boolean;

  options?: BarcodeScanOptions;

  onDetected: (
    result: BarcodeScanResult
  ) => void;

  onError?: (error: Error) => void;
}

export default function BarcodeCamera({
  active,
  options,
  onDetected,
  onError,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const serviceRef =
    useRef(new BarcodeService());

  useEffect(() => {
    if (!active) {
      serviceRef.current.stop();
      return;
    }

    // Android memakai ML Kit
    if (Capacitor.isNativePlatform()) {
      serviceRef.current
        .scan(options)
        .then((result) => {
          if (result) {
            onDetected(result);
          }
        })
        .catch((error) => {
          onError?.(
            error instanceof Error
              ? error
              : new Error("Scan gagal.")
          );
        });

      return;
    }

    // Browser memakai webcam
    if (!videoRef.current) {
      return;
    }

    serviceRef.current
      .startCamera(
        videoRef.current,
        options ?? {},
        onDetected
      )
      .catch((error) => {
        onError?.(
          error instanceof Error
            ? error
            : new Error(
                "Kamera tidak dapat dibuka."
              )
        );
      });

    return () => {
      serviceRef.current.stop();
    };
  }, [
    active,
    options,
    onDetected,
    onError,
  ]);

  if (Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className="
        aspect-square
        w-full
        rounded-xl
        bg-black
      "
      muted
      playsInline
      autoPlay
    />
  );
}