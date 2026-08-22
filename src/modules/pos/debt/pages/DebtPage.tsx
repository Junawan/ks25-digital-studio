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

export default function DebtPage() {
  const {
    debts,
    status,
    setStatus,
    loading,
    error,
    createDebt,
  } = useDebts();

  const [search, setSearch] =
    useState("");

  const filteredDebts =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return debts;
      }

      return debts.filter(
        (debt) =>
          debt.name
            .toLowerCase()
            .includes(keyword)
      );
    }, [
      debts,
      search,
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

      note:
        data.note,

      date:
        data.date,
    });
  }

  function handlePay(
    debt: Debt
  ) {
    console.log(
      "Bayar:",
      debt
    );

    // Dialog pembayaran
    // akan kita buat tahap berikutnya
  }

  function handleDetail(
    debt: Debt
  ) {
    console.log(
      "Detail:",
      debt
    );

    // Dialog detail
    // akan kita buat tahap berikutnya
  }

  function handleDelete(
    debt: Debt
  ) {
    console.log(
      "Hapus:",
      debt
    );

    // Dialog hapus
    // akan kita buat tahap berikutnya
  }

  function handleExport() {
    console.log(
      "Export Excel"
    );

    // Export Excel
    // akan kita buat setelah UI selesai
  }

  return (
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT */}
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
            loading={loading}
            onPay={handlePay}
            onDetail={handleDetail}
            onDelete={handleDelete}
          />
        </div>

        {/* RIGHT */}
        <aside className="h-fit rounded-xl border bg-card p-4 shadow-sm md:p-6">
          <DebtForm
            loading={loading}
            onSubmit={
              handleCreateDebt
            }
          />
        </aside>
      </div>
    </div>
  );
}