"use client";

import {
  CheckCircle2,
  FileText,
  Plus,
  Printer,
  X,
} from "lucide-react";

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

  transactionNumber: string;

  transactionDate: string;

  cashierName: string;

  customerName?: string;

  total: number;

  paymentMethod: PaymentMethod;

  paidAmount: number;

  changeAmount: number;

  onPrintReceipt: () => void;

  onPrintInvoice: () => void;

  onNewTransaction: () => void;
}

export default function PaymentSuccessDialog({
  open,
  onOpenChange,
  transactionNumber,
  transactionDate,
  cashierName,
  customerName,
  total,
  paymentMethod,
  paidAmount,
  changeAmount,
  onPrintReceipt,
  onPrintInvoice,
  onNewTransaction,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>

          <DialogTitle className="text-center text-2xl">
            Pembayaran Berhasil
          </DialogTitle>

          <DialogDescription className="text-center">
            Transaksi berhasil disimpan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">

          <div className="rounded-lg border">

            <div className="flex justify-between border-b p-3">
              <span>No. Transaksi</span>

              <span className="font-medium">
                {transactionNumber}
              </span>
            </div>

            <div className="flex justify-between border-b p-3">
              <span>Tanggal</span>

              <span>
                {transactionDate}
              </span>
            </div>

            <div className="flex justify-between border-b p-3">
              <span>Kasir</span>

              <span>
                {cashierName}
              </span>
            </div>

            <div className="flex justify-between p-3">
              <span>Pelanggan</span>

              <span>
                {customerName || "Umum"}
              </span>
            </div>

          </div>

          <div className="rounded-lg border">

            <div className="flex justify-between border-b p-3">
              <span>Total</span>

              <span className="font-bold">
                Rp{" "}
                {total.toLocaleString(
                  "id-ID"
                )}
              </span>
            </div>

            <div className="flex justify-between p-3">
              <span>Metode</span>

              <span>
                {paymentMethod ===
                "cash"
                  ? "Cash"
                  : paymentMethod ===
                      "qris_static"
                    ? "QRIS"
                    : "QRIS API"}
              </span>
            </div>

                      {paymentMethod === "cash" && (
            <div className="rounded-lg border">

              <div className="flex justify-between border-b p-3">
                <span>Uang Diterima</span>

                <span>
                  Rp{" "}
                  {paidAmount.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

              <div className="flex justify-between p-3">
                <span>Kembalian</span>

                <span className="font-bold text-green-600">
                  Rp{" "}
                  {changeAmount.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

            </div>
          )}

          <div className="grid grid-cols-2 gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={onPrintReceipt}
            >
              <Printer className="mr-2 h-4 w-4" />

              Cetak Struk
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onPrintInvoice}
            >
              <FileText className="mr-2 h-4 w-4" />

              Invoice
            </Button>

          </div>

        </div>

        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">

          <Button
            type="button"
            onClick={onNewTransaction}
            className="flex-1"
          >
            <Plus className="mr-2 h-4 w-4" />

            Transaksi Baru
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            <X className="mr-2 h-4 w-4" />

            Tutup
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}