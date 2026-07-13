"use client";

import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";

import { BarcodeService } from "@/modules/pos/shared/barcode/services/BarcodeService";

import { useSearchParams } from "next/navigation";

import { scannerDI } from "@/modules/pos/shared/scanner/di/scanner";

export default function ScannerPage() {

    const barcodeService =
  new BarcodeService();

const [loading, setLoading] =
  useState(false);

const [result, setResult] =
  useState("");

  const params =
  useSearchParams();

const companyId =
  params.get("companyId") ?? "";

const workstationId =
  params.get("workstationId") ?? "";

  async function handleScan() {
  try {
    const result =
      await barcodeService.scan({
        mode: "single",
        vibrate: true,
      });

    if (!result) {
      return;
    }

    await scannerDI.scannerService.sendBarcode(
      companyId,
      workstationId,
      result.text,
      "android"
    );

    alert("Barcode berhasil dikirim.");
  } catch (error) {
    console.error(error);
  }
}

useEffect(() => {
  if (!companyId || !workstationId) {
    return;
  }

  scannerDI.scannerService.initialize(
    companyId,
    workstationId
  );
}, [
  companyId,
  workstationId,
]);
  return (
    <div className="mx-auto max-w-md space-y-6 p-6">

      <h1 className="text-2xl font-bold">
        Scanner
      </h1>

      <p className="text-sm text-muted-foreground">
        Scan barcode menggunakan kamera Android.
      </p>

      <Button
  className="w-full"
  disabled={loading}
  onClick={handleScan}
>
  {loading
    ? "Membuka Scanner..."
    : "Mulai Scan"}
</Button>

{result && (

  <div className="rounded-lg border p-4">

    <p className="text-sm text-muted-foreground">
      Barcode
    </p>

    <p>{companyId}</p>

<p>{workstationId}</p>

    <p className="mt-1 text-lg font-semibold">
      {result}
    </p>

  </div>

)}

    </div>
  );
}