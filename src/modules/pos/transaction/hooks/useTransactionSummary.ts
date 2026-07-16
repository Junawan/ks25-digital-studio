import { useMemo } from "react";

import { useTransactionStore } from "../stores/useTransactionStore";

export function useTransactionSummary() {
  const {
    cart,
    discount,
    paidAmount,
  } = useTransactionStore();

  return useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const total = Math.max(
      0,
      subtotal - discount
    );

    const changeAmount = Math.max(
      0,
      paidAmount - total
    );

    const totalItems = cart.length;

    const totalQty = cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    return {
      cart,
      subtotal,
      discount,
      total,
      paidAmount,
      changeAmount,
      totalItems,
      totalQty,
    };
  }, [
    cart,
    discount,
    paidAmount,
  ]);
}