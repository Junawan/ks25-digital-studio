"use client";

import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Capacitor } from "@capacitor/core";

import BarcodeCamera from "./BarcodeCamera";
import { BarcodeScanOptions, BarcodeScanResult } from "../barcode/types/barcode";



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
  useEffect(() => {
    if (!open) {
      return;
    }

    // Android akan langsung membuka
    // scanner native melalui BarcodeCamera.
  }, [open]);

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
            {Capacitor.isNativePlatform()
              ? "Membuka kamera..."
              : "Arahkan webcam ke barcode produk."}
          </DialogDescription>

        </DialogHeader>

        <BarcodeCamera
          active={open}
          options={options}
          onDetected={(result) => {
            onDetected(result);

            onOpenChange(false);
          }}
          onError={(error) => {
            onError?.(error);
          }}
        />

        <p
  className="
    mt-3
    text-center
    text-xs
    text-muted-foreground
  "
>
  Dekatkan barcode sekitar
  10–15 cm dari kamera dan
  pastikan pencahayaan cukup.
</p>

        <Button
          variant="outline"
          onClick={() =>
            onOpenChange(false)
          }
        >
          Tutup
        </Button>

      </DialogContent>
    </Dialog>
  );
}