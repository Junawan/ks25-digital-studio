"use client";

import ProductModuleCard from "./ProductModuleCard";
import { dashboardProducts } from "../dashboard.data";

export default function ProductModuleGrid() {
  const readyProducts = dashboardProducts.filter((product) => product.ready);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {readyProducts.map((product) => (
        <ProductModuleCard key={product.moduleId} product={product} />
      ))}
    </div>
  );
}
