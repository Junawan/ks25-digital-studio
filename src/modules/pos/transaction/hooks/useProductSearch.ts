"use client";

import { useMemo } from "react";

import { Product } from "@/modules/pos/product/types/product";

interface Props {
  keyword: string;
  products: Product[];
}

export function useProductSearch({
  keyword,
  products,
}: Props) {
  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) {
      return [];
    }

    return products.filter((product) => {
      if (
        product.name
          .toLowerCase()
          .includes(q)
      ) {
        return true;
      }

      return product.variants.some(
        (variant) =>
          variant.name
            .toLowerCase()
            .includes(q) ||
          variant.barcode
            .toLowerCase()
            .includes(q)
      );
    });
  }, [keyword, products]);

  return results;
}