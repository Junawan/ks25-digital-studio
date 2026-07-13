"use client";

import ScannerPage from "@/modules/pos/shared/scanner/pages/ScannerPage";
import MobileHeader from "@/shared/components/mobile/MobileHeader";



export default function Page() {
  return (
    <>
      <MobileHeader title="Scanner" />

      <ScannerPage />
    </>
  );
}