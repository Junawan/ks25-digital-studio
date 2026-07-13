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

    <div className="min-h-screen bg-zinc-950">

      <h1 className="text-3xl font-bold text-violet-400">
  Transaksi
</h1>

<p className="mt-1 text-zinc-200">
  Penjualan POS
</p>

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
  disabled={cart.length === 0}
  className="
    h-14
    w-full
    rounded-xl
    bg-emerald-600
    text-white
    hover:bg-emerald-700

    disabled:bg-zinc-300
    disabled:text-zinc-500
    disabled:opacity-100
  "
>
  Bayar
</Button>

      </div>

    </div>

  );

}