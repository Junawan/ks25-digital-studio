"use client";


import { Label } from "@/shared/components/ui/label";

import { useEffect, useState } from "react";

import { CashierSelect } from "@/modules/pos/cashier/components/CashierSelect";
import { CashierDialog } from "@/modules/pos/cashier/components/CashierDialog";
import { Input } from "@/shared/components/ui/input";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/core/firebase";

interface CustomerRecord { customerId: string; name: string; phone: string; }

interface Props {
  discount: number;

  dp: number;

  keterangan: string;

  companyId: string;

  cashierId: string;

  customer: string;
  customerPhone: string;

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
  onCustomerPhoneChange: (value: string) => void;
}

export default function CheckoutForm({
  companyId,

  discount,

  dp,

  keterangan,

  cashierId,

  customer,
  customerPhone,

  onDiscountChange,

  onDpChange,

  onKeteranganChange,

  onCashierChange,

  onCustomerChange,
  onCustomerPhoneChange,
}: Props) {

  const [
    cashierDialogOpen,
    setCashierDialogOpen,
  ] = useState(false);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [manualCustomer, setManualCustomer] = useState(false);

  useEffect(() => {
    let active = true;
    getDocs(query(collection(db, "pos_customers"), where("companyId", "==", companyId)))
      .then((snapshot) => {
        if (active) setCustomers(snapshot.docs.map((item) => item.data() as CustomerRecord).sort((a, b) => a.name.localeCompare(b.name, "id")));
      })
      .catch(() => { if (active) setCustomers([]); });
    return () => { active = false; };
  }, [companyId]);

  const selectedCustomer = customers.find((item) => item.name === customer.trim() && item.phone === customerPhone.trim());

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

        <select
          value={selectedCustomer?.customerId ?? (manualCustomer || customer.trim() ? "new" : "")}
          onChange={(event) => {
            const selected = customers.find((item) => item.customerId === event.target.value);
            if (selected) {
              setManualCustomer(false);
              onCustomerChange(selected.name);
              onCustomerPhoneChange(selected.phone);
            } else if (event.target.value === "new") {
              setManualCustomer(true);
              onCustomerChange("");
              onCustomerPhoneChange("");
            } else {
              setManualCustomer(false);
              onCustomerChange("");
              onCustomerPhoneChange("");
            }
          }}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Pilih pelanggan"
        >
          <option value="">Pelanggan Umum</option>
          {customers.map((item) => <option key={item.customerId} value={item.customerId}>{item.name} · {item.phone}</option>)}
          <option value="new">Pelanggan baru / isi manual</option>
        </select>
        {(selectedCustomer === undefined && (manualCustomer || customer.trim())) && <Input
          value={customer}
          placeholder="Nama Pelanggan"
          onChange={(e) => onCustomerChange(e.target.value)}
        />}
        {customer.trim() && <p className="text-xs text-muted-foreground">No. HP wajib diisi jika nama pelanggan diisi.</p>}
        {selectedCustomer === undefined && (manualCustomer || customer.trim()) && <Input type="tel" inputMode="tel" value={customerPhone} placeholder="No. HP pelanggan" aria-label="Nomor HP pelanggan" required={Boolean(customer.trim())} onChange={(e) => onCustomerPhoneChange(e.target.value)} />}

      </div>

    </div>
  );
}
