"use client";

import { Button } from "@/shared/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  useRouter,
} from "next/navigation";

import { BarcodeService } from "@/modules/pos/shared/barcode/services/BarcodeService";

import { scannerDI } from "@/modules/pos/shared/scanner/di/scanner";
import { beep } from "../../utils/beep";

export default function ScannerPage() {

    const barcodeService =
  new BarcodeService();

const [loading, setLoading] =
  useState(false);

const [result, setResult] =
  useState("");

  const [
  paired,
  setPaired,
] = useState(false);

  const [
  companyId,
  setCompanyId,
] = useState("");

const [
  workstationId,
  setWorkstationId,
] = useState("");

  const [status, setStatus] =
  useState<
    | "connecting"
    | "ready"
    | "sending"
  >("connecting");

  const router = useRouter();

const runningRef =
  useRef(false);

  async function handlePairing() {

  try {

    const barcode =
      await barcodeService.scan({

        mode: "single",

        vibrate: true,

      });

    if (!barcode) {
      return;
    }

    const url =
      new URL(
        barcode.text,
        "https://ks25.local"
      );

    const companyId =
      url.searchParams.get(
        "companyId"
      );

    const workstationId =
      url.searchParams.get(
        "workstationId"
      );

    if (
      !companyId ||
      !workstationId
    ) {
      return;
    }

    await scannerDI
      .pairingStorage
      .save({

        companyId,

        workstationId,

      });

    setCompanyId(
      companyId
    );

    setWorkstationId(
      workstationId
    );

    setPaired(true);

  } catch (error) {

    console.error(error);

  }

}

  async function handleScan() {

    setStatus("ready");

  if (
    !runningRef.current
  ) {
    return;
  }

  try {

    const barcode =
      await barcodeService.scan({
        mode: "single",
        vibrate: true,
      });

    if (
      !runningRef.current
    ) {
      return;
    }

    if (!barcode) {

  runningRef.current = false;

  setLoading(false);

  setStatus("ready");

  return;

}

    setResult(barcode.text);
    setStatus("sending");

    await scannerDI
  .pairingStorage
  .save({

    companyId,

    workstationId,

});

    await scannerDI
  .scannerService
  .sendBarcode(
    companyId,
    workstationId,
    barcode.text,
    "android"
  );

await scannerDI
  .scannerService
  .waitUntilReceived(
    companyId,
    workstationId
  );
  beep();
  setStatus("ready");

await scannerDI
  .scannerService
  .reset(
    companyId,
    workstationId
  );

if (
  runningRef.current
) {
  handleScan();
}

  } catch (error) {

  console.error(error);

  runningRef.current = false;

  setLoading(false);

  setStatus("ready");

}

}

useEffect(() => {

  async function load() {

    const pairing =
      await scannerDI
        .pairingStorage
        .load();

    if (!pairing) {

      setPaired(false);

      return;

    }

    setCompanyId(
      pairing.companyId
    );

    setWorkstationId(
      pairing.workstationId
    );

    setPaired(true);

  }

  load();

}, []);

useEffect(() => {

  if (
    !companyId ||
    !workstationId
  ) {
    return;
  }

  scannerDI
  .scannerService
  .initialize(
      companyId,
      workstationId
  );

setStatus("ready");

  scannerDI
    .scannerService
    .initialize(
      companyId,
      workstationId
    );

  runningRef.current = true;

  if (runningRef.current) {
    handleScan();
}

  return () => {

    runningRef.current = false;

  };

}, [
  companyId,
  workstationId,
]);

if (!paired) {

  return (

    <div
      className="
      space-y-6
      p-6
      "
    >

      <p
        className="
        text-center
        text-muted-foreground
        "
      >

        Scanner belum terhubung.

      </p>

      <Button
        className="w-full"
        onClick={
          handlePairing
        }
      >

        Hubungkan Scanner

      </Button>

    </div>

  );

}

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">

      <h1 className="text-2xl font-bold">
        Scanner
      </h1>

      <p
className="
text-sm
font-medium
"
>

{status==="connecting" &&
"🟡 Menghubungkan..."}

{status==="ready" &&
"🟢 Siap Scan"}

{status==="sending" &&
"🔵 Mengirim Barcode..."}

</p>


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

<Button
  className="w-full"
  onClick={() => {
    if (loading) return;

    runningRef.current = true;

    handleScan();
  }}
>
  Scan Lagi
</Button>

<Button
  variant="destructive"
  className="w-full"
  onClick={() => {

    runningRef.current =
      false;

    router.back();

  }}
>
  Tutup Scanner
</Button>

    </div>
  );
}