"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Download,
  Search,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { useDebts } from "../hooks/useDebts";

import DebtForm from "../components/DebtForm";
import DebtList from "../components/DebtList";

import type { Debt } from "../types/debt";
import type { DebtFormInput } from "../validation/debtSchema";

import PayDebtDialog from "../components/PayDebtDialog";
import DebtDetailDialog from "../components/DebtDetailDialog";
import DeleteDebtDialog from "../components/DeleteDebtDialog";
import { useTransactions } from "@/modules/pos/transaction/hooks/useTransactions";
import type { Transaction, PaymentMethod } from "@/modules/pos/transaction/types/transaction";
import { transactionDI } from "@/modules/pos/transaction/di/transaction";
import SettlementDialog from "@/modules/pos/transaction/components/SettlementDialog";
import { toast } from "sonner";

export default function DebtPage() {
  const {
  debts,
  status,
  setStatus,
  loading,
  error,
  createDebt,
  payDebt,
  deleteDebt,
  updateDebtorType,
} = useDebts();
  const { transactions, loading: transactionsLoading, reload: reloadTransactions } = useTransactions();

  const [search, setSearch] =
    useState("");
  const [debtorFilter, setDebtorFilter] = useState<"all" | "employee" | "customer">("all");

    const [selectedDebt, setSelectedDebt] =
  useState<Debt | null>(null);

const [payDialogOpen, setPayDialogOpen] =
  useState(false);

const [detailDialogOpen, setDetailDialogOpen] =
  useState(false);

const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [actionLoading, setActionLoading] =
  useState(false);
const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
const [settlementOpen, setSettlementOpen] = useState(false);

  const transactionDebts = useMemo(() => transactions
    .filter((transaction) => transaction.customerName?.trim() && transaction.status !== "cancelled")
    .filter((transaction) => status === "all" || transaction.status === status)
    .map((transaction) => ({
      debtId: `transaction_${transaction.transactionId}`,
      companyId: transaction.companyId,
      name: transaction.customerName,
      type: "other" as const,
      debtorType: "customer" as const,
      source: "transaction" as const,
      transactionId: transaction.transactionId,
      invoiceNumber: transaction.invoiceNumber,
      phone: transaction.customerPhone ?? "",
      amount: transaction.total,
      totalPaid: transaction.paidAmount,
      remainingAmount: transaction.remainingAmount,
      status: transaction.status === "paid" ? "paid" as const : "unpaid" as const,
      note: transaction.keterangan || null,
      date: transaction.createdAt instanceof Date ? transaction.createdAt : new Date(transaction.createdAt),
      payments: [],
      createdAt: transaction.createdAt instanceof Date ? transaction.createdAt : new Date(transaction.createdAt),
      updatedAt: transaction.updatedAt instanceof Date ? transaction.updatedAt : new Date(transaction.updatedAt),
    })), [transactions, status]);
  const allDebts = useMemo(() => [...debts, ...transactionDebts], [debts, transactionDebts]);

  const filteredDebts =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return allDebts.filter(
        (debt) =>
          (!keyword || debt.name.toLowerCase().includes(keyword) || debt.phone?.toLowerCase().includes(keyword) || debt.invoiceNumber?.toLowerCase().includes(keyword)) &&
          (debtorFilter === "all" || debt.debtorType === debtorFilter)
      );
    }, [
      allDebts,
      search,
      debtorFilter,
    ]);

  const totalRemaining =
    useMemo(() => {
      return filteredDebts.reduce(
        (
          total,
          debt
        ) =>
          total +
          debt.remainingAmount,
        0
      );
    }, [
      filteredDebts
    ]);

  async function handleCreateDebt(
    data: DebtFormInput
  ) {
    await createDebt({
      name:
        data.name,

      amount:
        data.amount,

      type:
        data.type,

      debtorType: "employee",

      note:
        data.note,

      date:
        data.date,
    });
  }

  function handlePay(debt: Debt & { transactionId?: string }) {
  if (debt.transactionId) {
    const transaction = transactions.find((item) => item.transactionId === debt.transactionId);
    if (!transaction) return;
    setSelectedTransaction(transaction);
    setSettlementOpen(true);
    return;
  }
  setSelectedDebt(debt);

  setPayDialogOpen(true);
}

