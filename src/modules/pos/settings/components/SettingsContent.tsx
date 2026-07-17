"use client";

import StoreInformationCard from "./StoreInformationCard";
import PaymentInformationCard from "./PaymentInformationCard";
import ReceiptSettingsCard from "./ReceiptSettingsCard";

export default function SettingsContent() {
  return (
    <div className="space-y-6">
      <StoreInformationCard />

      <PaymentInformationCard />

      <ReceiptSettingsCard />
    </div>
  );
}