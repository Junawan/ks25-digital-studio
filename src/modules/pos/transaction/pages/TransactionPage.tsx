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
import { transactionDI } from "../di/transaction";
import { toast } from "sonner";
import PaymentSuccessDialog from "../components/PaymentSuccessDialog";
import { printReceipt } from "../../shared/print/printerReceipt";
import { getPosSettingsUseCase } from "../../settings/di";
import { printInvoice } from "../../shared/print/printInvoice";
import { draftTransactionDI }
from "../di/draftTransaction";

import type { DraftTransaction }
from "../types/draftTransaction";
import DraftTransactionDialog
from "../components/DraftTransactionDialog";

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

  resetTransaction,
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
  draftOpen,
  setDraftOpen,
] = useState(false);

const [
  drafts,
  setDrafts,
] = useState<DraftTransaction[]>(
  []
);

const [
  draftsLoading,
  setDraftsLoading,
] = useState(false);

const [
  androidScanning,
  setAndroidScanning,
] = useState(false);

const [
  pairingStartedAt,
  setPairingStartedAt,
] = useState(0);

const [
  checkoutLoading,
  setCheckoutLoading,
] = useState(false);

const [successOpen, setSuccessOpen] =
  useState(false);

const [lastTransaction, setLastTransaction] =
  useState<{
    invoiceNumber: string;
    transactionDate: string;
    total: number;
    paymentMethod: typeof paymentMethod;
    paidAmount: number;
    changeAmount: number;
    cashierName: string,
    customerName: string;
  } | null>(null);

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

async function handlePrintReceipt() {
  if (!company || !lastTransaction) {
    return;
  }

  try {
    const settings =
      await getPosSettingsUseCase.execute(
        company.id
      );

    if (!settings) {
      toast.error(
        "Pengaturan POS belum tersedia."
      );

      return;
    }

    const transaction =
      await transactionDI.repository.getByInvoiceNumber(
        company.id,
        lastTransaction.invoiceNumber
      );

    if (!transaction) {
      toast.error(
        "Transaksi tidak ditemukan."
      );

      return;
    }

    await printReceipt({
      company,
      settings,
      transaction,
    });

  } catch (error) {

    console.error(error);

    toast.error(
      "Gagal mencetak struk."
    );

  }
}

async function handlePrintInvoice() {
  if (!company || !lastTransaction) {
    return;
  }

  try {
    const settings = await getPosSettingsUseCase.execute(company.id);

    if (!settings) {
      toast.error("Pengaturan POS belum tersedia.");
      return;
    }

    const transaction =
      await transactionDI.repository.getByInvoiceNumber(
        company.id,
        lastTransaction.invoiceNumber
      );

    if (!transaction) {
      toast.error("Transaksi tidak ditemukan.");
      return;
    }

    await printInvoice({
      company,
      settings,
      transaction,
    });
  } catch (error) {
    console.error(error);

    toast.error("Gagal mencetak invoice.");
  }
}

function handleNewTransaction() {
  setSuccessOpen(false);
}

async function handleSaveDraft() {

  if (!company) {
    return;
  }

  if (cart.length === 0) {
    toast.error(
      "Keranjang masih kosong."
    );

    return;
  }

  try {

    const now =
      new Date();

    const draft: DraftTransaction = {

      draftId:
        crypto.randomUUID(),

      companyId:
        company.id,

      cashierId,

      customer,

      paymentMethod,

      paidAmount,

      discount,

      cart,

      createdAt:
        now,

      updatedAt:
        now,

    };

    await draftTransactionDI
      .repository
      .create(
        draft
      );

    resetTransaction();

    toast.success(
      "Transaksi berhasil disimpan sebagai draft."
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Gagal menyimpan transaksi sebagai draft."
    );

  }

}

async function loadDrafts() {

  if (!company) {
    return;
  }

  try {

    setDraftsLoading(
      true
    );

    const result =
      await draftTransactionDI
        .repository
        .getAll(
          company.id
        );

    setDrafts(
      result
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Gagal mengambil transaksi tersimpan."
    );

  } finally {

    setDraftsLoading(
      false
    );

  }

}

async function handleCheckout() {

  if (!company) {
    return;
  }

  if (!cashierId) {
    toast.error(
      "Pilih kasir terlebih dahulu."
    );
    return;
  }

  try {

    setCheckoutLoading(true);

    const transaction =
      await transactionDI
        .checkoutUseCase
        .execute({

          companyId:
            company.id,

          cashierId,

          customerName:
            customer,

          paymentMethod,

          discount,

          paidAmount,

          cart,

        });

    console.log(
      transaction
    );

    setLastTransaction({
  invoiceNumber:
    transaction.invoiceNumber,

  transactionDate:
    new Date().toLocaleString("id-ID"),

  total: summary.total,

  paymentMethod,

  paidAmount,

  changeAmount,

  cashierName: transaction.cashierName,

  customerName: customer,
});

setPaymentOpen(false);

setSuccessOpen(true);

// reset setelah data berhasil disalin
resetTransaction();

toast.success(
  "Transaksi berhasil."
);

  } catch (error) {

    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Checkout gagal."
    );

  } finally {

    setCheckoutLoading(false);

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

useEffect(() => {

  if (!draftOpen) {
    return;
  }

  loadDrafts();

}, [
  draftOpen,
  company,
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

<Button
  variant="outline"
  className="w-full"
  onClick={() =>
    setDraftOpen(true)
  }
>
  Transaksi Tersimpan
</Button>

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

<div className="grid grid-cols-2 gap-3">

  <Button
    variant="outline"
    className="h-12"
    disabled={
      cart.length === 0
    }
    onClick={
      handleSaveDraft
    }
  >
    Simpan sebagai Draft
  </Button>

  <Button
    className="h-12"
    disabled={
      cart.length === 0
    }
    onClick={() =>
      setPaymentOpen(true)
    }
  >
    Bayar
  </Button>

</div>

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

    onConfirm={
    handleCheckout
}

loading={
        checkoutLoading
}
/>

<DraftTransactionDialog
  open={draftOpen}
  onOpenChange={
    setDraftOpen
  }
  drafts={drafts}
  loading={draftsLoading}
  onContinue={(draft) => {

    console.log(
      "Continue draft:",
      draft
    );

  }}
  onDelete={(draft) => {

    console.log(
      "Delete draft:",
      draft
    );

  }}
/>

{lastTransaction && (
  <PaymentSuccessDialog
    open={successOpen}
    onOpenChange={setSuccessOpen}
    transactionNumber={
      lastTransaction.invoiceNumber
    }
    transactionDate={
      lastTransaction.transactionDate
    }
    cashierName={lastTransaction.cashierName}
    customerName={
      lastTransaction.customerName
    }
    total={lastTransaction.total}
    paymentMethod={
      lastTransaction.paymentMethod
    }
    paidAmount={
      lastTransaction.paidAmount
    }
    changeAmount={
      lastTransaction.changeAmount
    }
    onPrintReceipt={
      handlePrintReceipt
    }
    onPrintInvoice={
      handlePrintInvoice
    }
    onNewTransaction={
      handleNewTransaction
    }
  />
)}

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