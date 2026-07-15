"use client";

import MobileHeader from "@/shared/components/mobile/MobileHeader";

import ScannerPage
from "@/modules/pos/shared/scanner/pages/ScannerPage";

export default function Page() {

  return (
    <>
      <MobileHeader
        title="Scanner"
      />

      <ScannerPage />

    </>
  );

}