"use client";

import { useState } from "react";

import PageHeader
from "@/modules/pos/shared/components/PageHeader";

import { Button }
from "@/shared/components/ui/button";

import CartCard
from "../components/CartCard";

import CartSummary
from "../components/CartSummary";

import TransactionToolbar
from "../components/TransactionToolbar";

import { useTransaction }
from "../hooks/useTransaction";

export default function TransactionPage() {

  const [keyword, setKeyword] =
    useState("");

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

      <TransactionToolbar
        keyword={keyword}
        onKeywordChange={
          setKeyword
        }
        onScan={() => {}}
      />

      <CartCard
        cart={cart}
      />

      <CartSummary
        summary={summary}
      />

      <Button
        className="
        w-full
        h-12
        "
        disabled={
          cart.length === 0
        }
      >
        Bayar
      </Button>

    </div>

  );

}