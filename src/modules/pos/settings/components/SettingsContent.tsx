"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { savePosSettingsUseCase } from "../di";

export default function SettingsContent() {
  const storeRef =
    useRef<StoreInformationCardRef>(null);

  const paymentRef =
    useRef<PaymentInformationCardRef>(null);

  const receiptRef =
    useRef<ReceiptSettingsCardRef>(null);

  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
  const valid = await Promise.all([
    storeRef.current?.validate() ?? true,
    paymentRef.current?.validate() ?? true,
    receiptRef.current?.validate() ?? true,
  ]);

  if (valid.includes(false)) {
    toast.error("Masih ada data yang belum valid.");
    return;
  }

  const store = storeRef.current;
  const payment = paymentRef.current;
  const receipt = receiptRef.current;

  if (!store || !payment || !receipt) {
    return;
  }

  const settings = store.getSettings();

  if (!settings) {
    toast.error("Pengaturan belum dimuat.");
    return;
  }

  const updated = {
    ...settings,

    ...store.getValues(),

    ...payment.getValues(),

    ...receipt.getValues(),

    updatedAt: new Date(),
  };

  try {
    setSaving(true);

    await savePosSettingsUseCase.execute(updated);

    toast.success("Pengaturan berhasil disimpan.");
  } finally {
    setSaving(false);
  }
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

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Menyimpan..."
            : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}