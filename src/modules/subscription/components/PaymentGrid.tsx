"use client";

import {
  Badge,
} from "@/shared/components/ui/badge";

import {
  Button,
} from "@/shared/components/ui/button";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";

import {
  useSubscriptionPayments,
} from "../hooks/useSubscriptionPayments";

import { useState } from "react";

import PaymentDetailDialog from "./PaymentDetailDialog";

import type { SubscriptionPayment } from "../subscription-payment.types";

export default function PaymentGrid() {

  const {
  payments,
  loading,
  refresh,
} = useSubscriptionPayments();

    const [
  selectedPayment,
  setSelectedPayment,
] = useState<SubscriptionPayment | null>(null);

const [
  dialogOpen,
  setDialogOpen,
] = useState(false);

  if (loading) {

    return (
      <div>

        Memuat pembayaran...

      </div>
    );

  }

  if (!payments.length) {

    return (

      <Card>

        <CardContent className="p-10 text-center">

          Belum ada pembayaran.

        </CardContent>

      </Card>

    );

  }

  return (

     <>

    <div className="space-y-4">

      {payments.map((payment) => (

        <Card
          key={payment.paymentId}
        >

          <CardContent className="space-y-4 p-5">

            <div className="flex justify-between">

              <div>

                <h3 className="font-semibold">

                  {payment.companyName}

                </h3>

                <div className="text-sm text-muted-foreground">

                  Rp
                  {payment.amount.toLocaleString("id-ID")}

                </div>

              </div>

              <Badge>

                {payment.status}

              </Badge>

            </div>

            <div className="flex justify-end">

  <Button
  onClick={() => {

    setSelectedPayment(payment);

    setDialogOpen(true);

  }}
>

  Lihat Detail

</Button>

</div>

          </CardContent>

        </Card>

      ))}

    </div>

    <PaymentDetailDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  payment={selectedPayment}
  onApproved={refresh}
/>

  </>

  );

}