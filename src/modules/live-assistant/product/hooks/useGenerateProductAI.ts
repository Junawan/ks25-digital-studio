"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Product } from "../product.types";
import { productRepository } from "../product.repository";

export function useGenerateProductAI() {
  const [loading, setLoading] =
    useState(false);

  async function generate(
    product: Product
  ) {

    const toastId = toast.loading(
  "Sedang membuat AI..."
);
    try {
      setLoading(true);

      const res = await fetch(
        "/api/ai/generate-product",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: product.title,
            productInfo:
              product.productInfo,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Generate gagal"
        );
      }

      const ai = await res.json();

      await productRepository.update(
        product.productId,
        {
          teleprompterText:
            ai.teleprompterText,

          notes: ai.notes,

          faq: ai.faq,

          updatedAt: new Date(),
        }
      );
      
      toast.success(
  "AI berhasil dibuat",
  {
    id: toastId,
    description:
      "Teleprompter, Catatan Host dan FAQ berhasil dibuat.",
  }
);

      return true;
    } catch (error) {
      console.error(error);
      toast.error(
  "Generate AI gagal",
  {
    id: toastId,
  }
);

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    generate,

    loading,
  };
}