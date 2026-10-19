"use client";

import { useCallback, useMemo, useState } from "react";

import {
  Product,
  ProductVariant,
} from "@/modules/pos/product/types/product";

import {
  CartItem,
  PaymentMethod,
  TransactionSummary,
} from "../types/transaction";
import { DraftTransaction } from "../types/draftTransaction";

export function useTransaction() {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [discount, setDiscount] =
    useState(0);

    const [dp, setDp] =
  useState(0);

const [keterangan, setKeterangan] =
  useState("");

  const [cashierId, setCashierId] =
    useState("");

  const [customer, setCustomer] =
    useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cash"
    );

  const [paidAmount, setPaidAmount] =
    useState(0);

  const addCartItems = useCallback((items: CartItem[]) => {
    setCart((current) => {
      const merged = [...current];
      for (const incoming of items) {
        const index = merged.findIndex((item) => item.variantId === incoming.variantId);
        if (index >= 0) {
          const qty = merged[index].qty + incoming.qty;
          merged[index] = { ...merged[index], qty, subtotal: qty * merged[index].price };
        } else {
          merged.push({ ...incoming });
        }
      }
      return merged;
    });
  }, []);

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

          hsCode:
            product.hsCode ?? "",

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

function updatePrice(
  variantId: string,
  price: number
) {
  const value = Math.max(
    0,
    Math.floor(price)
  );

  setCart((current) =>
    current.map((item) => {

      if (
        item.variantId !==
        variantId
      ) {
        return item;
      }

      return {
        ...item,

        price: value,

        subtotal:
          value * item.qty,
      };

    })
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

  const paymentTarget =
  dp > 0
    ? dp
    : summary.total;

const changeAmount =
  Math.max(
    0,
    paidAmount - paymentTarget
  );

    function resetTransaction() {
  setCart([]);

  setDiscount(0);

  setDp(0);

  setKeterangan("");

  setCustomer("");
  setCustomerPhone("");

  setPaidAmount(0);

  setPaymentMethod("cash");
}

function createDraftData(
  companyId: string
): DraftTransaction {
  return {
    draftId: crypto.randomUUID(),

    companyId,

    cashierId,

    customer,
      customerPhone,

    paymentMethod,

    paidAmount,

    discount,

    dp,

    keterangan,

    cart: [...cart],

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}

function loadDraft(
  draft: DraftTransaction
) {
  setCart(
    draft.cart.map((item) => ({
      ...item,
    }))
  );

  setDiscount(
    draft.discount
  );

  setDp(
    draft.dp ?? 0
  );

  setKeterangan(
    draft.keterangan ?? ""
  );

  setCustomer(
    draft.customer
  );
  setCustomerPhone(draft.customerPhone ?? "");

  setPaidAmount(
    draft.paidAmount
  );

  setPaymentMethod(
    draft.paymentMethod
  );

  setCashierId(
    draft.cashierId
  );
}

  return {
  cart,

  discount,

  dp,

  keterangan,

  cashierId,

  customer,
  customerPhone,

  paymentMethod,

  paidAmount,

  changeAmount,

  addVariant,

  addCartItems,

  removeItem,

  increaseQty,

  decreaseQty,

  updateQty,

  updatePrice,

  setDiscount,

  setDp,

  setKeterangan,

  setCashierId,

  setCustomer,
  setCustomerPhone,

  setPaymentMethod,

  setPaidAmount,

  summary,

  resetTransaction,

  createDraftData,

  loadDraft,
};
}
