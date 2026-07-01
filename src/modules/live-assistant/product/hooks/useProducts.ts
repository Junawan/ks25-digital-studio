"use client";

import { useEffect, useState } from "react";

import { Product } from "../product.types";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { getProductsUseCase } from "../../di";

export function useProducts() {
  const { workspace } = useWorkspace();

const company = workspace?.company;

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  async function load() {
    if (!company) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
  await getProductsUseCase.execute(
    company.id
  );

        console.log("PRODUCTS", data);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [company]);

  return {
  products,
  loading,
  refresh: load,
};
}