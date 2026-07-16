"use client";

import { useState, useRef, useEffect } from "react";

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

import { scannerDI, usbScanner }
from "@/modules/pos/shared/scanner/di/scanner";
import ScannerPairingDialog from "../../shared/scanner/components/ScannerPairingDialog";
import { beep } from "../../shared/utils/beep";
import { Capacitor } from "@capacitor/core";
import { BarcodeService } from "../../shared/barcode/services/BarcodeService";
import CheckoutForm
from "../components/CheckoutForm";
import PaymentDialog
from "../components/PaymentDialog";

export default function TransactionPage() {

  const { workspace } =
  useWorkspace();

const company =
  workspace?.company;

  const [keyword, setKeyword] =
    useState("");

  const {
  cart,
  summary,
  addVariant,
  removeItem,

  increaseQty,
  decreaseQty,
  updateQty,

  discount,
  setDiscount,

  cashierId,
  setCashierId,

  customer,
  setCustomer,

  paymentMethod,
  setPaymentMethod,

  paidAmount,
  setPaidAmount,

  changeAmount,
} = useTransaction();

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
  paymentOpen,
  setPaymentOpen,
] = useState(false);

const [
  androidScanning,
  setAndroidScanning,
] = useState(false);

const [
  pairingStartedAt,
  setPairingStartedAt,
] = useState(0);

const runningRef =
  useRef(false);

  async function handleAndroidScan() {

  if (
    !runningRef.current
  ) {
    return;
  }

  try {

    const barcodeService =
      new BarcodeService();

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

      runningRef.current =
        false;

      setAndroidScanning(
        false
      );

      return;

    }

    addBarcode(
      barcode.text
    );

    if (
      runningRef.current
    ) {

      handleAndroidScan();

    }

  } catch (error) {

    console.error(error);

    runningRef.current =
      false;

    setAndroidScanning(
      false
    );

  }

}

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
  onKeywordChange={
    setKeyword
  }
  onScan={() => {

    if (
      Capacitor.isNativePlatform()
    ) {

      if (
        androidScanning
      ) {
        return;
      }

      runningRef.current =
        true;

      setAndroidScanning(
        true
      );

      handleAndroidScan();

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
  onDelete={removeItem}
  onIncreaseQty={
    increaseQty
  }
  onDecreaseQty={
    decreaseQty
  }
  onUpdateQty={
    updateQty
  }
/>

      <CartSummary
  summary={summary}
/>

<CheckoutForm
  companyId={company.id}

  discount={discount}
  cashierId={cashierId}
  customer={customer}

  onDiscountChange={
    setDiscount
  }

  onCashierChange={
    setCashierId
  }

  onCustomerChange={
    setCustomer
  }

/>

<Button
  className="w-full h-12"
  disabled={
    cart.length === 0
  }
  onClick={() =>
    setPaymentOpen(true)
  }
>
  Bayar
</Button>

<PaymentDialog
  open={paymentOpen}
  onOpenChange={
    setPaymentOpen
  }
  total={summary.total}
  paymentMethod={
    paymentMethod
  }
  paidAmount={
    paidAmount
  }
  changeAmount={
    changeAmount
  }
  staticQrisUrl={
    undefined
  }
  onPaymentMethodChange={
    setPaymentMethod
  }
  onPaidAmountChange={
    setPaidAmount
  }
  onConfirm={() => {
    console.log(
      "Checkout..."
    );
  }}
/>

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