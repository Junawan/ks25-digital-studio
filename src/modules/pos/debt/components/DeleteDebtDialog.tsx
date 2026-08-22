"use client";

import { Button } from "@/shared/components/ui/button";

import type { Debt } from "../types/debt";

interface Props {
  debt: Debt | null;

  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onConfirm: (
    debtId: string
  ) => Promise<void>;
}

export default function DeleteDebtDialog({
  debt,
  open,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !debt) {
    return null;
  }

  async function handleConfirm() {
    const currentDebt = debt;

  if (!currentDebt) {
    return;
  }
    await onConfirm(
      currentDebt.debtId
    );

    onClose();
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
        <h2 className="text-xl font-semibold">
          Hapus Data Hutang?
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Anda akan menghapus data hutang
          <span className="mx-1 font-semibold text-foreground">
            {debt.name}
          </span>
          beserta seluruh riwayat
          pembayarannya.
        </p>

        <p className="mt-2 text-sm text-destructive">
          Tindakan ini tidak dapat
          dibatalkan.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading
              ? "Menghapus..."
              : "Hapus"}
          </Button>
        </div>
      </div>
    </div>
  );
}