"use client";

import { useAndroidBack } from "@/hooks/useAndroidBack";
import DashboardHero
from "@/modules/dashboard/components/DashboardHero";

import ProductModuleGrid
from "@/modules/dashboard/components/ProductModuleGrid";

import UpgradeBanner
from "@/modules/dashboard/components/UpgradeBanner";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useAndroidBack(() => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  App.exitApp();

  return true;
});

  return (

    <div className="space-y-10">

      <DashboardHero />

      <ProductModuleGrid />

      <UpgradeBanner />

    </div>

  );

}