"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import ProductModuleGrid
from "@/modules/dashboard/components/ProductModuleGrid";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  useAndroidBack(() => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  App.exitApp();

  return true;
});

  return (

    <div className="space-y-10">

      <ProductModuleGrid />

    </div>

  );

}
