"use client";

import { useMemo, useState } from "react";

import {
  Product,
  ProductVariant,
} from "@/modules/pos/product/types/product";

import {
  CartItem,
  TransactionSummary,
} from "../types/transaction";

export function useTransaction() {

  const [cart, setCart] =
    useState<CartItem[]>([]);

  function addVariant(
  product: Product,
  variant: ProductVariant
) {
  setCart((current) => {

    const index =
      current.findIndex(
        (item) =>
          item.variantId ===
          variant.variantId
      );

    if (index >= 0) {

      const copy = [...current];

      copy[index] = {
        ...copy[index],
        qty:
          copy[index].qty + 1,
        subtotal:
          (copy[index].qty + 1) *
          copy[index].price,
      };

      return copy;

    }

    return [
      ...current,
      {
        productId:
          product.productId,

        variantId:
          variant.variantId,

        productName:
          product.name,

        variantName:
          variant.name,

        barcode:
          variant.barcode,

        price:
          variant.price,

        qty: 1,

        subtotal:
          variant.price,
      },
    ];

  });
}

  function removeItem(
    variantId: string
  ) {

    setCart((current) =>
      current.filter(
        (item) =>
          item.variantId !==
          variantId
      )
    );

  }

  const summary =
    useMemo<TransactionSummary>(() => {

      const subtotal =
        cart.reduce(
          (sum, item) =>
            sum +
            item.subtotal,
          0
        );

      return {

        subtotal,

        discount: 0,

        total: subtotal,

      };

    }, [cart]);

  return {

    cart,

    addVariant,

    removeItem,

    summary,

  };

}