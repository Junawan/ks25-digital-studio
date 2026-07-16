"use client";

import { useMemo, useState } from "react";

import {
  Product,
  ProductVariant,
} from "@/modules/pos/product/types/product";

import {
  CartItem,
  PaymentMethod,
  TransactionSummary,
} from "../types/transaction";

export function useTransaction() {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [discount, setDiscount] =
    useState(0);

  const [cashierId, setCashierId] =
    useState("");

  const [customer, setCustomer] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cash"
    );

  const [paidAmount, setPaidAmount] =
    useState(0);

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

  function increaseQty(
  variantId: string
) {
  setCart((current) =>
    current.map((item) => {
      if (
        item.variantId !==
        variantId
      ) {
        return item;
      }

      const qty =
        item.qty + 1;

      return {
        ...item,
        qty,
        subtotal:
          qty * item.price,
      };
    })
  );
}

function decreaseQty(
  variantId: string
) {
  setCart((current) =>
    current
      .map((item) => {
        if (
          item.variantId !==
          variantId
        ) {
          return item;
        }

        const qty =
          item.qty - 1;

        return {
          ...item,
          qty,
          subtotal:
            qty * item.price,
        };
      })
      .filter(
        (item) => item.qty > 0
      )
  );
}

function updateQty(
  variantId: string,
  qty: number
) {
  const value =
    Math.max(
      0,
      Math.floor(qty)
    );

  setCart((current) =>
    current
      .map((item) => {
        if (
          item.variantId !==
          variantId
        ) {
          return item;
        }

        return {
          ...item,
          qty: value,
          subtotal:
            value * item.price,
        };
      })
      .filter(
        (item) => item.qty > 0
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

      const total =
        Math.max(
          0,
          subtotal - discount
        );

      return {
        subtotal,

        discount,

        total,
      };
    }, [
      cart,
      discount,
    ]);

  const changeAmount =
    Math.max(
      0,
      paidAmount -
        summary.total
    );

    function resetTransaction() {
  setCart([]);

  setDiscount(0);

  setCustomer("");

  setPaidAmount(0);

  setPaymentMethod("cash");
}

  return {
  cart,

  discount,

  cashierId,

  customer,

  paymentMethod,

  paidAmount,

  changeAmount,

  addVariant,

  removeItem,

  increaseQty,

  decreaseQty,

  updateQty,

  setDiscount,

  setCashierId,

  setCustomer,

  setPaymentMethod,

  setPaidAmount,

  summary,

  resetTransaction,
};
}