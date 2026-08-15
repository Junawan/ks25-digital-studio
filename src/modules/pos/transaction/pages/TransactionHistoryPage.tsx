"use client";

import { History } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/modules/pos/shared/components/PageHeader";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";

import TransactionHistoryCard from "../components/TransactionHistoryCard";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from "../types/transaction";

export default function TransactionHistoryPage() {
  const {
    transactions,
    loading,
    error,
    reload,
    remove,
  } = useTransactions();

  async function handleDelete(
    transaction: Transaction
  ) {
    const confirmed = window.confirm(
      `Hapus transaksi ${transaction.invoiceNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await remove(
        transaction.transactionId
      );

      toast.success(
        "Transaksi berhasil dihapus."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus transaksi."
      );
    }
  }

  async function handlePrintReceipt(
    transaction: Transaction
  ) {
    console.log(
      "Cetak struk:",
      transaction.invoiceNumber
    );
  }

  async function handlePrintInvoice(
    transaction: Transaction
  ) {
    console.log(
      "Cetak invoice:",
      transaction.invoiceNumber
    );
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Riwayat Transaksi"
        description="Daftar seluruh transaksi penjualan"
      />

      {loading && (
        <Card>
          <CardContent className="flex min-h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Memuat transaksi...
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="flex min-h-32 flex-col items-center justify-center gap-3">

            <p className="text-sm text-destructive">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void reload()}
              className="text-sm underline"
            >
              Coba lagi
            </button>

          </CardContent>
        </Card>
      )}

      {!loading &&
        !error &&
        transactions.length === 0 && (
          <Card>
            <CardContent className="flex min-h-64 flex-col items-center justify-center">

              <History className="mb-3 h-10 w-10 text-muted-foreground" />

              <h3 className="font-semibold">
                Belum Ada Transaksi
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Transaksi penjualan akan
                muncul di sini.
              </p>

            </CardContent>
          </Card>
        )}

      {!loading &&
        !error &&
        transactions.length > 0 && (
          <div className="space-y-4">

            {transactions.map(
              (transaction) => (
                <TransactionHistoryCard
                  key={
                    transaction.transactionId
                  }
                  transaction={
                    transaction
                  }
                  onPrintReceipt={
                    handlePrintReceipt
                  }
                  onPrintInvoice={
                    handlePrintInvoice
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}

          </div>
        )}

    </div>
  );
}