"use client";

import ProductModuleCard from "./ProductModuleCard";
import { dashboardProducts } from "../dashboard.data";

export default function ProductModuleGrid() {
  const readyProducts = dashboardProducts.filter((product) => product.ready);

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {readyProducts.map((product) => (
        <ProductModuleCard key={product.moduleId} product={product} />
      ))}
    </div>
  );
}
