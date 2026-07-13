"use client";

import PageHeader
from "@/modules/pos/shared/components/PageHeader";

import { Button }
from "@/shared/components/ui/button";

import EmptyCart
from "../components/EmptyCart";

import CartSummary
from "../components/CartSummary";

import TransactionSearch
from "../components/TransactionSearch";

import { useTransaction }
from "../hooks/useTransaction";

export default function TransactionPage() {

  const {
    cart,
    summary,
  } =
    useTransaction();

  return (

    <div className="space-y-6">

      <PageHeader
        title="Transaksi"
        description="Penjualan POS"
      />

      <div className="space-y-5">

        <TransactionSearch />

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div>
            Cart List
          </div>
        )}

        <CartSummary
          summary={summary}
        />

        <Button
          className="w-full"
          disabled={
            cart.length === 0
          }
        >
          Bayar
        </Button>

      </div>

    </div>

  );

}