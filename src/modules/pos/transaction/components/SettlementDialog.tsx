"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import {
  PaymentMethod,
  Transaction,
} from "../types/transaction";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  transaction: Transaction | null;

  onConfirm: (
    paymentMethod: PaymentMethod,
    paidAmount: number
  ) => Promise<void>;

  loading: boolean;
}

export default function SettlementDialog({
  open,
  onOpenChange,
  transaction,
  onConfirm,
  loading,
}: Props) {

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>("cash");

  const [
    paidAmount,
    setPaidAmount,
  ] = useState(0);

  /*
   * Ketika transaksi berubah,
   * otomatis isi nominal dengan
   * sisa pembayaran.
   */
  useEffect(() => {

    if (!transaction) {
      setPaidAmount(0);
      return;
    }

    setPaidAmount(
      transaction.remainingAmount
    );

    setPaymentMethod("cash");

  }, [
    transaction,
    open,
  ]);

  if (!transaction) {
    return null;
  }

  const remainingAmount =
    Math.max(
      0,
      transaction.remainingAmount
    );

  const changeAmount =
    paymentMethod === "cash"
      ? Math.max(
          0,
          paidAmount -
            remainingAmount
        )
      : 0;

  const paymentIsEnough =
    paidAmount >=
    remainingAmount;

  async function handleConfirm() {

    if (
      !paymentIsEnough
    ) {
      return;
    }

    await onConfirm(
      paymentMethod,
      paidAmount
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent className="max-w-md">

        <DialogHeader>

          <DialogTitle>
            Pelunasan Transaksi
          </DialogTitle>

          <DialogDescription>
            Selesaikan sisa pembayaran
            transaksi ini.
          </DialogDescription>

        </DialogHeader>


        <div className="space-y-4">

          {/* INFORMASI TRANSAKSI */}

          <div className="rounded-lg border bg-muted p-4 space-y-2">

            <div className="flex justify-between gap-4 text-sm">

              <span className="text-muted-foreground">
                Invoice
              </span>

              <span className="font-medium">
                {transaction.invoiceNumber}
              </span>

            </div>


            <div className="flex justify-between gap-4 text-sm">

              <span className="text-muted-foreground">
                Total
              </span>

              <span>
                Rp{" "}
                {transaction.total.toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>


            <div className="flex justify-between gap-4 text-sm">

              <span className="text-muted-foreground">
                DP
              </span>

              <span>
                Rp{" "}
                {transaction.dp.toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>


            <div className="flex justify-between gap-4 text-sm">

              <span className="text-muted-foreground">
                Sudah Dibayar
              </span>

              <span>
                Rp{" "}
                {transaction.paidAmount.toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>


            <div className="flex justify-between gap-4 border-t pt-2 font-bold">

              <span>
                Sisa Pembayaran
              </span>

              <span>
                Rp{" "}
                {remainingAmount.toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>

          </div>


          {/* METODE PEMBAYARAN */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Metode Pembayaran
            </label>

            <div className="grid grid-cols-2 gap-2">

              <Button
                type="button"
                variant={
                  paymentMethod ===
                  "cash"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setPaymentMethod(
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
                  setPaymentMethod(
                    "qris_static"
                  )
                }
              >
                QRIS
              </Button>

            </div>

          </div>


          {/* PEMBAYARAN */}

          <div className="space-y-2">

            <label className="text-sm font-medium">

              Pembayaran Pelunasan

            </label>

            <input
              type="number"
              min={0}
              value={
                paidAmount || ""
              }
              onChange={(event) =>
                setPaidAmount(
                  Number(
                    event.target.value
                  )
                )
              }
              className="
                h-11
                w-full
                rounded-md
                border
                px-3
              "
            />

            <p className="text-xs text-muted-foreground">

              Masukkan nominal pembayaran
              pelunasan. Nilai awal
              otomatis diisi sesuai
              sisa pembayaran.

            </p>

          </div>


          {/* KEMBALIAN */}

          {paymentMethod ===
            "cash" && (

            <div className="flex justify-between rounded-md border bg-muted p-3">

              <span>
                Kembalian
              </span>

              <span className="font-bold">
                Rp{" "}
                {changeAmount.toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>

          )}


          {/* QRIS */}

          {paymentMethod ===
            "qris_static" && (

            <div className="rounded-lg border border-dashed p-4 text-center">

              <p className="font-medium">
                Pembayaran QRIS
              </p>

              <p className="mt-1 text-sm text-muted-foreground">

                Pastikan pelanggan
                membayar sebesar{" "}

                <span className="font-medium text-foreground">

                  Rp{" "}
                  {remainingAmount.toLocaleString(
                    "id-ID"
                  )}

                </span>

                {" "}sebelum menekan
                tombol Lunasi.

              </p>

            </div>

          )}

        </div>


        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Batal
          </Button>


          <Button
            type="button"
            disabled={
              loading ||
              !paymentIsEnough
            }
            onClick={() => {
              void handleConfirm();
            }}
          >

            {loading
              ? "Memproses..."
              : "Lunasi"}

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}