"use client";

import { useMemo, useState } from "react";

import {
  CartItem,
  TransactionSummary,
} from "../types/transaction";

export function useTransaction() {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const summary =
    useMemo<TransactionSummary>(() => {

      const subtotal =
        cart.reduce(
          (sum, item) =>
            sum + item.subtotal,
          0
        );

      const discount = 0;

      return {
        subtotal,
        discount,
        total:
          subtotal - discount,
      };

    }, [cart]);

  return {
    cart,

    setCart,

    summary,
  };
}