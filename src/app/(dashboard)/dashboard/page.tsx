"use client";

import DashboardHero
from "@/modules/dashboard/components/DashboardHero";

import ProductModuleGrid
from "@/modules/dashboard/components/ProductModuleGrid";

import UpgradeBanner
from "@/modules/dashboard/components/UpgradeBanner";

export default function DashboardPage() {

  return (

    <div className="space-y-10">

      <DashboardHero />

      <ProductModuleGrid />

      <UpgradeBanner />

    </div>

  );

}