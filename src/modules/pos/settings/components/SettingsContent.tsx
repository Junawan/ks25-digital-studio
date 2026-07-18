"use client";

import { useRef } from "react";
import { toast } from "sonner";

import StoreInformationCard, {
  StoreInformationCardRef,
} from "./StoreInformationCard";

import PaymentInformationCard, {
  PaymentInformationCardRef,
} from "./PaymentInformationCard";

import ReceiptSettingsCard, {
  ReceiptSettingsCardRef,
} from "./ReceiptSettingsCard";

import SaveSettingsFooter from "./SaveSettingsFooter";

export default function SettingsContent() {
  const storeRef =
    useRef<StoreInformationCardRef>(null);

  const paymentRef =
    useRef<PaymentInformationCardRef>(null);

  const receiptRef =
    useRef<ReceiptSettingsCardRef>(null);

  async function handleSave() {
    const storeValid =
    await storeRef.current?.validate();

if (!storeValid) {

    toast.error(
        "Periksa Informasi Toko."
    );

    return;

}

const paymentValid =
    await paymentRef.current?.validate();

if (!paymentValid) {

    toast.error(
        "Periksa Informasi Pembayaran."
    );

    return;

}

const receiptValid =
    await receiptRef.current?.validate();

if (!receiptValid) {

    toast.error(
        "Periksa Pengaturan Struk."
    );

    return;

}
await storeRef.current?.save();

await paymentRef.current?.save();

await receiptRef.current?.save();

    toast.success(
      "Pengaturan berhasil disimpan."
    );
  }

  return (
    <div className="space-y-6">
      <StoreInformationCard
        ref={storeRef}
        hideSaveButton
      />

      <PaymentInformationCard
        ref={paymentRef}
        hideSaveButton
      />

      <ReceiptSettingsCard
        ref={receiptRef}
        hideSaveButton
      />

      <SaveSettingsFooter
        onSave={handleSave}
      />
    </div>
  );
}