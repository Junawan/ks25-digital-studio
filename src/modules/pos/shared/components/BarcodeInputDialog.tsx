"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Capacitor } from "@capacitor/core";

import { BarcodeScanOptions, BarcodeScanResult } from "../barcode/types/barcode";

import { QRCodeSVG } from "qrcode.react";
import { usePos } from "@/core/pos/usePos";
import { scannerDI } from "../scanner/di/scanner";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  options?: BarcodeScanOptions;

  onDetected: (
    result: BarcodeScanResult
  ) => void;

  onError?: (error: Error) => void;
}

export default function BarcodeInputDialog({
  open,
  onOpenChange,
  options,
  onDetected,
  onError,
}: Props) {

  const [scannerType, setScannerType] = useState<
  "menu" | "android" | "usb" | "webcam"
>("menu");

const {
  companyId,
  workstationId,
} = usePos();

const qrValue =
  `scanner?companyId=${companyId}&workstationId=${workstationId}`;

  useEffect(() => {
    if (!open) {
      return;
    }

    // Android akan langsung membuka
    // scanner native melalui BarcodeCamera.
  }, [open]);

  useEffect(() => {
  if (!open) {
    setScannerType("menu");
  }
}, [open]);

useEffect(() => {
  if (
    !open ||
    scannerType !== "android"
  ) {
    return;
  }

  const unsubscribe =
    scannerDI.scannerService.waitForScan(
      companyId,
      workstationId,
      async (session) => {

        if (
          session.status !== "scanned"
        ) {
          return;
        }

        onDetected({
          text: session.barcode,
          format: session.source,
          timestamp: session.updatedAt,
        });

        await scannerDI
          .scannerService
          .reset(
            companyId,
            workstationId
          );

        onOpenChange(false);
      }
    );

  return unsubscribe;

}, [
  open,
  scannerType,
  companyId,
  workstationId,
]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

  <DialogTitle>
    Scan Barcode
  </DialogTitle>

  <DialogDescription>

    {scannerType === "menu"
      ? "Pilih sumber scanner."
      : scannerType === "android"
      ? "Menunggu barcode dari aplikasi Android."
      : scannerType === "usb"
      ? "Silakan scan menggunakan USB Scanner."
      : "Arahkan kamera ke barcode."}

  </DialogDescription>

</DialogHeader>

{scannerType === "menu" && (

  <div className="space-y-3">

    <Button
      className="w-full"
      onClick={() =>
        setScannerType("android")
      }
    >
      📱 Android Scanner
    </Button>

    <Button
      className="w-full"
      variant="outline"
      onClick={() =>
        setScannerType("usb")
      }
    >
      ⌨ USB Scanner
    </Button>

  </div>

)}

{scannerType === "android" && (

  <div className="space-y-5">

    <div className="flex justify-center">

      <QRCodeSVG
        value={qrValue}
        size={220}
      />

    </div>

    <p
      className="
        text-center
        text-sm
        text-muted-foreground
      "
    >
      Scan QR ini menggunakan
      aplikasi KS25 pada Android.
    </p>

    <p
      className="
        text-center
        text-xs
        text-muted-foreground
      "
    >
      Setelah berhasil dipindai,
      Android akan berubah menjadi
      scanner barcode untuk desktop.
    </p>

  </div>

)}

{scannerType === "usb" && (

  <div className="py-8 text-center">

    <p className="font-medium">
      Silakan scan barcode menggunakan USB Scanner.
    </p>

  </div>

)}

<div className="flex justify-end">

  {scannerType !== "menu" && (
    <Button
      variant="ghost"
      onClick={() =>
        setScannerType("menu")
      }
    >
      Kembali
    </Button>
  )}

  <Button
    variant="outline"
    onClick={() =>
      onOpenChange(false)
    }
  >
    Tutup
  </Button>

</div>

      </DialogContent>
    </Dialog>
  );
}