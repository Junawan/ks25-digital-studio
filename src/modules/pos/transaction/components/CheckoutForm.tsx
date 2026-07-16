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

  onDiscountChange: (
    value: number
  ) => void;

onCashierChange: (
  cashierId: string
) => void;

  onCustomerChange: (
    value: string
  ) => void;

}

export default function CheckoutForm({
    companyId,
  discount,
  cashierId,
  customer,
  onDiscountChange,
  onCashierChange,
  onCustomerChange,
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

    </div>
  );
}