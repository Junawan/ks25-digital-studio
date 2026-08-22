"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  WalletCards,
} from "lucide-react";

import { toast } from "sonner";

import { useWorkspace }
from "@/core/workspace/WorkspaceProvider";

import PageHeader
from "@/modules/pos/shared/components/PageHeader";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Button }
from "@/shared/components/ui/button";

import { Input }
from "@/shared/components/ui/input";

import { formatCurrency }
from "@/shared/utils/currency";

import ExpenseForm
from "../components/ExpenseForm";

import ExpenseList
from "../components/ExpenseList";

import { useExpenses }
from "../hooks/useExpenses";

import { Expense }
from "../types/expense";

function getCurrentYear() {
  return new Date().getFullYear();
}

function getCurrentMonth() {
  return new Date().getMonth();
}

export default function ExpensePage() {

  const {
    workspace,
  } = useWorkspace();

  const companyId =
    workspace?.company?.id ?? "";

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(() => {

    const now =
      new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const [
    editingExpense,
    setEditingExpense,
  ] = useState<Expense | null>(
    null
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const {
    year,
    month,
  } = useMemo(() => {

    const [
      yearValue,
      monthValue,
    ] =
      selectedDate.split("-");

    return {
      year:
        Number(yearValue),

      month:
        Number(monthValue) - 1,
    };

  }, [
    selectedDate,
  ]);

  const {
    expenses,
    loading,
    total,
    createExpense,
    updateExpense,
    deleteExpense,
    reload,
  } = useExpenses({
    companyId,
    year,
    month,
  });

  async function handleSubmit(
    source: string,
    amount: number,
    description: string
  ) {

    try {

      setSaving(true);

      if (editingExpense) {

        await updateExpense(
          editingExpense.expenseId,
          source,
          amount,
          description
        );

        toast.success(
          "Pengeluaran berhasil diperbarui."
        );

        setEditingExpense(
          null
        );

      } else {

        await createExpense(
          source,
          amount,
          description
        );

        toast.success(
          "Pengeluaran berhasil ditambahkan."
        );

      }

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengeluaran."
      );

    } finally {

      setSaving(false);

    }
  }

  function handleEdit(
    expense: Expense
  ) {

    setEditingExpense(
      expense
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }

  function handleCancelEdit() {

    setEditingExpense(
      null
    );

  }

  async function handleDelete(
    expense: Expense
  ) {

    const confirmed =
      window.confirm(
        `Hapus pengeluaran "${expense.source}" sebesar ${formatCurrency(
          expense.amount
        )}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await deleteExpense(
        expense.expenseId
      );

      if (
        editingExpense?.expenseId ===
        expense.expenseId
      ) {

        setEditingExpense(
          null
        );

      }

      toast.success(
        "Pengeluaran berhasil dihapus."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus pengeluaran."
      );

    } finally {

      setDeleting(false);

    }
  }

  function handleCurrentMonth() {

    const now =
      new Date();

    setSelectedDate(
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`
    );

  }

  if (!companyId) {
    return null;
  }

  return (

    <div className="space-y-6">

      <PageHeader
        title="Pengeluaran"
        description="Kelola seluruh pengeluaran operasional toko."
      />

      {/* FORM */}

      <Card>

        <CardHeader>

          <CardTitle>

            {editingExpense
              ? "Edit Pengeluaran"
              : "Tambah Pengeluaran"}

          </CardTitle>

        </CardHeader>

        <CardContent>

          <ExpenseForm
            expense={
              editingExpense
            }
            loading={
              saving
            }
            onSubmit={
              handleSubmit
            }
            onCancelEdit={
              handleCancelEdit
            }
          />

        </CardContent>

      </Card>

      {/* FILTER BULAN */}

      <Card>

        <CardContent className="pt-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <CalendarDays
                className="h-5 w-5 text-muted-foreground"
              />

              <div>

                <p className="text-sm font-medium">
                  Filter Bulan
                </p>

                <p className="text-xs text-muted-foreground">
                  Pilih bulan untuk melihat pengeluaran.
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <Input
                type="month"
                value={
                  selectedDate
                }
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="w-[180px]"
              />

              <Button
                type="button"
                variant="outline"
                onClick={
                  handleCurrentMonth
                }
              >
                Bulan Ini
              </Button>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* DAFTAR PENGELUARAN */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle>
            Riwayat Pengeluaran
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() =>
              reload()
            }
          >
            Muat Ulang
          </Button>

        </CardHeader>

        <CardContent>

          <ExpenseList
            expenses={
              expenses
            }
            loading={
              loading
            }
            onEdit={
              handleEdit
            }
            onDelete={
              handleDelete
            }
          />

        </CardContent>

      </Card>

      {/* TOTAL */}

      <Card>

        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">

              <WalletCards
                className="h-5 w-5"
              />

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Total Pengeluaran
              </p>

              <p className="font-medium">

                {new Date(
                  year,
                  month,
                  1
                ).toLocaleDateString(
                  "id-ID",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}

              </p>

            </div>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-2xl font-bold">

              {formatCurrency(
                total
              )}

            </p>

            <p className="text-sm text-muted-foreground">

              {expenses.length} data pengeluaran

            </p>

          </div>

        </CardContent>

      </Card>

    </div>

  );
}