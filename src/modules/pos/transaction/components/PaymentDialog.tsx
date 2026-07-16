"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import { PaymentMethod } from "../types/transaction";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  total: number;

  paymentMethod: PaymentMethod;

  paidAmount: number;

  changeAmount: number;

  staticQrisUrl?: string;

  onPaymentMethodChange: (
    value: PaymentMethod
  ) => void;

  onPaidAmountChange: (
    value: number
  ) => void;

  onConfirm: () => Promise<void>;

  loading: boolean;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  total,
  paymentMethod,
  paidAmount,
  changeAmount,
  loading,
  staticQrisUrl,
  onPaymentMethodChange,
  onPaidAmountChange,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Pembayaran
          </DialogTitle>

          <DialogDescription>
            Pilih metode pembayaran.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total Pembayaran
            </p>

            <p className="mt-1 text-3xl font-bold">
              Rp{" "}
              {total.toLocaleString(
                "id-ID"
              )}
            </p>
          </div>

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
              variant="outline"
              disabled
            >
              QRIS API
            </Button>
          </div>

          {paymentMethod ===
            "cash" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Uang Diterima
              </label>

              <input
                type="number"
                value={
                  paidAmount || ""
                }
                onChange={(e) =>
                  onPaidAmountChange(
                    Number(
                      e.target.value
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
            </div>
          )}

          {paymentMethod ===
            "qris_static" && (
            <div className="space-y-4 text-center">
              {staticQrisUrl ? (
                <Image
                  src={staticQrisUrl}
                  alt="QRIS"
                  width={220}
                  height={220}
                  className="mx-auto rounded-lg border"
                />
              ) : (
                <div className="rounded-lg border border-dashed p-8">
                  QRIS belum
                  dikonfigurasi.
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Silakan scan QRIS
                di atas lalu tekan
                tombol di bawah
                setelah pembayaran
                diterima.
              </p>
            </div>
          )}

          {paymentMethod ===
            "qris_dynamic" && (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-lg">
                🚧
              </p>

              <p className="font-medium">
                QRIS Dinamis
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Dalam
                pengembangan.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Midtrans • DOKU
                • Xendit •
                Tripay
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Batal
          </Button>

          <Button
  disabled={loading}
  onClick={() => {
    void onConfirm();
  }}
>
  {loading
    ? "Memproses..."
    : paymentMethod === "cash"
      ? "Bayar"
      : paymentMethod ===
          "qris_static"
        ? "Saya Sudah Menerima Pembayaran"
        : "Tutup"}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}