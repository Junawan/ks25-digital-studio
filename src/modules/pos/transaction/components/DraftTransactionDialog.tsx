"use client";

import type {
  DraftTransaction,
} from "../types/draftTransaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import {
  Button,
} from "@/shared/components/ui/button";

interface DraftTransactionDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  drafts: DraftTransaction[];

  loading: boolean;

  onContinue: (
    draft: DraftTransaction
  ) => void;

  onDelete: (
    draft: DraftTransaction
  ) => void;

}

export default function DraftTransactionDialog({
  open,
  onOpenChange,
  drafts,
  loading,
  onContinue,
  onDelete,
}: DraftTransactionDialogProps) {

  function getItemCount(
    draft: DraftTransaction
  ) {

    return draft.cart.reduce(
      (
        total,
        item
      ) =>
        total + item.qty,
      0
    );

  }

  function getTotal(
    draft: DraftTransaction
  ) {

    const subtotal =
      draft.cart.reduce(
        (
          total,
          item
        ) =>
          total +
          (
            item.price *
            item.qty
          ),
        0
      );

    return Math.max(
      0,
      subtotal - draft.discount
    );

  }

  return (

    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent
        className="
          max-w-lg
          max-h-[80vh]
          overflow-y-auto
        "
      >

        <DialogHeader>

          <DialogTitle>
            Transaksi Tersimpan
          </DialogTitle>

        </DialogHeader>

        {loading && (

          <div className="py-8 text-center">

            Memuat transaksi...

          </div>

        )}

        {!loading &&
          drafts.length === 0 && (

          <div className="py-8 text-center text-muted-foreground">

            Belum ada transaksi tersimpan.

          </div>

        )}

        <div className="space-y-4">

          {drafts.map(
            (draft) => (

              <div
                key={
                  draft.draftId
                }
                className="
                  border
                  rounded-lg
                  p-4
                  space-y-3
                "
              >

                <div>

                  <div className="font-semibold">

                    {draft.customer ||
                      "Pelanggan Umum"}

                  </div>

                  <div className="text-sm text-muted-foreground">

                    {getItemCount(
                      draft
                    )} barang
                    {" • "}
                    {getTotal(
                      draft
                    ).toLocaleString(
                      "id-ID",
                      {
                        style:
                          "currency",
                        currency:
                          "IDR",
                        maximumFractionDigits:
                          0,
                      }
                    )}

                  </div>

                </div>

                <div className="text-sm text-muted-foreground">

                  {draft.createdAt
                    .toLocaleString(
                      "id-ID"
                    )}

                </div>

                <div className="flex gap-2">

                  <Button
                    className="flex-1"
                    onClick={() =>
                      onContinue(
                        draft
                      )
                    }
                  >

                    Lanjutkan

                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      onDelete(
                        draft
                      )
                    }
                  >

                    Hapus

                  </Button>

                </div>

              </div>

            )
          )}

        </div>

      </DialogContent>

    </Dialog>

  );

}