"use client";

import ProductModuleCard from "./ProductModuleCard";

import {
  dashboardProducts,
  DashboardProduct,
} from "../dashboard.data";

interface CategorySectionProps {
  title: string;
  emoji: string;
  products: DashboardProduct[];
}

function CategorySection({
  title,
  emoji,
  products,
}: CategorySectionProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-5">

      <div className="flex items-center gap-2">

        <span className="text-2xl">
          {emoji}
        </span>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

      </div>

      <div
        className="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        "
      >

        {products.map((product) => (

          <ProductModuleCard
            key={product.moduleId}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default function ProductModuleGrid() {

  const sales =
    dashboardProducts.filter(
      (p) => p.category === "sales"
    );

  const business =
    dashboardProducts.filter(
      (p) => p.category === "business"
    );

  const fulfillment =
    dashboardProducts.filter(
      (p) => p.category === "fulfillment"
    );

  const creative =
    dashboardProducts.filter(
      (p) => p.category === "creative"
    );

  return (

    <div className="space-y-12">

      <CategorySection
        title="Sales"
        emoji="🚀"
        products={sales}
      />

      <CategorySection
        title="Business"
        emoji="💼"
        products={business}
      />

      <CategorySection
        title="Fulfillment"
        emoji="📦"
        products={fulfillment}
      />

      <CategorySection
        title="Creative"
        emoji="🎉"
        products={creative}
      />

    </div>

  );

}