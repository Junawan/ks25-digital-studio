"use client";

import { Button } from "@/shared/components/ui/button";

import { formatCurrency } from "@/shared/utils/currency";

import type {
  Debt,
  DebtType,
} from "../types/debt";

interface Props {
  debt: Debt | null;

  open: boolean;

  onClose: () => void;
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

function formatDate(
  date: Date
) {
  return new Date(
    date
  ).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export default function DebtDetailDialog({
  debt,
  open,
  onClose,
}: Props) {
  if (!open || !debt) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-lg
          flex-col
          rounded-xl
          bg-background
          shadow-xl
        "
      >
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            Detail Hutang
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Informasi dan riwayat
            pembayaran.
          </p>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Nama
              </p>

              <p className="font-semibold">
                {debt.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Jenis
                </p>

                <p className="font-medium">
                  {getDebtTypeLabel(
                    debt.type
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Tanggal
                </p>

                <p className="font-medium">
                  {formatDate(
                    debt.date
                  )}
                </p>
              </div>
            </div>

            {debt.note && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Catatan
                </p>

                <p className="mt-1">
                  {debt.note}
                </p>
              </div>
            )}

            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Hutang
                </p>

                <p className="mt-1 font-semibold">
                  {formatCurrency(
                    debt.amount
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Sudah Dibayar
                </p>

                <p className="mt-1 font-semibold">
                  {formatCurrency(
                    debt.totalPaid
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Sisa
                </p>

                <p className="mt-1 font-bold">
                  {formatCurrency(
                    debt.remainingAmount
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold">
              Riwayat Pembayaran
            </h3>

            {debt.payments.length ===
            0 ? (
              <div className="mt-3 rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                Belum ada pembayaran.
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {debt.payments.map(
                  (payment, index) => (
                    <div
                      key={
                        payment.paymentId
                      }
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            Pembayaran{" "}
                            {index + 1}
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(
                              payment.paidAt
                            )}
                          </p>
                        </div>

                        <p className="font-semibold whitespace-nowrap">
                          {formatCurrency(
                            payment.amount
                          )}
                        </p>
                      </div>

                      {payment.note && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {payment.note}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}