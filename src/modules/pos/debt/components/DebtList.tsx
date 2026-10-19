"use client";

import {
  CreditCard,
  Eye,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { formatCurrency } from "@/shared/utils/currency";

import type {
  Debt,
  DebtType,
} from "../types/debt";

interface Props {
  debts: Debt[];

  loading?: boolean;

  onPay: (
    debt: Debt
  ) => void;

  onDetail: (
    debt: Debt
  ) => void;

  onDelete: (
    debt: Debt
  ) => void;
  onDebtorTypeChange: (debtId: string, type: "employee" | "customer") => void;
}

function getDebtTypeLabel(
  type: DebtType
) {
  switch (type) {
    case "kasbon":
      return "Kasbon";

    case "payment_shortage":
      return "Kekurangan Pembayaran";

    case "other":
      return "Lainnya";

    default:
      return type;
  }
}

export default function DebtList({
  debts,
  loading = false,
  onPay,
  onDetail,
  onDelete,
  onDebtorTypeChange,
}: Props) {
  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Memuat data hutang...
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm font-medium">
          Belum ada data
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Data hutang akan tampil di sini.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="w-12 px-2 py-3">
                No
              </th>

              <th className="px-2 py-3">
                Nama
              </th>

              <th className="px-2 py-3">
                Jenis
              </th>

              <th className="px-2 py-3">Debitur</th>

              <th className="px-2 py-3 text-right">
                Sisa
              </th>

              <th className="px-2 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {debts.map(
              (debt, index) => (
                <tr
                  key={debt.debtId}
                  className="border-b last:border-0"
                >
                  <td className="px-2 py-4">
                    {index + 1}
                  </td>

                  <td className="px-2 py-4 font-medium">
                    {debt.name}
                    {debt.source === "transaction" && <div className="mt-1 text-xs font-normal text-muted-foreground">{debt.invoiceNumber}{debt.phone ? ` · ${debt.phone}` : ""}</div>}
                  </td>

                  <td className="px-2 py-4">
                    {debt.source === "transaction" ? "Sisa Transaksi" : getDebtTypeLabel(debt.type)}
                  </td>

                  <td className="px-2 py-4">
                    {debt.source === "transaction" ? "Pelanggan" : debt.debtorType ? (debt.debtorType === "employee" ? "Karyawan" : "Pelanggan") : <select aria-label={`Jenis debitur ${debt.name}`} value="legacy" onChange={(event) => onDebtorTypeChange(debt.debtId, event.target.value as "employee" | "customer")} className="h-9 rounded-md border border-input bg-background px-2 text-sm"><option value="legacy" disabled>Data lama</option><option value="employee">Karyawan</option><option value="customer">Pelanggan</option></select>}
                  </td>

                  <td className="px-2 py-4 text-right font-medium whitespace-nowrap">
                    {formatCurrency(
                      debt.remainingAmount
                    )}
                  </td>

                  <td className="px-2 py-4">
                    <div className="flex justify-end gap-2">
                      {debt.status === "unpaid" && <Button
                        size="sm"
                        onClick={() =>
                          onPay(debt)
                        }
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Bayar
                      </Button>}

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          onDetail(debt)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detail
                      </Button>

                      {debt.source !== "transaction" && <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          onDelete(debt)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="space-y-3 md:hidden">
        {debts.map(
          (debt) => (
            <div
              key={debt.debtId}
              className="rounded-lg border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {debt.name}
                  </p>
                  {debt.source === "transaction" && <p className="mt-1 text-xs text-muted-foreground">{debt.invoiceNumber}{debt.phone ? ` · ${debt.phone}` : ""}</p>}

                  <p className="mt-1 text-sm text-muted-foreground">
                    {debt.source === "transaction" ? "Sisa Transaksi" : getDebtTypeLabel(debt.type)}
                  </p>
                  {debt.source === "transaction" ? <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Pelanggan</span> : debt.debtorType ? <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-1 text-xs">{debt.debtorType === "employee" ? "Karyawan" : "Pelanggan"}</span> : <select aria-label={`Jenis debitur ${debt.name}`} value="legacy" onChange={(event) => onDebtorTypeChange(debt.debtId, event.target.value as "employee" | "customer")} className="mt-2 h-8 rounded-md border border-input bg-background px-2 text-xs"><option value="legacy" disabled>Data lama</option><option value="employee">Karyawan</option><option value="customer">Pelanggan</option></select>}
                </div>

                <span
                  className="
                    rounded-full
                    bg-muted
                    px-2
                    py-1
                    text-xs
                    font-medium
                  "
                >
                  {debt.status === "paid"
                    ? "Lunas"
                    : "Belum Lunas"}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Sisa
                </p>

                <p className="text-lg font-bold">
                  {formatCurrency(
                    debt.remainingAmount
                  )}
                </p>
              </div>

              <div className={`mt-4 grid gap-2 ${debt.source === "transaction" ? "grid-cols-2" : "grid-cols-3"}`}>
                {debt.status === "unpaid" && <Button
                  size="sm"
                  onClick={() =>
                    onPay(debt)
                  }
                >
                  Bayar
                </Button>}

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    onDetail(debt)
                  }
                >
                  Detail
                </Button>

                {debt.source !== "transaction" && <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    onDelete(debt)
                  }
                >
                  Hapus
                </Button>}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