async function handleTransactionSettlement(method: PaymentMethod, amount: number) {
  if (!selectedTransaction) return;
  try {
    setActionLoading(true);
    await transactionDI.settleTransactionUseCase.execute({ transactionId: selectedTransaction.transactionId, paymentMethod: method, paidAmount: amount });
    toast.success(amount >= selectedTransaction.remainingAmount ? "Transaksi berhasil dilunasi." : "Pembayaran transaksi berhasil dicatat.");
    setSettlementOpen(false);
    setSelectedTransaction(null);
    await reloadTransactions();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Gagal menyimpan pembayaran transaksi.");
  } finally {
    setActionLoading(false);
  }
}

  function handleDetail(
  debt: Debt
) {
  setSelectedDebt(debt);

  setDetailDialogOpen(true);
}

  function handleDelete(
  debt: Debt
) {
  setSelectedDebt(debt);

  setDeleteDialogOpen(true);
}

async function handlePayment(
  input: {
    debtId: string;
    amount: number;
    note?: string | null;
    paidAt: Date;
  }
) {
  try {
    setActionLoading(true);

    await payDebt(input);
  } finally {
    setActionLoading(false);
  }
}

async function handleDeleteConfirm(
  debtId: string
) {
  try {
    setActionLoading(true);

    await deleteDebt(debtId);
  } finally {
    setActionLoading(false);
  }
}

  function handleExport() {
    console.log(
      "Export Excel"
    );

    // Export Excel
    // akan kita buat setelah UI selesai
  }

  return (
  <>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hutang & Piutang
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Kelola data hutang, pembayaran,
          dan riwayat pelunasan.
        </p>
      </div>

      <aside className="rounded-xl border bg-card p-4 shadow-sm md:p-6">
        <DebtForm loading={loading} onSubmit={handleCreateDebt} />
      </aside>

      <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Cari nama pelanggan / karyawan..."
                className="pl-9"
              />
            </div>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as
                    | "unpaid"
                    | "paid"
                    | "all"
                )
              }
              className="
                h-10
                rounded-md
                border
                border-input
                bg-background
                px-3
                text-sm
              "
            >
              <option value="unpaid">
                Belum Lunas
              </option>

              <option value="paid">
                Lunas
              </option>

              <option value="all">
                Semua
              </option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />

              Export Excel
            </Button>
            <select value={debtorFilter} onChange={(event) => setDebtorFilter(event.target.value as typeof debtorFilter)} aria-label="Filter jenis debitur" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">Semua debitur</option><option value="employee">Karyawan</option><option value="customer">Pelanggan</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <p className="text-sm text-muted-foreground">
              {status === "unpaid" &&
                "Daftar menampilkan hutang yang belum lunas."}

              {status === "paid" &&
                "Daftar menampilkan hutang yang sudah lunas."}

              {status === "all" &&
                "Daftar menampilkan seluruh data hutang."}
            </p>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Total Sisa Hutang
              </p>

              <p className="text-lg font-bold">
                Rp{" "}
                {totalRemaining.toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DebtList
            debts={filteredDebts}
            loading={loading || transactionsLoading}
            onPay={handlePay}
            onDetail={handleDetail}
            onDelete={handleDelete}
            onDebtorTypeChange={(debtId, type) => void updateDebtorType(debtId, type)}
          />
        </div>
    </div>
      {selectedTransaction && <SettlementDialog key={selectedTransaction.transactionId} open={settlementOpen} onOpenChange={(open) => { setSettlementOpen(open); if (!open) setSelectedTransaction(null); }} transaction={selectedTransaction} onConfirm={handleTransactionSettlement} loading={actionLoading} />}
      <PayDebtDialog
      debt={selectedDebt}
      open={payDialogOpen}
      loading={actionLoading}
      onClose={() => {
        setPayDialogOpen(false);
        setSelectedDebt(null);
      }}
      onSubmit={handlePayment}
    />

    <DebtDetailDialog
      debt={selectedDebt}
      open={detailDialogOpen}
      onClose={() => {
        setDetailDialogOpen(false);
        setSelectedDebt(null);
      }}
    />

    <DeleteDebtDialog
      debt={selectedDebt}
      open={deleteDialogOpen}
      loading={actionLoading}
      onClose={() => {
        setDeleteDialogOpen(false);
        setSelectedDebt(null);
      }}
      onConfirm={
        handleDeleteConfirm
      }
    />
  </>
);
}
