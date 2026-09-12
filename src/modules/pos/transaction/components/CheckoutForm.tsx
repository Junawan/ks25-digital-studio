"use client";


import { Label } from "@/shared/components/ui/label";

import { useState } from "react";

import { CashierSelect } from "@/modules/pos/cashier/components/CashierSelect";
import { CashierDialog } from "@/modules/pos/cashier/components/CashierDialog";
import { Input } from "@/shared/components/ui/input";

interface Props {
  discount: number;

  dp: number;

  keterangan: string;

  companyId: string;

  cashierId: string;

  customer: string;

  onDiscountChange: (
    value: number
  ) => void;

  onDpChange: (
    value: number
  ) => void;

  onKeteranganChange: (
    value: string
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

  dp,

  keterangan,

  cashierId,

  customer,

  onDiscountChange,

  onDpChange,

  onKeteranganChange,

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

        <Label>
          Diskon (Opsional)
        </Label>

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

      {/* DP */}

      <div className="space-y-2">

        <Label>
          DP (Opsional)
        </Label>

        <Input
          type="number"
          min={0}
          value={dp || ""}
          placeholder="0"
          onChange={(e) =>
            onDpChange(
              Number(e.target.value)
            )
          }
        />

      </div>

      {/* Keterangan */}

      <div className="space-y-2">

        <Label>
          Keterangan (Opsional)
        </Label>

        <Input
          value={keterangan}
          placeholder="Keterangan transaksi"
          onChange={(e) =>
            onKeteranganChange(
              e.target.value
            )
          }
        />

      </div>

      {/* Kasir */}

      <div className="space-y-2">

        <Label>
          Kasir
        </Label>

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