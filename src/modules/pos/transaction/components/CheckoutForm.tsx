"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { PaymentMethod } from "../types/transaction";

import { useState } from "react";

import { CashierSelect } from "@/modules/pos/cashier/components/CashierSelect";
import { CashierDialog } from "@/modules/pos/cashier/components/CashierDialog";

interface Props {
  discount: number;

  companyId: string;

    cashierId: string;

  customer: string;

  paymentMethod: PaymentMethod;

  paidAmount: number;

  changeAmount: number;

  onDiscountChange: (
    value: number
  ) => void;

onCashierChange: (
  cashierId: string
) => void;

  onCustomerChange: (
    value: string
  ) => void;

  onPaymentMethodChange: (
    value: PaymentMethod
  ) => void;

  onPaidAmountChange: (
    value: number
  ) => void;
}

export default function CheckoutForm({
    companyId,
  discount,
  cashierId,
  customer,
  paymentMethod,
  paidAmount,
  changeAmount,
  onDiscountChange,
  onCashierChange,
  onCustomerChange,
  onPaymentMethodChange,
  onPaidAmountChange,
}: Props) {

    const [
  cashierDialogOpen,
  setCashierDialogOpen,
] = useState(false);
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-6">
      {/* Diskon */}

      <div className="space-y-2">
        <Label>Diskon (Opsional)</Label>

        <Input
          type="number"
          min={0}
          value={discount || ""}
          placeholder="0"
          onChange={(e) =>
            onDiscountChange(
              Number(e.target.value)
            )
          }
        />
      </div>

      {/* Kasir */}

      <div className="space-y-2">
  <Label>Kasir</Label>

  <CashierSelect
    companyId={companyId}
    value={cashierId}
    onChange={onCashierChange}
    onCreate={() =>
      setCashierDialogOpen(true)
    }
  />

  <CashierDialog
    companyId={companyId}
    open={cashierDialogOpen}
    onOpenChange={
      setCashierDialogOpen
    }
    onCreated={onCashierChange}
  />
</div>

      {/* Pelanggan */}

      <div className="space-y-2">
        <Label>
          Pelanggan (Opsional)
        </Label>

        <Input
          value={customer}
          placeholder="Nama Pelanggan"
          onChange={(e) =>
            onCustomerChange(
              e.target.value
            )
          }
        />
      </div>

      {/* Pembayaran */}

      <div className="space-y-3">
        <Label>
          Metode Pembayaran
        </Label>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={
              paymentMethod === "cash"
                ? "default"
                : "outline"
            }
            onClick={() =>
              onPaymentMethodChange(
                "cash"
              )
            }
          >
            Cash
          </Button>

          <Button
            type="button"
            variant={
              paymentMethod ===
              "qris_static"
                ? "default"
                : "outline"
            }
            onClick={() =>
              onPaymentMethodChange(
                "qris_static"
              )
            }
          >
            QRIS
          </Button>

          <Button
            type="button"
            variant={
              paymentMethod ===
              "qris_dynamic"
                ? "default"
                : "outline"
            }
            onClick={() =>
              onPaymentMethodChange(
                "qris_dynamic"
              )
            }
          >
            QRIS API
          </Button>
        </div>
      </div>

      {/* Cash */}

      {paymentMethod === "cash" && (
        <>
          <div className="space-y-2">
            <Label>
              Uang Diterima
            </Label>

            <Input
              type="number"
              min={0}
              value={
                paidAmount || ""
              }
              placeholder="0"
              onChange={(e) =>
                onPaidAmountChange(
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted p-4">
            <span className="text-muted-foreground">
              Kembalian
            </span>

            <span className="text-lg font-bold">
              Rp{" "}
              {changeAmount.toLocaleString(
                "id-ID"
              )}
            </span>
          </div>
        </>
      )}

      {/* QRIS Statis */}

      {paymentMethod ===
        "qris_static" && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            QRIS Statis akan
            ditampilkan di sini.
          </p>
        </div>
      )}

      {/* QRIS Dinamis */}

      {paymentMethod ===
        "qris_dynamic" && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            QRIS Dinamis akan
            tersedia setelah API
            Midtrans / DOKU /
            Xendit dikonfigurasi.
          </p>
        </div>
      )}
    </div>
  );
}