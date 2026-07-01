"use client";

import { useState } from "react";
import { Product } from "../product.types";
import { createProductUseCase, updateProductUseCase } from "../../di";
import { ProductFormData } from "../product-form";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";



export function useSaveProduct() {
  const { workspace } = useWorkspace();

const company = workspace?.company;
  
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function save(
    data: ProductFormData,
    product?: Product
  ): Promise<boolean> {

    if (!company) {
  setError("Company tidak ditemukan");
  return false;
}

    try {

      setLoading(true);

      setError(null);

      if (product) {

        await updateProductUseCase.execute({
  productId: product.productId,

  title: data.title,

  image: data.image,

  productInfo: data.productInfo,

  notes: product.notes ?? "",

  teleprompterText:
    product.teleprompterText ?? "",

  active: product.active,
});

      } else {

        await createProductUseCase.execute({
          companyId: company.id,

          title: data.title,

          image: data.image,

          productInfo: data.productInfo,
          
        });

      }

      return true;

    } catch (err) {

      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      }

      return false;

    } finally {

      setLoading(false);

    }
  }

  return {
    save,
    loading,
    error,
  };
}