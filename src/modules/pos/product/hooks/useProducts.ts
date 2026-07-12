"use client";

import { useCallback, useEffect, useState } from "react";

import { productDI } from "../di/product";

import { Product } from "../types/product";
import { toast } from "sonner";

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

  return {
    loading,

    products,

    reload: load,

    search,

    remove,
  };
}