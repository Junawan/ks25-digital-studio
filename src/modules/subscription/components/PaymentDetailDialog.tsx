"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Badge } from "@/shared/components/ui/badge";

import { Button } from "@/components/ui/button";

import type { SubscriptionPayment } from "../subscription-payment.types";

import { useState } from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import {
  approveSubscriptionPaymentUseCase,
} from "../usecases/ApproveSubscriptionPaymentUseCase";

interface Props {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  payment: SubscriptionPayment | null;

  onApproved: () => Promise<void>;

}

export default function PaymentDetailDialog({

  open,

  onOpenChange,

  payment,

  onApproved,

}: Props) {

    const {
  workspace,
  refresh,
} = useWorkspace();

const [loading, setLoading] =
  useState(false);

  if (!payment) return null;

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
  className="
    h-[85vh]
    max-w-lg
    overflow-y-auto
  "
>

        <DialogHeader>

          <DialogTitle>

            Detail Pembayaran

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4 pb-4">

          <div>

            <div className="text-sm text-muted-foreground">

              Perusahaan

            </div>

            <div className="font-semibold">

              {payment.companyName}

            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">

              Pemilik

            </div>

            <div>

              {payment.ownerName}

            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">

              Email

            </div>

            <div>

              {payment.ownerEmail}

            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">

              Paket

            </div>

            <div>

              {payment.nextPlan.toUpperCase()}

            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">

              Nominal

            </div>

            <div>

              Rp
              {payment.amount.toLocaleString("id-ID")}

            </div>

          </div>

          <div>

            <Badge>

              {payment.status}

            </Badge>

          </div>

          {payment.proofImage && (

            <div className="space-y-2">

              <div className="text-sm text-muted-foreground">

                Bukti Pembayaran

              </div>

              <Image
                src={payment.proofImage}
                alt="Bukti Pembayaran"
                width={700}
                height={900}
                className="rounded-xl border"
              />

            </div>

          )}

          <div className="flex gap-2 pt-2">

            <Button
  className="flex-1"
  disabled={loading}
  onClick={async () => {

    if (!payment || !workspace) {
      return;
    }

    try {

      setLoading(true);

      await approveSubscriptionPaymentUseCase.execute(

  payment.paymentId,

  workspace.user.userId

);

// refresh workspace
await refresh();

// refresh payment list
await onApproved();

onOpenChange(false);

    } finally {

      setLoading(false);

    }

  }}
>

  {loading
    ? "Memproses..."
    : "Approve"}

</Button>

            <Button
              variant="destructive"
              className="flex-1"
            >

              Reject

            </Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}