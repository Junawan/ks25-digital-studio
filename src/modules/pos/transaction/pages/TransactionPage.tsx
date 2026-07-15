"use client";

import { useState } from "react";

import PageHeader
from "@/modules/pos/shared/components/PageHeader";

import { Button }
from "@/shared/components/ui/button";

import CartCard
from "../components/CartCard";

import CartSummary
from "../components/CartSummary";

import TransactionToolbar
from "../components/TransactionToolbar";

import { useTransaction }
from "../hooks/useTransaction";

import { useProducts } from "@/modules/pos/product/hooks/useProducts";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { useProductSearch } from "../hooks/useProductSearch";

import SearchResult from "../components/SearchResult";

import VariantPickerDialog from "../components/VariantPickerDialog";
import { Product } from "../../product/types/product";
import { useEffect } from "react";

import { scannerDI, usbScanner }
from "@/modules/pos/shared/scanner/di/scanner";
import ScannerPairingDialog from "../../shared/scanner/components/ScannerPairingDialog";
import { beep } from "../../shared/utils/beep";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";

export default function TransactionPage() {

  const { workspace } =
  useWorkspace();

const company =
  workspace?.company;

  const router = useRouter();

  const [keyword, setKeyword] =
    useState("");

  const {

cart,

summary,

addVariant,

removeItem,

} =
useTransaction();

function addBarcode(
  barcode: string
) {
  const found =
    findByBarcode(barcode);

  if (!found) {
    console.warn(
      "Barcode tidak ditemukan:",
      barcode
    );

    return;
  }

  addVariant(
    found.product,
    found.variant
  );
  beep();
}

    const {
  products,
  findByBarcode,
} = useProducts({
  companyId:
    company?.id ?? "",
});

const results =
  useProductSearch({
    keyword,
    products,
});

const [
  selectedProduct,
  setSelectedProduct,
] =
useState<Product>();

const [
  variantOpen,
  setVariantOpen,
] =
useState(false);

const [
scannerOpen,
setScannerOpen,
]=useState(false);

const [
  pairingStartedAt,
  setPairingStartedAt,
] = useState(0);

useEffect(() => {

  if (!company) {
    return;
  }

  const unsubscribe =
    scannerDI
      .scannerService
      .waitForScan(
        company.id,
        "kasir-1",
        async (session) => {

          if (
            session.status !== "scanned"
          ) {
            return;
          }

          const found =
            findByBarcode(
              session.barcode
            );

            console.log(
  "Barcode:",
  session.barcode
);

console.log(
  "Found:",
  found
);

            if (found) {
  console.log({
    scannedBarcode: session.barcode,
    product: found.product.name,
    variant: found.variant.name,
    variantBarcode: found.variant.barcode,
  });
}

          if (!found) {
            beep(
    400,
    250
);

            await scannerDI
              .scannerService
              .reset(
                company.id,
                "kasir-1"
              );

            return;
          }

          addVariant(
            found.product,
            found.variant
          );

          await scannerDI
            .scannerService
            .markReceived(
              company.id,
              "kasir-1"
            );

        }
      );

  return unsubscribe;

}, [
  company,
  findByBarcode,
  addVariant,
]);

useEffect(() => {

    usbScanner.start(
        addBarcode
    );

    return () => {

        usbScanner.stop();

    };

}, []);

useEffect(() => {

  if (
    !scannerOpen ||
    !company
  ) {
    return;
  }

  const unsubscribe =
    scannerDI
      .scannerService
      .waitForScan(
        company.id,
        "kasir-1",
        (session) => {

          if (
  session.status === "pairing"
) {

  setScannerOpen(false);

}

        }
      );

  return unsubscribe;

}, [
  scannerOpen,
  company,
  pairingStartedAt,
]);

if (!company) {
  return null;
}

  return (

    <div className="space-y-6">

      <PageHeader
        title="Transaksi"
        description="Penjualan POS"
      />

      <TransactionToolbar
  keyword={keyword}
  onKeywordChange={setKeyword}
  onScan={() => {

    if (Capacitor.isNativePlatform()) {

      router.push("/scanner");

      return;

    }

    setScannerOpen(true);

  }}
/>

      <SearchResult
  products={results}
  onSelect={(product) => {

    if (
      product.variants.length === 1
    ) {

      addVariant(
        product,
        product.variants[0]
      );

      return;
    }

    setSelectedProduct(
      product
    );

    setVariantOpen(true);

  }}
/>

      <CartCard

cart={cart}

onDelete={
removeItem
}

/>

      <CartSummary
        summary={summary}
      />

      <Button
        className="
        w-full
        h-12
        "
        disabled={
          cart.length === 0
        }
      >
        Bayar
      </Button>

      <VariantPickerDialog
  open={variantOpen}
  product={selectedProduct}
  onOpenChange={
    setVariantOpen
  }
  onSelect={(variant) => {

    if (!selectedProduct) {
      return;
    }

    addVariant(
      selectedProduct,
      variant
    );

  }}
/>

<ScannerPairingDialog

open={scannerOpen}

onOpenChange={
setScannerOpen
}

companyId={
  company?.id ?? ""
}

workstationId="kasir-1"

/>

    </div>

  );

}