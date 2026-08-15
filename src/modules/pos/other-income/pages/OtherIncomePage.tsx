"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";

import PageHeader from "@/modules/pos/shared/components/PageHeader";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";

import { Button } from "@/shared/components/ui/button";

import { formatCurrency } from "@/shared/utils/currency";

import OtherIncomeForm
  from "../components/OtherIncomeForm";

import OtherIncomeList
  from "../components/OtherIncomeList";

import { useOtherIncomes }
  from "../hooks/useOtherIncomes";

import { OtherIncome }
  from "../types/otherIncome";

export default function OtherIncomePage() {

  const {
    incomes,
    loading,
    error,
    reload,
    create,
    update,
    remove,
  } = useOtherIncomes();

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState(
    getCurrentMonth()
  );

  const [
    editing,
    setEditing,
  ] = useState<OtherIncome | null>(
    null
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  );

  const filteredIncomes =
    useMemo(() => {

      return incomes
        .filter(
          (income) =>
            getMonthKey(
              income.date
            ) ===
            selectedMonth
        )
        .sort(
          (a, b) =>
            b.date.getTime() -
            a.date.getTime()
        );

    }, [
      incomes,
      selectedMonth,
    ]);

  const total =
    useMemo(() => {

      return filteredIncomes.reduce(
        (sum, income) =>
          sum + income.amount,
        0
      );

    }, [
      filteredIncomes,
    ]);

  async function handleSubmit(
    input: {
      source: string;
      amount: number;
      description: string;
      date: Date;
    }
  ) {

    try {

      setSaving(true);

      if (editing) {

        await update({
          ...editing,
          ...input,
        });

        toast.success(
          "Pemasukan berhasil diperbarui."
        );

        setEditing(null);

      } else {

        await create(input);

        toast.success(
          "Pemasukan berhasil ditambahkan."
        );

      }

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pemasukan."
      );

    } finally {

      setSaving(false);

    }
  }

  function handleEdit(
    income: OtherIncome
  ) {
    setEditing(income);
  }

  function handleCancelEdit() {
    setEditing(null);
  }

  async function handleDelete(
    income: OtherIncome
  ) {

    const confirmed =
      window.confirm(
        `Hapus pemasukan "${income.source}" sebesar ${formatCurrency(income.amount)}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(
        income.incomeId
      );

      await remove(
        income.incomeId
      );

      if (
        editing?.incomeId ===
        income.incomeId
      ) {
        setEditing(null);
      }

      toast.success(
        "Pemasukan berhasil dihapus."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus pemasukan."
      );

    } finally {

      setDeletingId(null);

    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Pemasukan Lain"
        description="Kelola pemasukan di luar transaksi penjualan."
      />

      {/* FORM */}

      <Card>

        <CardHeader>
          <CardTitle>
            {editing
              ? "Edit Pemasukan"
              : "Tambah Pemasukan"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          <OtherIncomeForm
            editing={editing}
            loading={saving}
            onSubmit={
              handleSubmit
            }
            onCancelEdit={
              handleCancelEdit
            }
          />

        </CardContent>

      </Card>

      {/* FILTER */}

      <Card>

        <CardContent className="pt-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <CalendarDays className="h-4 w-4 text-muted-foreground" />

              <label className="text-sm font-medium">
                Bulan
              </label>

              <Input
                type="month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    event.target.value
                  )
                }
                className="w-[180px]"
              />

            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSelectedMonth(
                  getCurrentMonth()
                )
              }
            >
              Bulan Ini
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* ERROR */}

      {error && (
        <Card>
          <CardContent className="flex min-h-24 items-center justify-between gap-4">
            <p className="text-sm text-destructive">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void reload()
              }
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LIST */}

      {!loading && (
        <OtherIncomeList
          incomes={
            filteredIncomes
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
          deletingId={
            deletingId
          }
        />
      )}

      {loading && (
        <Card>
          <CardContent className="flex min-h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Memuat pemasukan...
            </p>
          </CardContent>
        </Card>
      )}

      {/* TOTAL */}

      {!loading &&
        filteredIncomes.length > 0 && (
          <Card>

            <CardContent className="flex items-center justify-between gap-4 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">

                  <Wallet className="h-5 w-5" />

                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Pemasukan Bulan Ini
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatMonth(
                      selectedMonth
                    )}
                  </p>
                </div>

              </div>

              <p className="text-xl font-bold">
                {formatCurrency(
                  total
                )}
              </p>

            </CardContent>

          </Card>
        )}

    </div>
  );
}

function getCurrentMonth() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  return `${year}-${month}`;
}

function getMonthKey(
  value: Date
) {
  const year =
    value.getFullYear();

  const month =
    String(
      value.getMonth() + 1
    ).padStart(2, "0");

  return `${year}-${month}`;
}

function formatMonth(
  value: string
) {
  const [
    year,
    month,
  ] = value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      1
    );

  return date.toLocaleDateString(
    "id-ID",
    {
      month: "long",
      year: "numeric",
    }
  );
}