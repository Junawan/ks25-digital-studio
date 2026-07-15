"use client";

import { useCallback, useEffect, useState } from "react";

import { productDI } from "../di/product";

import { Product } from "../types/product";
import { toast } from "sonner";

import { useMemo } from "react";
import { ProductVariant } from "../types/product";

interface UseProductsProps {
  companyId: string;
}

export function useProducts({
  companyId,
}: UseProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!companyId) {
        setProducts([]);
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
        const data =
            await productDI.getProductsUseCase.execute(
                companyId
            );

        setProducts(data);
    } finally {
        setLoading(false);
    }
}, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const barcodeMap = useMemo(() => {

  const map = new Map<
    string,
    {
      product: Product;
      variant: ProductVariant;
    }
  >();

  for (const product of products) {

    for (const variant of product.variants) {

      if (!variant.barcode.trim()) {
        continue;
      }

      map.set(
        variant.barcode,
        {
          product,
          variant,
        }
      );

    }

    console.log("===== BARCODE MAP =====");

for (const [barcode, value] of barcodeMap.entries()) {
  console.log(
    barcode,
    value.product.name,
    value.variant.name
  );
}

  }

  return map;
  

}, [products]);

  const search = useCallback(
    async (keyword: string) => {
      if (!companyId) {
            return;
        }
      const data =
        await productDI.searchProductsUseCase.execute(
          companyId,
          keyword
        );

      setProducts(data);
    },
    [companyId]
  );

  const remove = useCallback(
    async (productId: string) => {
      await productDI.deleteProductUseCase.execute(
        productId
      );
      toast.success("Produk berhasil dihapus");

      await load();
    },
    [load]
  );

  const findByBarcode = (
  barcode: string
) => {

  return (
    barcodeMap.get(
      barcode.trim()
    ) ?? null
  );

};

  return {
    loading,

    products,

    reload: load,

    search,

    remove,

    findByBarcode,
  };
}