"use client";

import { Product } from "@/modules/pos/product/types/product";

interface Props {
  products: Product[];

  onSelect: (
    product: Product
  ) => void;
}

export default function SearchResult({
  products,
  onSelect,
}: Props) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="
      overflow-hidden
      rounded-xl
      border
      bg-card
      shadow-sm
      "
    >
      {products.map((product) => (
        <button
          key={product.productId}
          type="button"
          onClick={() =>
            onSelect(product)
          }
          className="
          flex
          w-full
          items-center
          justify-between
          border-b
          p-4
          text-left
          transition
          hover:bg-muted
          last:border-b-0
          "
        >
          <div>

            <p className="font-medium">

              {product.name}

            </p>

            <p
              className="
              text-sm
              text-muted-foreground
              "
            >
              {product.variants.length}
              {" "}
              varian
            </p>

          </div>

          <span
            className="
            text-sm
            text-muted-foreground
            "
          >
            Rp{" "}
            {product.variants[0]?.price.toLocaleString(
              "id-ID"
            )}
          </span>

        </button>
      ))}
    </div>
  );
}