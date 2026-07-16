import { create } from "zustand";

import {
  CartItem,
  PaymentMethod,
} from "../types/transaction";

interface TransactionState {
  cart: CartItem[];

  discount: number;

  cashier: string;

  customer: string;

  paymentMethod: PaymentMethod;

  paidAmount: number;

  addItem: (item: CartItem) => void;

  removeItem: (
    productId: string,
    variantId: string
  ) => void;

  increaseQty: (
    productId: string,
    variantId: string
  ) => void;

  decreaseQty: (
    productId: string,
    variantId: string
  ) => void;

  updateQty: (
    productId: string,
    variantId: string,
    qty: number
  ) => void;

  setDiscount: (
    value: number
  ) => void;

  setCashier: (
    value: string
  ) => void;

  setCustomer: (
    value: string
  ) => void;

  setPaymentMethod: (
    value: PaymentMethod
  ) => void;

  setPaidAmount: (
    value: number
  ) => void;

  clear: () => void;
}

export const useTransactionStore =
  create<TransactionState>(
    (set) => ({
      cart: [],

      discount: 0,

      cashier: "",

      customer: "",

      paymentMethod: "cash",

      paidAmount: 0,

      addItem: (item) =>
        set((state) => {
          const existing =
            state.cart.find(
              (i) =>
                i.productId ===
                  item.productId &&
                i.variantId ===
                  item.variantId
            );

          if (existing) {
            return {
              cart: state.cart.map(
                (i) =>
                  i.productId ===
                    item.productId &&
                  i.variantId ===
                    item.variantId
                    ? {
                        ...i,
                        qty:
                          i.qty + 1,
                        subtotal:
                          (i.qty + 1) *
                          i.price,
                      }
                    : i
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              item,
            ],
          };
        }),

      removeItem: (
        productId,
        variantId
      ) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) =>
              !(
                i.productId ===
                  productId &&
                i.variantId ===
                  variantId
              )
          ),
        })),

      increaseQty: (
        productId,
        variantId
      ) =>
        set((state) => ({
          cart: state.cart.map(
            (i) =>
              i.productId ===
                productId &&
              i.variantId ===
                variantId
                ? {
                    ...i,
                    qty:
                      i.qty + 1,
                    subtotal:
                      (i.qty + 1) *
                      i.price,
                  }
                : i
          ),
        })),

      decreaseQty: (
        productId,
        variantId
      ) =>
        set((state) => ({
          cart: state.cart
            .map((i) =>
              i.productId ===
                productId &&
              i.variantId ===
                variantId
                ? {
                    ...i,
                    qty:
                      i.qty - 1,
                    subtotal:
                      (i.qty - 1) *
                      i.price,
                  }
                : i
            )
            .filter(
              (i) =>
                i.qty > 0
            ),
        })),

      updateQty: (
        productId,
        variantId,
        qty
      ) =>
        set((state) => ({
          cart: state.cart.map(
            (i) =>
              i.productId ===
                productId &&
              i.variantId ===
                variantId
                ? {
                    ...i,
                    qty,
                    subtotal:
                      qty *
                      i.price,
                  }
                : i
          ),
        })),

      setDiscount: (
        discount
      ) =>
        set({ discount }),

      setCashier: (
        cashier
      ) =>
        set({ cashier }),

      setCustomer: (
        customer
      ) =>
        set({ customer }),

      setPaymentMethod: (
        paymentMethod
      ) =>
        set({
          paymentMethod,
        }),

      setPaidAmount: (
        paidAmount
      ) =>
        set({
          paidAmount,
        }),

      clear: () =>
        set({
          cart: [],
          discount: 0,
          customer: "",
          paidAmount: 0,
        }),
    })
  );