"use client";

import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

import { BarcodeService } from "@/modules/pos/shared/barcode/services/BarcodeService";

import { useSearchParams } from "next/navigation";

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
    setLoading(true);

    const barcode =
      await barcodeService.scan({
        mode: "single",
        vibrate: true,
      });

    if (!barcode) {
      return;
    }

    setResult(barcode.text);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
}
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