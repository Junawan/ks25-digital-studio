"use client";

import { useState } from "react";

import { productDI } from "../di/product";
import { toast } from "sonner";

interface Props {
  companyId: string;

  onSuccess?: () => void;
}

export function useProductExport({
  companyId,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  async function exportProducts() {
  setLoading(true);

  try {
    const total =
      await productDI.exportProductsUseCase.execute(
        companyId
      );

    toast.success("Export berhasil", {
      description: `${total} produk berhasil diexport.`,
    });

    onSuccess?.();

    return total;
  } catch (error) {
    toast.error("Export gagal", {
      description:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan.",
    });

    throw error;
  } finally {
    setLoading(false);
  }
}

  return {
    loading,

    exportProducts,
  };
}