"use client";

import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { formatCurrency } from "@/shared/utils/currency";

import type { Debt } from "../types/debt";

interface Props {
  debt: Debt | null;

  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (input: {
    debtId: string;
    amount: number;
    note?: string | null;
    paidAt: Date;
  }) => Promise<void>;
}

export default function PayDebtDialog({
  debt,
  open,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [date, setDate] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!debt || !open) return;

    setAmount("");
    setNote("");

    setDate(
      new Date()
        .toISOString()
        .slice(0, 10)
    );
  }, [debt, open]);

  if (!open || !debt) {
    return null;
  }

  const disabled =
    loading || submitting;

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const currentDebt = debt;

  if (!currentDebt) {
    return;
  }

    const paymentAmount =
      Number(amount);

    if (
      !paymentAmount ||
      paymentAmount <= 0
    ) {
      return;
    }

    if (
      paymentAmount >
      currentDebt.remainingAmount
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        debtId:
          currentDebt.debtId,

        amount:
          paymentAmount,

        note:
          note.trim() || null,

        paidAt:
          new Date(
            `${date}T00:00:00`
          ),
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  function handleFullPayment() {
    const currentDebt = debt;

  if (!currentDebt) {
    return;
  }
    setAmount(
      String(
        currentDebt.remainingAmount
      )
    );
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
          w-full
          max-w-md
          rounded-xl
          bg-background
          p-6
          shadow-xl
        "
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Pembayaran Hutang
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {debt.name}
          </p>
        </div>

        <div className="mb-6 rounded-lg border bg-muted/30 p-4">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              Total Hutang
            </span>

            <span className="font-medium">
              {formatCurrency(
                debt.amount
              )}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              Sudah Dibayar
            </span>

            <span className="font-medium">
              {formatCurrency(
                debt.totalPaid
              )}
            </span>
          </div>

          <div className="mt-3 flex justify-between gap-4 border-t pt-3">
            <span className="font-semibold">
              Sisa Hutang
            </span>

            <span className="font-bold">
              {formatCurrency(
                debt.remainingAmount
              )}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nominal Pembayaran
            </label>

            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max={
                  debt.remainingAmount
                }
                value={amount}
                disabled={disabled}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Masukkan nominal"
              />

              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={
                  handleFullPayment
                }
              >
                Lunasi
              </Button>
            </div>

            {Number(amount) >
              debt.remainingAmount && (
              <p className="text-sm text-destructive">
                Nominal pembayaran
                tidak boleh melebihi
                sisa hutang.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tanggal Pembayaran
            </label>

            <Input
              type="date"
              value={date}
              disabled={disabled}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Catatan
              <span className="ml-1 text-muted-foreground">
                (opsional)
              </span>
            </label>

            <textarea
              value={note}
              disabled={disabled}
              onChange={(event) =>
                setNote(
                  event.target.value
                )
              }
              placeholder="Catatan pembayaran"
              className="
                min-h-24
                w-full
                rounded-md
                border
                border-input
                bg-background
                px-3
                py-2
                text-sm
              "
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={onClose}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={
                disabled ||
                !amount ||
                Number(amount) <= 0 ||
                Number(amount) >
                  debt.remainingAmount
              }
            >
              {submitting
                ? "Menyimpan..."
                : "Simpan Pembayaran"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}